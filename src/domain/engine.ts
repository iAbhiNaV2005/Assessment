import { BorrowerProfile, AssessmentOutputs, FiredRule } from './types';
import { calculateAffordability, calculateEmi } from './affordability';
import { determinePricingAndRouting } from './pricing';
import { calculateBorrowingCapacities } from './sanction';
import { determineVerdict } from './verdict';
import { generateTenureOptions, runStressSimulation } from './stressTest';
import { MASTER_RULES_REGISTRY } from './rulesData';

export function assessBorrowerProfile(profile: BorrowerProfile): AssessmentOutputs {
  // 1. Run core calculations
  const affordability = calculateAffordability(profile);
  const pricing = determinePricingAndRouting(profile);
  const capacity = calculateBorrowingCapacities(profile);
  const verdictResult = determineVerdict(profile, capacity, pricing);
  const stressCase = runStressSimulation(profile, capacity, pricing);

  const isLap = pricing.recommendedProduct === 'lap_secured';
  const targetPrincipal = capacity.recommendedAmount > 0 ? capacity.recommendedAmount : profile.loanAmountWanted;
  const benchmarkMidRate = (pricing.rateBandMin + pricing.rateBandMax) / 2;

  const tenureOptions = generateTenureOptions(
    targetPrincipal,
    benchmarkMidRate,
    profile.monthlyIncome,
    profile.existingEmis,
    isLap
  );

  // 2. Compute Confidence Score & Silence Impact
  let confidenceScore = 60; // baseline for must questions
  const tighteningActions: string[] = [];

  if (profile.creditScoreKnown && profile.creditScore && profile.creditScore > 0) {
    confidenceScore += 15;
  } else {
    tighteningActions.push("Entering your exact CIBIL score will tighten your rate band by ±1.5%.");
  }

  if (profile.employmentType === 'self_employed') {
    if (profile.itrAnnualIncome && profile.itrAnnualIncome > 0) {
      confidenceScore += 10;
    } else {
      tighteningActions.push("Providing your last 2 years ITR net taxable profit will confirm formal bank eligibility.");
    }

    if (profile.unencumberedPropertyVal && profile.unencumberedPropertyVal > 0) {
      confidenceScore += 15;
    } else {
      tighteningActions.push("Specifying commercial or residential property value unlocks lower-cost mortgage pricing.");
    }
  }

  if (profile.coApplicantIncome && profile.coApplicantIncome > 0) {
    confidenceScore += 5;
  }

  if (profile.highCostAppDebtOutstanding !== undefined || profile.pastYearBounces !== undefined) {
    confidenceScore += 10;
  } else {
    tighteningActions.push("Specifying recent EMI bounce history confirms whether subprime surcharge applies.");
  }

  confidenceScore = Math.min(98, confidenceScore);
  const confidenceTier: 'LOW' | 'MEDIUM' | 'HIGH' = 
    confidenceScore >= 85 ? 'HIGH' : confidenceScore >= 70 ? 'MEDIUM' : 'LOW';

  const confidenceSummary = confidenceTier === 'HIGH'
    ? "High Confidence: Rate bands and eligibility limits are closely calibrated to your verified profile."
    : confidenceTier === 'MEDIUM'
    ? "Moderate Confidence: Benchmark rates are realistic, but unconfirmed details maintain a ±1.0% margin."
    : "Low Confidence (Wide Band): Outputs are conservative estimates because several key credit indicators remain unknown.";

  // 3. Construct Negotiation Card Content
  const fairRateTarget = `${pricing.rateBandMin.toFixed(2)}% - ${pricing.rateBandMax.toFixed(2)}% p.a. (Reducing Balance)`;
  const maxFairProcessingFee = `${pricing.processingFeePctMin}% - ${pricing.processingFeePctMax}% + 18% GST (Max ₹${Math.round(targetPrincipal * (pricing.processingFeePctMax / 100)).toLocaleString('en-IN')})`;

  const safeEmi = calculateEmi(targetPrincipal, benchmarkMidRate, isLap ? 84 : 36);
  const fairEmiRange = `₹${(safeEmi * 0.95).toFixed(0)} - ₹${(safeEmi * 1.05).toFixed(0)} / month`;

  const leveragePoints: string[] = [];
  const redFlagsToWalkAway: string[] = [];

  if (profile.employmentType === 'salaried') {
    if ((profile.creditScore || 0) >= 750) {
      leveragePoints.push(`Prime CIBIL ${profile.creditScore}: "I qualify for your Tier-1 Prime Retail grid. Quotes above ${pricing.rateBandMax}% are uncompetitive."`);
    }
    leveragePoints.push(`MNC Salary Track Record: "My net salary is ₹${(profile.monthlyIncome / 100000).toFixed(2)}L with current FOIR at only ${capacity.currentFoirPct}%. I expect relationship pricing."`);
    leveragePoints.push(`Processing Fee Ceiling: "Processing fee must not exceed ${pricing.processingFeePctMax}% (₹${Math.round(targetPrincipal * (pricing.processingFeePctMax / 100)).toLocaleString('en-IN')}). Waive login charges."`);
    redFlagsToWalkAway.push("Quotes framed as 'Flat Rates' (e.g. 6% flat = ~11.5% reducing balance). Always demand the reducing balance rate.");
    redFlagsToWalkAway.push("Bundled loan protection insurance deducted directly from disbursed proceeds without written consent.");
  } else if (pricing.recommendedProduct === 'lap_secured') {
    leveragePoints.push(`Unencumbered Collateral: "I am offering ₹${((profile.unencumberedPropertyVal || 0) / 100000).toFixed(0)}L clear commercial property. At <40% LTV, your risk is zero."`);
    leveragePoints.push(`Secured Rate Benchmark: "Commercial LAP is repo-linked at 9.25% - 10.75%. I will not entertain unsecured rates at 16% - 20%."`);
    leveragePoints.push(`Tenure Leverage: "Sanction on a 7-10 year repayment schedule to protect operating business working capital."`);
    redFlagsToWalkAway.push("High valuation or technical inspection fees exceeding ₹7,500 for the shop appraisal.");
    redFlagsToWalkAway.push("Non-regulated private financiers demanding original sale deeds without formal bank sanction letter.");
  } else {
    // Informal / Anita
    leveragePoints.push("Asset Hypothecation: For vehicle financing, rate must reflect asset security (<16%), not unsecured cash rates (30%+).");
    leveragePoints.push("Government EV Schemes: Request state green mobility / PM e-Drive interest subvention benefits.");
    redFlagsToWalkAway.push("Instant loan apps demanding daily or weekly repayments with hidden 10% upfront platform fees.");
    redFlagsToWalkAway.push("Lenders refusing to issue an RBI-standard Key Fact Statement (KFS).");
  }

  redFlagsToWalkAway.push("Prepayment or foreclosure penalties: RBI prohibits foreclosure penalties on floating-rate individual retail loans.");

  const rbiKeyFactSheetNotice = "RBI Mandate (April 2024): All commercial banks and NBFCs are legally mandated to provide a Key Fact Statement (KFS) stating all-in APR before loan agreement execution.";

  // 4. Collect Fired Rules
  const allFiredRuleIds = Array.from(
    new Set([
      ...pricing.ruleIds,
      ...capacity.sanctionRuleIds,
      ...verdictResult.verdictRuleIds,
    ])
  );

  const firedRules: FiredRule[] = allFiredRuleIds
    .map((id) => {
      const entry = MASTER_RULES_REGISTRY.find((r) => r.id === id);
      if (!entry) return null;
      return {
        id: entry.id,
        what: entry.what,
        value: entry.value,
        why: entry.why,
        source: entry.source,
      };
    })
    .filter((r): r is FiredRule => r !== null);

  return {
    O1_Verdict: {
      verdict: verdictResult.verdict,
      headline: verdictResult.headline,
      reason: verdictResult.reason,
      actionSteps: verdictResult.actionSteps,
      criticalFlags: verdictResult.criticalFlags,
    },
    O2_Capacity: {
      lenderSanctionAmount: capacity.lenderSanctionAmount,
      safeCarryAmount: capacity.safeCarryAmount,
      recommendedAmount: capacity.recommendedAmount,
      primaryMetricToUse: capacity.primaryMetricToUse,
      metricJustification: capacity.metricJustification,
      maxSafeTenureMonths: capacity.maxSafeTenureMonths,
      foirCapPct: capacity.foirCapPct,
      currentFoirPct: capacity.currentFoirPct,
      projectedFoirPct: capacity.projectedFoirPct,
    },
    O3_Pricing: {
      recommendedProduct: pricing.recommendedProduct,
      productDisplayName: pricing.productDisplayName,
      rateBandMin: pricing.rateBandMin,
      rateBandMax: pricing.rateBandMax,
      processingFeePctMin: pricing.processingFeePctMin,
      processingFeePctMax: pricing.processingFeePctMax,
      gstOnFeePct: pricing.gstOnFeePct,
      aprMin: pricing.aprMin,
      aprMax: pricing.aprMax,
      routingReason: pricing.routingReason,
      rateDriverExplanation: pricing.rateDriverExplanation,
    },
    O4_Outflow: {
      safeEmiCeiling: affordability.safeEmiCeiling,
      stretchEmiCeiling: affordability.stretchEmiCeiling,
      recommendedTenureMonths: isLap ? 84 : 36,
      tenureOptions,
      stressCase,
    },
    confidence: {
      scorePct: confidenceScore,
      tier: confidenceTier,
      summary: confidenceSummary,
      tighteningActions,
    },
    negotiationCard: {
      borrowerProfileSummary: `${profile.name}, ${profile.age} · ${profile.city} · ${profile.employmentType.replace('_', ' ').toUpperCase()}`,
      fairRateTarget,
      maxFairProcessingFee,
      fairEmiRange,
      leveragePoints,
      redFlagsToWalkAway,
      rbiKeyFactSheetNotice,
    },
    firedRules,
  };
}
