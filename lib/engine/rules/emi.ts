/**
 * Borrower Copilot - EMI Ceiling, Tenure Trade-offs, and Stress Engine (O4)
 * Pure functions computing monthly ceilings, multi-tenure tables, and combined worst-case stress tests.
 * Follows Section 5.4 of the implementation plan.
 */

import { RULES_CONFIG } from '../../../data/rules-config';
import { BorrowerProfile, EmiResult, StressTestResult, TenureOption } from '../schema';
import { FoirEvaluationResult } from './foir';

export interface EmiCalculationInput {
  profile: Partial<BorrowerProfile>;
  safeAmount: number;
  lenderSanctionAmount: number;
  assessedMonthlyIncome: number;
  nominalAnnualRate: number;
  recommendedTenureYears: number;
  foirResult: FoirEvaluationResult;
}

/**
 * Calculates monthly EMI for a given principal, annual interest rate, and tenure in years.
 */
export function calculateMonthlyEmi(principal: number, annualRatePercent: number, tenureYears: number): number {
  if (principal <= 0) return 0;
  const r = annualRatePercent / 12 / 100;
  const n = Math.max(12, tenureYears * 12);

  if (r === 0) return Math.round(principal / n);

  const factor = Math.pow(1 + r, n);
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi);
}

export function evaluateEmiAndStress(input: EmiCalculationInput): EmiResult {
  const {
    profile,
    safeAmount,
    lenderSanctionAmount,
    assessedMonthlyIncome,
    nominalAnnualRate,
    recommendedTenureYears,
    foirResult,
  } = input;

  const existingEmis = profile.existingEmiTotal || 0;
  const purpose = profile.purpose || 'wedding_discretionary';

  // Determine tenure points appropriate for product type
  let tenureYearsList: number[] = [2, 3, 5];
  if (purpose === 'home') {
    tenureYearsList = [10, 15, 20];
  } else if (purpose === 'commercial_vehicle' || purpose === 'business_stock_equipment') {
    tenureYearsList = [3, 5, 7];
  } else if (purpose === 'personal_vehicle') {
    tenureYearsList = [2, 3, 4];
  }

  // Cap tenure based on borrower age (repayment before age 60/65)
  const maxAllowableYears = Math.max(1, (profile.employmentType === 'salaried' ? 60 : 65) - (profile.age || 30));
  tenureYearsList = tenureYearsList.map((t) => Math.min(t, maxAllowableYears));
  // Deduplicate and sort
  tenureYearsList = Array.from(new Set(tenureYearsList)).sort((a, b) => a - b);

  // Use the safe amount as the baseline debt ceiling
  const baselinePrincipal = safeAmount > 0 ? safeAmount : profile.amountWanted || 50000;

  const tenureTable: TenureOption[] = tenureYearsList.map((tYears) => {
    const months = tYears * 12;
    const emi = calculateMonthlyEmi(baselinePrincipal, nominalAnnualRate, tYears);
    const totalPayment = emi * months;
    const totalInterest = Math.max(0, totalPayment - baselinePrincipal);
    const foirShare = assessedMonthlyIncome > 0 ? (existingEmis + emi) / assessedMonthlyIncome : 0;

    return {
      tenureYears: tYears,
      tenureMonths: months,
      monthlyEmi: emi,
      totalInterestPaid: totalInterest,
      totalPayment,
      foirShare,
      isRecommended: tYears === recommendedTenureYears,
    };
  });

  const safeEmiCeiling = calculateMonthlyEmi(safeAmount, nominalAnnualRate, recommendedTenureYears);
  const lenderEmiCeiling = calculateMonthlyEmi(lenderSanctionAmount, nominalAnnualRate, recommendedTenureYears);

  // Combined Worst-Case Stress Test:
  // Income Shock: -25%
  // Rate Shock: +150 bps (+1.50%)
  const incomeShockPercent = RULES_CONFIG.STRESS_TEST.incomeShockPercent; // -0.25
  const rateShockBps = RULES_CONFIG.STRESS_TEST.rateShockBps; // 150
  const rateShockPercent = rateShockBps / 100; // 1.50%

  const stressedIncome = Math.round(assessedMonthlyIncome * (1 + incomeShockPercent));
  const stressedRate = Number((nominalAnnualRate + rateShockPercent).toFixed(2));
  const stressedEmi = calculateMonthlyEmi(baselinePrincipal, stressedRate, recommendedTenureYears);

  const stressedPostLoanFoir = stressedIncome > 0 ? (existingEmis + stressedEmi) / stressedIncome : 1.0;
  const isOverLenderCap = stressedPostLoanFoir > foirResult.adjustedLenderCap;

  let warningMessage: string | undefined;
  if (isOverLenderCap) {
    const foirPercent = Math.round(stressedPostLoanFoir * 100);
    warningMessage = `In this scenario your EMI would take up ${foirPercent}% of your income, above what is considered safe. Consider a longer tenure or a smaller loan.`;
  }

  const stressTest: StressTestResult = {
    incomeShockPercent: Math.round(incomeShockPercent * 100),
    rateShockBps,
    stressedMonthlyIncome: stressedIncome,
    stressedRate,
    stressedEmi,
    stressedPostLoanFoir,
    isOverLenderCap,
    warningMessage,
  };

  return {
    recommendedTenureYears,
    safeEmiCeiling,
    lenderEmiCeiling,
    tenureTable,
    stressTest,
  };
}
