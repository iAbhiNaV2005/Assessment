/**
 * Borrower Copilot - Pure Domain Rules Engine
 * Single orchestrator running all pure calculations without React dependencies.
 */

import {
  BorrowerProfile,
  DerivedProfileMetrics,
  FullEvaluationResult,
  RiskTier,
} from './schema';
import { calculateConfidence } from './confidence';
import { calculateAssessedIncome } from './rules/segments';
import { calculateFoirCaps } from './rules/foir';
import { evaluateRateAndApr } from './rules/rate';
import { evaluateMaximumAmounts } from './rules/amount';
import { evaluateEmiAndStress } from './rules/emi';
import { evaluateVerdict } from './rules/decision';
import { assembleNegotiationCard } from './card';

export * from './schema';
export * from './questions';
export * from './confidence';
export * from './rules/segments';
export * from './rules/foir';
export * from './rules/rate';
export * from './rules/amount';
export * from './rules/emi';
export * from './rules/decision';
export * from './card';

export function evaluateBorrowerProfile(
  profile: Partial<BorrowerProfile>,
  quoteOverride?: number
): FullEvaluationResult {
  // 1. Assessed Income
  const incomeResult = calculateAssessedIncome(profile);
  const assessedIncome = incomeResult.assessedMonthlyIncome;

  // 2. FOIR Evaluation
  const foirResult = calculateFoirCaps(profile, assessedIncome);

  // 3. Confidence Metrics
  const confidence = calculateConfidence(profile);

  // 4. Default Recommended Tenure
  let recommendedTenureYears = 3;
  const purpose = profile.purpose || 'wedding_discretionary';
  const hasStrongCollateral = foirResult.isCollateralStrong;

  if (purpose === 'home') {
    recommendedTenureYears = 15;
  } else if (hasStrongCollateral && (purpose === 'commercial_vehicle' || purpose === 'business_stock_equipment' || purpose === 'other')) {
    // Secured long-tenure product backed by real estate / commercial premises
    recommendedTenureYears = 7;
  } else if (purpose === 'commercial_vehicle' || purpose === 'business_stock_equipment') {
    recommendedTenureYears = 5;
  } else if (purpose === 'personal_vehicle') {
    recommendedTenureYears = 3;
  }

  // Cap tenure based on age
  const maxYears = Math.max(1, (profile.employmentType === 'salaried' ? 60 : 65) - (profile.age || 30));
  recommendedTenureYears = Math.min(recommendedTenureYears, maxYears);

  // 5. O3 Fair Rate and APR
  const rateResult = evaluateRateAndApr({
    profile,
    loanAmount: profile.amountWanted || 100000,
    tenureYears: recommendedTenureYears,
  });

  // 6. O2 Maximum Amounts (Lender Sanction vs Safe Amount)
  const amountResult = evaluateMaximumAmounts({
    profile,
    assessedMonthlyIncome: assessedIncome,
    foirResult,
    nominalAnnualRate: rateResult.expectedNominalRate,
    tenureYears: recommendedTenureYears,
  });

  // 7. O4 EMI Ceilings & Combined Stress Test
  const emiResult = evaluateEmiAndStress({
    profile,
    safeAmount: amountResult.safeAmount,
    lenderSanctionAmount: amountResult.lenderSanctionAmount,
    assessedMonthlyIncome: assessedIncome,
    nominalAnnualRate: rateResult.expectedNominalRate,
    recommendedTenureYears,
    foirResult,
  });

  // 8. O1 Verdict Decision Tree
  const existingEmis = profile.existingEmiTotal || 0;
  const postLoanFoir = assessedIncome > 0 ? (existingEmis + emiResult.safeEmiCeiling) / assessedIncome : 1.0;

  const verdictResult = evaluateVerdict({
    profile,
    safeAmount: amountResult.safeAmount,
    postLoanFoir,
    foirResult,
  });

  // 9. Negotiation Card Assembly
  const negotiationCard = assembleNegotiationCard({
    profile,
    o2Amount: amountResult,
    o3Rate: rateResult,
    o4Emi: emiResult,
    confidence,
    actualQuote: quoteOverride,
  });

  // Risk Tier derivation
  let riskTier: RiskTier = 'near_prime';
  if (typeof profile.creditScore === 'number') {
    if (profile.creditScore >= 750) riskTier = 'prime';
    else if (profile.creditScore >= 680) riskTier = 'near_prime';
    else riskTier = 'subprime';
  } else {
    riskTier = 'unscored';
  }

  const metrics: DerivedProfileMetrics = {
    assessedIncome,
    incomeHaircutPercent: incomeResult.haircutPercent,
    currentFoir: foirResult.currentFoir,
    riskTier,
    confidenceLevel: confidence.confidenceLevel,
    answeredAdditionalQuestionsCount: confidence.answeredCount,
    applicableAdditionalQuestionsCount: confidence.applicableCount,
    confidenceRatio: confidence.ratio,
    maxTenureYears: maxYears,
    isCollateralStrong: foirResult.isCollateralStrong,
  };

  return {
    profile: profile as BorrowerProfile,
    metrics,
    o1Verdict: verdictResult,
    o2Amount: amountResult,
    o3Rate: rateResult,
    o4Emi: emiResult,
    negotiationCard,
  };
}

/**
 * Pre-defined canonical test personas from Section 9
 */
export const CANONICAL_PERSONAS: Record<string, Partial<BorrowerProfile>> = {
  priya: {
    purpose: 'other',
    amountWanted: 800000,
    employmentType: 'salaried',
    netMonthlyIncome: 110000,
    yearsInJobOrBusiness: 5,
    existingEmiTotal: 14000,
    essentialExpenses: 40000,
    age: 31,
    creditScore: 790,
    variableIncomeShare: 0.10,
    hasCreditCard: true,
    creditCardUtilisation: 22,
    hasBounceInLast12Months: false,
    savingsBufferMonths: 6,
    collateralType: 'none',
    hasPriorLoanHistory: true,
    hasCoApplicant: false,
    upcomingLumpSumExpenseIn12m: 0,
    isProductiveLoan: false,
    answeredQuestionIds: ['q1_purpose', 'q2_amount_wanted', 'q3_employment_type', 'q4_income', 'q5_years_experience', 'q6_existing_emis', 'q7_essential_expenses', 'q8_age', 'q9_credit_score', 'q10_variable_income', 'q12_credit_card_utilisation', 'q13_recent_bounces', 'q14_savings_buffer', 'q15_collateral', 'q16_co_applicant'],
  },
  ravi: {
    purpose: 'commercial_vehicle',
    amountWanted: 1500000,
    employmentType: 'self_employed_formal',
    netMonthlyIncome: 47500,
    itrAnnualIncome: 420000,
    cashMonthlyIncome: 60000,
    variableIncomeShare: 0.45, // >40% -> 20% haircut -> 38,000 assessed income
    yearsInJobOrBusiness: 14,
    existingEmiTotal: 0,
    essentialExpenses: 20000,
    age: 42,
    creditScore: 'unknown',
    collateralType: 'property', // Unencumbered commercial premises
    collateralValue: 4500000,
    hasPriorLoanHistory: false,
    hasBounceInLast12Months: false,
    savingsBufferMonths: 3,
    hasCoApplicant: false,
    coApplicantMonthlyIncome: 28000, // Available to bridge if added
    isProductiveLoan: true,
    expectedMonthlyReturn: 35000,
    isReturnVerified: true,
    answeredQuestionIds: ['q1_purpose', 'q2_amount_wanted', 'q3_employment_type', 'q4_income', 'q5_years_experience', 'q6_existing_emis', 'q7_essential_expenses', 'q8_age', 'q9_credit_score', 'q10_variable_income', 'q13_recent_bounces', 'q14_savings_buffer', 'q15_collateral', 'q16_co_applicant', 'q18_productive_return'],
  },
  anita: {
    purpose: 'personal_vehicle',
    amountWanted: 45000,
    employmentType: 'informal_gig',
    netMonthlyIncome: 28000,
    incomeMin: 25000,
    incomeMax: 31000,
    yearsInJobOrBusiness: 3,
    existingEmiTotal: 9500, // 3 app loans at 30%+ APR
    essentialExpenses: 14000,
    age: 27,
    creditScore: 'unknown',
    hasHighCostDebt: true,
    highCostDebtShare: 1.0, // 100% of existing debt is high-cost app debt
    isDebtConsolidationSelected: false,
    hasBounceInLast12Months: true,
    monthsSinceLastBounce: 1, // Bounced within last month
    savingsBufferMonths: 0.5, // Living paycheck to paycheck
    collateralType: 'vehicle', // Vehicle hypothecation does not count as strong collateral
    hasPriorLoanHistory: false,
    hasCoApplicant: false,
    isProductiveLoan: false,
    informalDigitalPaymentHistory: true,
    answeredQuestionIds: ['q1_purpose', 'q2_amount_wanted', 'q3_employment_type', 'q4_income', 'q5_years_experience', 'q6_existing_emis', 'q7_essential_expenses', 'q8_age', 'q9_credit_score', 'q11_high_cost_debt', 'q13_recent_bounces', 'q14_savings_buffer', 'q15_collateral', 'q20_informal_digital_footprint'],
  },
};
