/**
 * Borrower Copilot - Maximum Amount Engine (O2)
 * Computes Lender-likely Sanction vs Safe Amount with explicit constraints.
 * Follows Section 5.2 of the implementation plan.
 */

import { RULES_CONFIG } from '../../../data/rules-config';
import { AmountResult, BorrowerProfile, RiskTier } from '../schema';
import { FoirEvaluationResult, isStrongCollateral } from './foir';

export interface AmountCalculationInput {
  profile: Partial<BorrowerProfile>;
  assessedMonthlyIncome: number;
  foirResult: FoirEvaluationResult;
  nominalAnnualRate: number;
  tenureYears: number;
}

/**
 * Converts a monthly EMI capacity into a principal loan amount using the reverse EMI formula:
 * P = EMI * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
 */
export function principalFromEmi(monthlyEmi: number, annualRatePercent: number, tenureYears: number): number {
  if (monthlyEmi <= 0) return 0;
  const monthlyRate = annualRatePercent / 12 / 100;
  const n = Math.max(12, tenureYears * 12);

  if (monthlyRate === 0) return Math.round(monthlyEmi * n);

  const factor = Math.pow(1 + monthlyRate, n);
  const principal = (monthlyEmi * (factor - 1)) / (monthlyRate * factor);
  return Math.round(principal);
}

export function evaluateMaximumAmounts(input: AmountCalculationInput): AmountResult {
  const { profile, assessedMonthlyIncome, foirResult, nominalAnnualRate, tenureYears } = input;
  const existingEmis = profile.existingEmiTotal || 0;
  const essentialExpenses = profile.essentialExpenses || 0;
  const requestedAmount = profile.amountWanted || 0;

  // 1. Lender FOIR Capacity
  const lenderMaxMonthlyEmi = Math.max(0, assessedMonthlyIncome * foirResult.adjustedLenderCap - existingEmis);
  const foirCapacityAmount = principalFromEmi(lenderMaxMonthlyEmi, nominalAnnualRate, tenureYears);

  // 2. Secured vs Unsecured Ceilings
  const hasStrongAsset = foirResult.isCollateralStrong;
  let ltvCapacityAmount: number | undefined;
  let incomeMultipleAmount: number | undefined;

  const candidateCaps: { amount: number; reason: string }[] = [
    {
      amount: foirCapacityAmount,
      reason: `Lender FOIR ceiling of ${Math.round(foirResult.adjustedLenderCap * 100)}% leaves ₹${Math.round(lenderMaxMonthlyEmi).toLocaleString('en-IN')}/month available for debt service.`,
    },
  ];

  if (hasStrongAsset) {
    // Secured Product: LTV Ceiling applies; NO income multiple ceiling!
    const assetVal = profile.collateralValue || requestedAmount * 1.5;
    let ltvCap: number = RULES_CONFIG.LTV_CEILINGS.withoutPriorLoanHistory; // 50%
    if (profile.collateralType === 'gold') {
      ltvCap = RULES_CONFIG.LTV_CEILINGS.goldRegulatoryMax; // 75%
    } else if (profile.hasPriorLoanHistory) {
      ltvCap = RULES_CONFIG.LTV_CEILINGS.withPriorLoanHistory; // 60%
    }

    ltvCapacityAmount = Math.round(assetVal * ltvCap);
    candidateCaps.push({
      amount: ltvCapacityAmount,
      reason: `Asset LTV ceiling of ${Math.round(ltvCap * 100)}% on collateral valued at ₹${assetVal.toLocaleString('en-IN')}.`,
    });
  } else {
    // Unsecured Product: Income Multiple Ceiling applies
    let multiple: number = RULES_CONFIG.INCOME_MULTIPLES.salariedSubprime; // 8x default
    const empType = profile.employmentType || 'salaried';
    const score = profile.creditScore;

    if (empType === 'salaried') {
      if (typeof score === 'number' && score >= 750) {
        multiple = RULES_CONFIG.INCOME_MULTIPLES.salariedPrime; // 24x
      } else if (typeof score === 'number' && score >= 650) {
        multiple = RULES_CONFIG.INCOME_MULTIPLES.salariedNearPrime; // 15x
      } else {
        multiple = RULES_CONFIG.INCOME_MULTIPLES.salariedSubprime; // 8x
      }
    } else if (empType === 'self_employed_formal') {
      multiple = RULES_CONFIG.INCOME_MULTIPLES.selfEmployedFormal; // 10x
    } else {
      multiple = RULES_CONFIG.INCOME_MULTIPLES.informal; // 6x
    }

    incomeMultipleAmount = Math.round(assessedMonthlyIncome * multiple);
    candidateCaps.push({
      amount: incomeMultipleAmount,
      reason: `Unsecured income-multiple ceiling of ${multiple}x assessed monthly income (₹${assessedMonthlyIncome.toLocaleString('en-IN')}).`,
    });
  }

  // Lender Sanction = smallest of candidate ceilings
  candidateCaps.sort((a, b) => a.amount - b.amount);
  const lenderSanctionAmount = candidateCaps[0].amount;
  const lenderCapReason = candidateCaps[0].reason;

  // 3. Safe Amount Calculation
  // Must satisfy both Safe FOIR and Residual Income check >= 15%
  const safeFoirMaxMonthlyEmi = Math.max(0, assessedMonthlyIncome * foirResult.adjustedSafeCap - existingEmis);
  const safeFoirAmount = principalFromEmi(safeFoirMaxMonthlyEmi, nominalAnnualRate, tenureYears);

  // Residual income: income - essentials - existingEmis - newEmi >= 15% * income
  // => newEmi <= income * 0.85 - essentials - existingEmis
  const minResidualBuffer = assessedMonthlyIncome * RULES_CONFIG.RESIDUAL_INCOME_MIN_BUFFER_SHARE;
  const residualEmiMax = Math.max(0, assessedMonthlyIncome - essentialExpenses - existingEmis - minResidualBuffer);
  const residualIncomeSafeAmount = principalFromEmi(residualEmiMax, nominalAnnualRate, tenureYears);

  let safeAmount = Math.min(safeFoirAmount, residualIncomeSafeAmount);
  let safeCapReason = `Safe FOIR cap of ${Math.round(foirResult.adjustedSafeCap * 100)}% leaves ₹${Math.round(safeFoirMaxMonthlyEmi).toLocaleString('en-IN')}/month.`;

  if (residualIncomeSafeAmount < safeFoirAmount) {
    safeCapReason = `Residual income rule: after ₹${essentialExpenses.toLocaleString('en-IN')} essential expenses and existing debt, a 15% cashflow buffer (₹${Math.round(minResidualBuffer).toLocaleString('en-IN')}) requires capping monthly EMI at ₹${Math.round(residualEmiMax).toLocaleString('en-IN')}.`;
  }

  // Round amounts to nearest thousand
  safeAmount = Math.max(0, Math.round(safeAmount / 1000) * 1000);
  const roundedLenderSanction = Math.max(0, Math.round(lenderSanctionAmount / 1000) * 1000);

  // Difference note and guidance
  const difference = roundedLenderSanction - safeAmount;
  let differenceNote = 'Lender and safe amounts match closely for your profile.';
  if (difference > 0) {
    differenceNote = `The lender may sanction up to ₹${roundedLenderSanction.toLocaleString('en-IN')}, but borrowing beyond ₹${safeAmount.toLocaleString('en-IN')} leaves your household with minimal shock absorption.`;
  }

  // Co-applicant potential sanction
  let coApplicantPotentialSanction: number | undefined;
  if (profile.coApplicantMonthlyIncome) {
    const combinedIncome = assessedMonthlyIncome + profile.coApplicantMonthlyIncome;
    const combinedLenderEmi = Math.max(0, combinedIncome * foirResult.adjustedLenderCap - existingEmis);
    coApplicantPotentialSanction = principalFromEmi(combinedLenderEmi, nominalAnnualRate, tenureYears);
  } else if (requestedAmount > safeAmount) {
    // Surface what an earning co-applicant (e.g. spouse earning ₹25k - ₹35k) would unlock
    const hypotheticalHouseholdIncome = assessedMonthlyIncome + 28000;
    const hypotheticalEmi = Math.max(0, hypotheticalHouseholdIncome * foirResult.adjustedLenderCap - existingEmis);
    coApplicantPotentialSanction = principalFromEmi(hypotheticalEmi, nominalAnnualRate, tenureYears);
  }

  return {
    lenderSanctionAmount: roundedLenderSanction,
    safeAmount,
    requestedAmount,
    recommendedToUse: 'safe',
    lenderCapReason,
    safeCapReason,
    differenceNote,
    foirCapacityAmount,
    ltvCapacityAmount,
    incomeMultipleAmount,
    residualIncomeSafeAmount,
    coApplicantPotentialSanction,
  };
}
