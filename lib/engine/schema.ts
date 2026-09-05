/**
 * Borrower Copilot - Schema & Types
 * Defines the BorrowerProfile, input models, and derived metrics.
 * Free of React dependencies.
 */

export type LoanPurpose =
  | 'wedding_discretionary'
  | 'medical'
  | 'education'
  | 'home'
  | 'personal_vehicle'
  | 'commercial_vehicle'
  | 'business_stock_equipment'
  | 'debt_consolidation'
  | 'other';

export type EmploymentType =
  | 'salaried'
  | 'self_employed_formal'
  | 'informal_gig';

export type CreditScoreInput = number | 'unknown';

export type RiskTier = 'prime' | 'near_prime' | 'subprime' | 'unscored';

export type ConfidenceLevel = 'wide' | 'medium' | 'narrow';

export type CollateralType =
  | 'none'
  | 'property'
  | 'gold'
  | 'fixed_deposit'
  | 'vehicle';

export type VerdictDecision = 'Borrow' | 'Borrow less' | "Don't borrow now";

export interface BorrowerProfile {
  // 9 Must Questions
  purpose: LoanPurpose;
  amountWanted: number;
  employmentType: EmploymentType;
  netMonthlyIncome: number;
  incomeMin?: number;
  incomeMax?: number;
  itrAnnualIncome?: number;        // For formal self-employed
  cashMonthlyIncome?: number;      // Midpoint or self-declared cash for formal self-employed
  yearsInJobOrBusiness: number;
  existingEmiTotal: number;
  essentialExpenses: number;
  age: number;
  creditScore: CreditScoreInput;

  // 11 Additional / Adaptive Questions
  variableIncomeShare?: number;    // e.g. 0.25 for 25%
  hasCreditCard?: boolean;
  creditCardUtilisation?: number;  // percentage 0 - 100
  hasBounceInLast12Months?: boolean;
  monthsSinceLastBounce?: number;  // 1 to 12
  savingsBufferMonths?: number;    // Months of expenses held
  collateralType?: CollateralType;
  collateralValue?: number;
  hasPriorLoanHistory?: boolean;
  hasCoApplicant?: boolean;
  coApplicantMonthlyIncome?: number;
  coApplicantRelationship?: string;
  upcomingLumpSumExpenseIn12m?: number;
  isProductiveLoan?: boolean;
  expectedMonthlyReturn?: number;
  isReturnVerified?: boolean;
  hasHighCostDebt?: boolean;
  highCostDebtShare?: number;      // share of existing debt > 24%
  isDebtConsolidationSelected?: boolean;
  existingLenderQuote?: {
    lenderName?: string;
    nominalRate: number;
    processingFeePercent: number;
    tenureYears: number;
  };
  informalDigitalPaymentHistory?: boolean;
  informalIncomeSourcesCount?: number;

  // Manual flag to indicate which optional questions have been explicitly reviewed/answered
  answeredQuestionIds?: string[];
}

export interface DerivedProfileMetrics {
  assessedIncome: number;
  incomeHaircutPercent: number;
  currentFoir: number;
  riskTier: RiskTier;
  confidenceLevel: ConfidenceLevel;
  answeredAdditionalQuestionsCount: number;
  applicableAdditionalQuestionsCount: number;
  confidenceRatio: number;
  maxTenureYears: number;
  isCollateralStrong: boolean;
}

export interface VerdictResult {
  verdict: VerdictDecision;
  primaryReason: string;
  contributingFactors: string[];
  isHardBlock: boolean;
  recommendedAction: string;
  debtRemediationRoadmap?: string[];
}

export interface AmountResult {
  lenderSanctionAmount: number;
  safeAmount: number;
  requestedAmount: number;
  recommendedToUse: 'safe' | 'lender';
  lenderCapReason: string;
  safeCapReason: string;
  differenceNote: string;
  foirCapacityAmount: number;
  ltvCapacityAmount?: number;
  incomeMultipleAmount?: number;
  residualIncomeSafeAmount: number;
  coApplicantPotentialSanction?: number;
}

export interface RateResult {
  productName: string;
  minNominalRate: number;
  maxNominalRate: number;
  expectedNominalRate: number;
  aprMin: number;
  aprMax: number;
  aprExpected: number;
  effectiveFeePercent: number;
  rateFactors: string[];
  isHighCostWarning: boolean;
}

export interface TenureOption {
  tenureYears: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterestPaid: number;
  totalPayment: number;
  foirShare: number;
  isRecommended: boolean;
}

export interface StressTestResult {
  incomeShockPercent: number;
  rateShockBps: number;
  stressedMonthlyIncome: number;
  stressedRate: number;
  stressedEmi: number;
  stressedPostLoanFoir: number;
  isOverLenderCap: boolean;
  warningMessage?: string;
}

export interface EmiResult {
  recommendedTenureYears: number;
  safeEmiCeiling: number;
  lenderEmiCeiling: number;
  tenureTable: TenureOption[];
  stressTest: StressTestResult;
}

export interface NegotiationCardData {
  loanType: string;
  amountRequested: number;
  fairRateBandText: string;
  aprRangeText: string;
  topTwoRateFactors: string;
  safeEmiCeilingText: string;
  tenureTradeOffNote: string;
  safeAmount: number;
  lenderSanctionAmount: number;
  safeAmountReason: string;
  lenderSanctionReason: string;
  recommendedAmountGuidance: string;
  quoteComparisonNotes: {
    lenderQuoteGiven?: number;
    differenceFromFair?: number;
    talkTrack: string;
  };
  confidenceNote: string;
}

export interface FullEvaluationResult {
  profile: BorrowerProfile;
  metrics: DerivedProfileMetrics;
  o1Verdict: VerdictResult;
  o2Amount: AmountResult;
  o3Rate: RateResult;
  o4Emi: EmiResult;
  negotiationCard: NegotiationCardData;
}
