/**
 * Borrower Copilot - Fair Interest Rate and APR Engine
 * Pure function computing rate bands, tier positioning, stability discounts, and APR.
 * Follows Section 5.3 of the implementation plan.
 */

import { RULES_CONFIG } from '../../../data/rules-config';
import { BorrowerProfile, RateResult, RiskTier } from '../schema';
import { isStrongCollateral } from './foir';

export interface RateCalculationInput {
  profile: Partial<BorrowerProfile>;
  loanAmount: number;
  tenureYears: number;
}

export function evaluateRateAndApr(input: RateCalculationInput): RateResult {
  const { profile, loanAmount, tenureYears } = input;
  const repo = RULES_CONFIG.REPO_RATE; // 5.25%

  // Determine Risk Tier
  let riskTier: RiskTier = 'near_prime';
  const score = profile.creditScore;

  if (typeof score === 'number') {
    if (score >= 750) riskTier = 'prime';
    else if (score >= 680) riskTier = 'near_prime';
    else riskTier = 'subprime';
  } else {
    // Unscored
    riskTier = 'unscored';
  }

  // Product Selection & Routing
  let productName = 'Personal loan, unsecured, prime';
  let minSpread = 6.00;
  let maxSpread = 9.00;
  let isSecured = false;
  const rateFactors: string[] = [];

  const purpose = profile.purpose || 'wedding_discretionary';
  const hasStrongAsset = isStrongCollateral(profile.collateralType);

  if (purpose === 'home') {
    productName = RULES_CONFIG.RATE_SPREADS.homeLoan.name;
    minSpread = RULES_CONFIG.RATE_SPREADS.homeLoan.minSpread;
    maxSpread = RULES_CONFIG.RATE_SPREADS.homeLoan.maxSpread;
    isSecured = true;
    rateFactors.push('Mortgage collateral over residential property qualifies for lowest home loan risk spreads.');
  } else if (profile.collateralType === 'gold') {
    productName = RULES_CONFIG.RATE_SPREADS.goldLoan.name;
    minSpread = RULES_CONFIG.RATE_SPREADS.goldLoan.minSpread;
    maxSpread = RULES_CONFIG.RATE_SPREADS.goldLoan.maxSpread;
    isSecured = true;
    rateFactors.push('Pledged gold ornaments or SGBs provide instant physical collateral coverage.');
  } else if (hasStrongAsset && (purpose === 'commercial_vehicle' || purpose === 'business_stock_equipment' || purpose === 'other')) {
    // Unencumbered commercial premises / property pledged for business
    productName = RULES_CONFIG.RATE_SPREADS.businessLoanSecured.name;
    minSpread = RULES_CONFIG.RATE_SPREADS.businessLoanSecured.minSpread;
    maxSpread = RULES_CONFIG.RATE_SPREADS.businessLoanSecured.maxSpread;
    isSecured = true;
    rateFactors.push('Unencumbered commercial property pledged: routed to secured business / LAP pricing band.');
  } else if (purpose === 'personal_vehicle') {
    productName = RULES_CONFIG.RATE_SPREADS.twoWheelerLoan.name;
    minSpread = RULES_CONFIG.RATE_SPREADS.twoWheelerLoan.minSpread;
    maxSpread = RULES_CONFIG.RATE_SPREADS.twoWheelerLoan.maxSpread;
    isSecured = false;
    rateFactors.push('Standard two-wheeler loan with vehicle hypothecation.');
  } else {
    // Unsecured Personal Loan
    if (riskTier === 'prime') {
      productName = RULES_CONFIG.RATE_SPREADS.personalLoanPrime.name;
      minSpread = RULES_CONFIG.RATE_SPREADS.personalLoanPrime.minSpread;
      maxSpread = RULES_CONFIG.RATE_SPREADS.personalLoanPrime.maxSpread;
      rateFactors.push('Prime bureau track record (score 750+) qualifies for tier-one unsecured bank pricing.');
    } else {
      productName = RULES_CONFIG.RATE_SPREADS.personalLoanSubprime.name;
      minSpread = RULES_CONFIG.RATE_SPREADS.personalLoanSubprime.minSpread;
      maxSpread = RULES_CONFIG.RATE_SPREADS.personalLoanSubprime.maxSpread;
      rateFactors.push(
        riskTier === 'unscored'
          ? 'Unscored borrower profile: routed to near/sub-prime unsecured band.'
          : 'Subprime score (<680): reflects standard NBFC risk-adjusted risk spread.'
      );
    }
  }

  // Base Band Anchored to Repo
  const minNominal = Number((repo + minSpread).toFixed(2));
  const maxNominal = Number((repo + maxSpread).toFixed(2));
  const bandSpan = maxNominal - minNominal;

  // Positioning within band:
  // Prime sits in bottom third (0.15 - 0.35 factor)
  // Near-prime sits in middle (0.50 factor)
  // Subprime sits in upper third (0.75 - 0.85 factor)
  // If secured with strong collateral, absence of bureau score is mitigated by asset backing -> middle of band (0.35 - 0.50)
  let positionFactor = 0.50;
  if (isSecured) {
    positionFactor = riskTier === 'prime' ? 0.25 : 0.40;
  } else if (riskTier === 'prime') {
    positionFactor = 0.25;
  } else if (riskTier === 'near_prime') {
    positionFactor = 0.50;
  } else {
    positionFactor = 0.80;
  }

  let expectedRate = minNominal + bandSpan * positionFactor;

  // Stability Discount: Each year beyond 3 years shaves 0.10%, capped at 0.50%
  const years = profile.yearsInJobOrBusiness || 0;
  if (years > RULES_CONFIG.RATE_POSITIONING.stabilityThresholdYears) {
    const yearsBeyond = years - RULES_CONFIG.RATE_POSITIONING.stabilityThresholdYears;
    const discount = Math.min(
      RULES_CONFIG.RATE_POSITIONING.maxStabilityDiscount,
      yearsBeyond * RULES_CONFIG.RATE_POSITIONING.stabilityDiscountPerYear
    );
    expectedRate -= discount;
    rateFactors.push(
      `${years} years continuous tenure provides a -${discount.toFixed(2)}% stability concession off nominal rate.`
    );
  }

  expectedRate = Number(Math.max(minNominal, Math.min(maxNominal, expectedRate)).toFixed(2));

  // APR (All-in cost) calculation
  // Fee = 1.5% of loan amount + 18% GST = 1.77% effective fee
  const feePercent = RULES_CONFIG.FEES_AND_TAXES.processingFeePercent;
  const gst = RULES_CONFIG.FEES_AND_TAXES.gstPercentOnFee;
  const effectiveFeePercent = Number((feePercent * (1 + gst / 100)).toFixed(2)); // 1.77%

  const tenureMonths = Math.max(12, tenureYears * 12);
  const feePerYearShare = (effectiveFeePercent / 100) * (12 / tenureMonths) * 100;

  const aprMin = Number((minNominal + feePerYearShare).toFixed(2));
  const aprMax = Number((maxNominal + feePerYearShare).toFixed(2));
  const aprExpected = Number((expectedRate + feePerYearShare).toFixed(2));

  const isHighCostWarning = expectedRate >= RULES_CONFIG.RATE_SPREADS.highCostAppLoanThreshold;

  return {
    productName,
    minNominalRate: minNominal,
    maxNominalRate: maxNominal,
    expectedNominalRate: expectedRate,
    aprMin,
    aprMax,
    aprExpected,
    effectiveFeePercent,
    rateFactors,
    isHighCostWarning,
  };
}
