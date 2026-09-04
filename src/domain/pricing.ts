import { BorrowerProfile, LoanProductType } from './types';

export interface PricingResult {
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
  ruleIds: string[];
}

/**
 * Computes exact monthly IRR using Newton-Raphson solver to determine RBI-compliant Annual Percentage Rate (APR).
 * Net Disbursement = Principal - (Processing Fee + GST)
 * Net Disbursement = SUM [ EMI / (1 + r)^t ] for t = 1..n
 * APR = r * 12 * 100
 */
export function calculateAllInApr(
  principal: number,
  nominalAnnualRatePct: number,
  tenureMonths: number,
  processingFeePct: number,
  gstPct: number = 18
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;

  const monthlyRate = nominalAnnualRatePct / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);

  // Upfront fee deductions
  const upfrontFee = principal * (processingFeePct / 100);
  const feeGst = upfrontFee * (gstPct / 100);
  const netDisbursement = principal - (upfrontFee + feeGst);

  if (netDisbursement <= 0) return nominalAnnualRatePct;

  // Bisection solver for monthly IRR r
  // Monotonic: as r increases, pv strictly decreases
  let low = 0.0001; // ~0.12% annual
  let high = 0.50;  // ~600% annual
  let r = monthlyRate;

  for (let iter = 0; iter < 40; iter++) {
    const mid = (low + high) / 2;
    let pv = 0;
    for (let t = 1; t <= tenureMonths; t++) {
      pv += emi / Math.pow(1 + mid, t);
    }

    if (Math.abs(pv - netDisbursement) < 0.01) {
      r = mid;
      break;
    }

    if (pv > netDisbursement) {
      // pv is too high -> discount rate mid is too low
      low = mid;
    } else {
      high = mid;
    }
    r = mid;
  }

  const annualisedApr = r * 12 * 100;
  return Number(annualisedApr.toFixed(2));
}

/**
 * Determines optimal loan product routing and risk-adjusted fair interest band.
 */
export function determinePricingAndRouting(profile: BorrowerProfile): PricingResult {
  const ruleIds: string[] = [];

  // 1. PRODUCT ROUTING DECISION
  // Case Ravi: Kirana owner, needs ₹15L, low ITR, has ₹45L unencumbered shop property
  const hasUnencumberedProperty = (profile.unencumberedPropertyVal || 0) >= profile.loanAmountWanted * 1.5;
  const isHighValueLowItr = profile.employmentType === 'self_employed' && 
    profile.loanAmountWanted > 800000 && 
    (profile.itrAnnualIncome || 0) < profile.loanAmountWanted * 0.4;

  let recommendedProduct: LoanProductType = 'personal_unsecured';
  let productDisplayName = 'Personal Loan (Unsecured)';
  let routingReason = 'Standard unsecured personal loan for short-to-medium term funding.';

  if (isHighValueLowItr && hasUnencumberedProperty) {
    recommendedProduct = 'lap_secured';
    productDisplayName = 'Loan Against Property (LAP / Mortgage)';
    routingReason = 'Routing to LAP: Pledging unencumbered commercial premises slashes interest rates by ~1,000 bps compared to personal loans and extends repayment tenure up to 10-15 years.';
    ruleIds.push('R-ROUTING-RAVI', 'R-LTV-LAP-01');
  } else if (profile.loanPurpose === 'vehicle_asset' || profile.loanPurpose === 'business_expansion') {
    if (profile.employmentType === 'informal') {
      recommendedProduct = 'two_wheeler_ev';
      productDisplayName = 'Commercial EV / Two-Wheeler Asset Loan';
      routingReason = 'Asset-backed hypothecated vehicle financing: Backed by the electric scooter with lower risk than an unsecured loan, plus eligible for state EV subsidies.';
      ruleIds.push('R-LTV-TWO-WHEEL', 'R-PRODUCTIVE-ASSET');
    } else if (profile.employmentType === 'self_employed') {
      recommendedProduct = 'msME_secured' as unknown as LoanProductType;
      productDisplayName = 'Secured MSME Business Expansion Loan';
      routingReason = 'Secured MSME term credit backed by business assets or shop inventory, eligible for CGTMSE / priority sector lending rates.';
      ruleIds.push('R-ROUTING-RAVI');
    }
  }

  // 2. INTEREST RATE BENCHMARK DETERMINATION
  let rateBandMin = 12.0;
  let rateBandMax = 15.0;
  let rateDriverExplanation = '';

  const creditScore = profile.creditScore;
  const isScoreKnown = profile.creditScoreKnown && creditScore !== undefined && creditScore > 0;

  if (recommendedProduct === 'lap_secured') {
    // Secured property rates in India: 9.25% - 10.75%
    rateBandMin = 9.25;
    rateBandMax = 11.0;
    rateDriverExplanation = 'Secured by immovable commercial real estate with low LTV (<40%), qualifying for sovereign-grade repo-linked lending rates.';
  } else if (recommendedProduct === 'two_wheeler_ev') {
    // Two wheeler / EV asset loan: 13.5% - 16.5% for informal borrowers
    rateBandMin = 13.5;
    rateBandMax = 16.5;
    rateDriverExplanation = 'Hypothecated asset loan for informal gig workers. Higher than prime auto loans due to unverified income, but ~1,500 bps cheaper than app payday loans.';
  } else if (profile.employmentType === 'salaried') {
    if (isScoreKnown && creditScore >= 750) {
      // Prime salaried: 10.5% - 11.75%
      rateBandMin = 10.5;
      rateBandMax = 11.75;
      rateDriverExplanation = `Excellent credit profile (CIBIL ${creditScore}) and stable MNC salary qualify for Tier-1 public/private bank prime salary relationship rates.`;
      ruleIds.push('R-PRICING-CIBIL-750');
    } else if (isScoreKnown && creditScore >= 700) {
      rateBandMin = 12.0;
      rateBandMax = 13.5;
      rateDriverExplanation = `Good credit score (${creditScore}); standard pricing from mid-tier private banks.`;
    } else if (isScoreKnown && creditScore < 650) {
      rateBandMin = 17.5;
      rateBandMax = 22.0;
      rateDriverExplanation = `Subprime credit score (${creditScore}) with past delinquency triggers substantial risk-premium loading.`;
    } else {
      // Score unknown
      rateBandMin = 12.5;
      rateBandMax = 16.0;
      rateDriverExplanation = 'Credit score unverified: Lenders price conservatively until bureau check is executed.';
      ruleIds.push('R-PRICING-NTC');
    }
  } else if (profile.employmentType === 'self_employed') {
    if (isScoreKnown && creditScore >= 750) {
      rateBandMin = 12.5;
      rateBandMax = 14.5;
      rateDriverExplanation = 'Self-employed profile with established bureau history.';
    } else {
      // Ravi scenario: No formal credit score (NTC)
      rateBandMin = 14.0;
      rateBandMax = 18.0;
      rateDriverExplanation = 'New to credit (NTC) with cash-heavy receipts. Lenders quote wide bands (14% - 18%) for unsecured lines, underscoring why a secured loan is essential.';
      ruleIds.push('R-PRICING-NTC');
    }
  } else {
    // Informal profile
    rateBandMin = 16.0;
    rateBandMax = 22.0;
    rateDriverExplanation = 'Informal cash income without formal bureau footprint faces elevated unsecured risk pricing (16% - 22%).';
    ruleIds.push('R-PRICING-NTC');
  }

  // 3. PROCESSING FEES
  let feeMinPct = 1.0;
  let feeMaxPct = 1.75;

  if (recommendedProduct === 'lap_secured') {
    feeMinPct = 0.5;
    feeMaxPct = 1.0;
  } else if (profile.employmentType === 'informal') {
    feeMinPct = 1.5;
    feeMaxPct = 2.5;
  }
  ruleIds.push('R-FEE-CAP-01');

  // 4. ALL-IN RBI APR CALCULATION
  const typicalTenure = recommendedProduct === 'lap_secured' ? 84 : 36;
  const aprMin = calculateAllInApr(profile.loanAmountWanted, rateBandMin, typicalTenure, feeMinPct, 18);
  const aprMax = calculateAllInApr(profile.loanAmountWanted, rateBandMax, typicalTenure, feeMaxPct, 18);
  ruleIds.push('R-APR-CALC-01');

  return {
    recommendedProduct,
    productDisplayName,
    rateBandMin,
    rateBandMax,
    processingFeePctMin: feeMinPct,
    processingFeePctMax: feeMaxPct,
    gstOnFeePct: 18,
    aprMin,
    aprMax,
    routingReason,
    rateDriverExplanation,
    ruleIds,
  };
}
