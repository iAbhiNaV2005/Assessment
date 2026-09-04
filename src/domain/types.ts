export type EmploymentType = 'salaried' | 'self_employed' | 'informal';

export type LoanPurpose = 
  | 'wedding' 
  | 'business_expansion' 
  | 'vehicle_asset' 
  | 'home_renovation' 
  | 'medical_emergency' 
  | 'debt_consolidation' 
  | 'consumption_other';

export type LoanProductType = 
  | 'personal_unsecured' 
  | 'lap_secured' 
  | 'msme_secured' 
  | 'two_wheeler_ev' 
  | 'gold_loan' 
  | 'microfinance_mfi';

export type VerdictType = 'BORROW' | 'BORROW_LESS' | 'DONT_BORROW';

export interface BorrowerProfile {
  // Tier 1: Core Must Questions
  name: string;
  age: number;
  city: string;
  employmentType: EmploymentType;
  monthlyIncome: number;
  incomeMin?: number;
  incomeMax?: number;
  existingEmis: number;
  householdExpenses: number;
  rent: number;
  loanAmountWanted: number;
  loanPurpose: LoanPurpose;
  creditScoreKnown: boolean;
  creditScore?: number; // 300 - 900

  // Tier 2: Adaptive Refinement Questions
  itrAnnualIncome?: number; // for self-employed (tax documented)
  coApplicantIncome?: number; // e.g. spouse
  unencumberedPropertyVal?: number; // property/shop value free of lien
  emergencySavingsMonths?: number; // months of household expenses in buffer
  existingLoanCount?: number;
  highCostAppDebtOutstanding?: number; // predatory 30%+ app debt
  pastYearBounces?: number; // EMI/cheque bounces
  isProductiveAsset?: boolean; // generates future income vs pure consumption
  expectedMonthlyEarningsBoost?: number; // estimated monthly revenue added
  hasOfferedQuote?: boolean;
  offeredRate?: number;
  offeredProcessingFeePct?: number;
}

export interface FiredRule {
  id: string;
  what: string;
  value: string;
  why: string;
  source: string;
}

export interface TenureOption {
  tenureMonths: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  foirPct: number;
  isRecommended?: boolean;
}

export interface AssessmentOutputs {
  O1_Verdict: {
    verdict: VerdictType;
    headline: string;
    reason: string;
    actionSteps: string[];
    criticalFlags: Array<{ severity: 'danger' | 'warning' | 'info'; title: string; detail: string }>;
  };
  O2_Capacity: {
    lenderSanctionAmount: number;
    safeCarryAmount: number;
    recommendedAmount: number;
    primaryMetricToUse: 'lender_sanction' | 'safe_carry';
    metricJustification: string;
    maxSafeTenureMonths: number;
    foirCapPct: number;
    currentFoirPct: number;
    projectedFoirPct: number;
  };
  O3_Pricing: {
    recommendedProduct: LoanProductType;
    productDisplayName: string;
    rateBandMin: number;
    rateBandMax: number;
    processingFeePctMin: number;
    processingFeePctMax: number;
    gstOnFeePct: number;
    aprMin: number;
    aprMax: number;
    routingReason: string;
    rateDriverExplanation: string;
    subsidiesApplicable?: string;
  };
  O4_Outflow: {
    safeEmiCeiling: number;
    stretchEmiCeiling: number;
    recommendedTenureMonths: number;
    tenureOptions: TenureOption[];
    stressCase: {
      title: string;
      description: string;
      stressedIncome: number;
      stressedEmi: number;
      stressedFoirPct: number;
      surplusRemaining: number;
      isSustainable: boolean;
      contingencyAdvice: string;
    };
  };
  confidence: {
    scorePct: number;
    tier: 'LOW' | 'MEDIUM' | 'HIGH';
    summary: string;
    tighteningActions: string[];
  };
  negotiationCard: {
    borrowerProfileSummary: string;
    fairRateTarget: string;
    maxFairProcessingFee: string;
    fairEmiRange: string;
    leveragePoints: string[];
    redFlagsToWalkAway: string[];
    rbiKeyFactSheetNotice: string;
  };
  firedRules: FiredRule[];
}
