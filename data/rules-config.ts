/**
 * Borrower Copilot - Single Source of Truth for Rules Configuration
 * All numerical constants, caps, multipliers, and spreads reside here.
 * Referenced directly by lib/engine and documented identically in RULES.md.
 */

export const RULES_CONFIG = {
  // RBI Policy Anchor as of September 2026
  REPO_RATE: 5.25,

  // Fixed Obligation to Income Ratio (FOIR) Baseline Caps by Segment and Income Tier
  FOIR_CAPS: {
    salaried: {
      under30k: { lenderCap: 0.40, safeCap: 0.30 },
      between30kAnd75k: { lenderCap: 0.50, safeCap: 0.40 },
      over75k: { lenderCap: 0.55, safeCap: 0.45 },
    },
    selfEmployedFormal: {
      any: { lenderCap: 0.45, safeCap: 0.35 },
    },
    informal: {
      any: { lenderCap: 0.35, safeCap: 0.25 },
    },
  },

  // Adjustments applied to FOIR caps based on risk indicators
  FOIR_ADJUSTMENTS: {
    // Score under 650 or unscored with red flags shaves 5 percentage points from both caps
    lowScoreOrRedFlag: { lenderDelta: -0.05, safeDelta: -0.05 },
    // Bounce in last 6 months shaves 10 percentage points from safe cap only
    recentBounceSafeCapReduction: -0.10,
    // Collateral pledged adds 5 percentage points to lender cap only (safe cap unchanged)
    collateralLenderCapBoost: 0.05,
  },

  // Income Assessment Haircuts
  INCOME_ASSESSMENT: {
    salariedHaircut: 0.0,
    selfEmployedVariableHaircuts: {
      lowVariableUnder20: 0.0,
      moderateVariable20To40: 0.10,
      highVariableOver40: 0.20,
    },
    informalFlatHaircut: 0.25,
  },

  // Loan to Value (LTV) Ceilings for Secured Products
  LTV_CEILINGS: {
    withoutPriorLoanHistory: 0.50,
    withPriorLoanHistory: 0.60,
    goldRegulatoryMax: 0.75,
  },

  // Unsecured Loan Income Multiple Ceilings
  INCOME_MULTIPLES: {
    salariedPrime: 24,       // Score 750+
    salariedNearPrime: 15,   // Score 650-749
    salariedSubprime: 8,     // Score <650 or unscored
    selfEmployedFormal: 10,
    informal: 6,
  },

  // Residual Income Safe Rule: Minimum unspent share of assessed income
  RESIDUAL_INCOME_MIN_BUFFER_SHARE: 0.15, // 15%

  // Product Base Rate Spreads over Repo (5.25%)
  RATE_SPREADS: {
    homeLoan: {
      name: 'Home loan',
      minSpread: 2.00,
      maxSpread: 3.25,
      defaultTenureYears: 15,
      tenureOptionsYears: [10, 15, 20],
      isSecured: true,
    },
    loanAgainstProperty: {
      name: 'Loan against property',
      minSpread: 3.75,
      maxSpread: 5.75,
      defaultTenureYears: 10,
      tenureOptionsYears: [7, 10, 15],
      isSecured: true,
    },
    goldLoan: {
      name: 'Gold loan',
      minSpread: 4.00,
      maxSpread: 8.00,
      defaultTenureYears: 2,
      tenureOptionsYears: [1, 2, 3],
      isSecured: true,
    },
    businessLoanSecured: {
      name: 'Business loan, secured',
      minSpread: 5.00,
      maxSpread: 9.00,
      defaultTenureYears: 5,
      tenureOptionsYears: [3, 5, 7],
      isSecured: true,
    },
    twoWheelerLoan: {
      name: 'Two-wheeler loan',
      minSpread: 5.50,
      maxSpread: 9.50,
      defaultTenureYears: 3,
      tenureOptionsYears: [2, 3, 4],
      isSecured: false, // Vehicle hypothecation is treated as effectively unsecured for capital risk
    },
    personalLoanPrime: {
      name: 'Personal loan, unsecured, prime',
      minSpread: 6.00,
      maxSpread: 9.00,
      defaultTenureYears: 3,
      tenureOptionsYears: [2, 3, 5],
      isSecured: false,
    },
    personalLoanSubprime: {
      name: 'Personal loan, unsecured, near or sub-prime',
      minSpread: 9.25,
      maxSpread: 16.00,
      defaultTenureYears: 3,
      tenureOptionsYears: [2, 3, 5],
      isSecured: false,
    },
    highCostAppLoanThreshold: 24.0, // Any rate >= 24% is flagged as avoid
  },

  // Rate Positioning & Stability Shaves
  RATE_POSITIONING: {
    stabilityThresholdYears: 3,
    stabilityDiscountPerYear: 0.10, // 10 bps off rate per year over 3 years
    maxStabilityDiscount: 0.50,    // Max 50 bps reduction
  },

  // Fee Assumptions for APR Approximation
  FEES_AND_TAXES: {
    processingFeePercent: 1.50,
    gstPercentOnFee: 18.0,
    // Effective fee percent = 1.50 * (1 + 0.18) = 1.77%
  },

  // Stress Test Shocks (Single Combined Worst-Case Scenario)
  STRESS_TEST: {
    incomeShockPercent: -0.25, // -25% income drop
    rateShockBps: 150,          // +150 basis points (+1.50%)
  },

  // Decision Tree Triggers
  DECISION_TRIGGERS: {
    highCostDebtThresholdShare: 0.30, // Hard block if >30% of existing debt is high-cost (>24%) and not consolidated
    recentBounceMonthThreshold: 3,    // Hard block if bounce in last 3 months on unsecured non-productive
    postLoanFoirCautionMin: 0.55,      // Soft caution if post-loan FOIR is 55% - 65%
    postLoanFoirCautionMax: 0.65,
  },

  // Confidence Bands Thresholds (Share of applicable additional questions answered)
  CONFIDENCE_THRESHOLDS: {
    wideMax: 0.30,    // 0% - 30% -> Wide (approx +/- 20% to 25% band)
    mediumMax: 0.70,  // 30% - 70% -> Medium (approx +/- 10% band)
    // Over 70% -> Narrow (approx +/- 5% band)
    bandVariances: {
      wide: 0.22,
      medium: 0.10,
      narrow: 0.05,
    },
  },
} as const;

export type RulesConfigType = typeof RULES_CONFIG;
