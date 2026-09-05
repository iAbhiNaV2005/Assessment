/**
 * Borrower Copilot - FOIR Rules and Caps
 * Evaluates baseline lender and safe FOIR caps with risk adjustments.
 * Follows Section 5.1 of the implementation plan.
 */

import { RULES_CONFIG } from '../../../data/rules-config';
import { BorrowerProfile, CollateralType } from '../schema';

export interface FoirEvaluationResult {
  baselineLenderCap: number; // e.g. 0.55
  baselineSafeCap: number;   // e.g. 0.45
  adjustedLenderCap: number; // after adjustments
  adjustedSafeCap: number;   // after adjustments
  currentFoir: number;       // existing EMI / assessed income
  availableLenderFoir: number; // adjustedLenderCap - currentFoir
  availableSafeFoir: number;   // adjustedSafeCap - currentFoir
  adjustmentsApplied: string[];
  isCollateralStrong: boolean;
}

/**
 * Checks whether an asset qualifies as strong collateral.
 * Real estate, gold, and fixed deposits qualify.
 * Vehicle hypothecation explicitly does NOT qualify (low resale recovery).
 */
export function isStrongCollateral(collateralType?: CollateralType): boolean {
  if (!collateralType || collateralType === 'none' || collateralType === 'vehicle') {
    return false;
  }
  return collateralType === 'property' || collateralType === 'gold' || collateralType === 'fixed_deposit';
}

export function calculateFoirCaps(
  profile: Partial<BorrowerProfile>,
  assessedMonthlyIncome: number
): FoirEvaluationResult {
  const empType = profile.employmentType || 'salaried';
  let baseLender = 0.50;
  let baseSafe = 0.40;

  if (empType === 'salaried') {
    if (assessedMonthlyIncome < 30000) {
      baseLender = RULES_CONFIG.FOIR_CAPS.salaried.under30k.lenderCap; // 0.40
      baseSafe = RULES_CONFIG.FOIR_CAPS.salaried.under30k.safeCap;     // 0.30
    } else if (assessedMonthlyIncome <= 75000) {
      baseLender = RULES_CONFIG.FOIR_CAPS.salaried.between30kAnd75k.lenderCap; // 0.50
      baseSafe = RULES_CONFIG.FOIR_CAPS.salaried.between30kAnd75k.safeCap;     // 0.40
    } else {
      baseLender = RULES_CONFIG.FOIR_CAPS.salaried.over75k.lenderCap; // 0.55
      baseSafe = RULES_CONFIG.FOIR_CAPS.salaried.over75k.safeCap;     // 0.45
    }
  } else if (empType === 'self_employed_formal') {
    baseLender = RULES_CONFIG.FOIR_CAPS.selfEmployedFormal.any.lenderCap; // 0.45
    baseSafe = RULES_CONFIG.FOIR_CAPS.selfEmployedFormal.any.safeCap;     // 0.35
  } else {
    // Informal / gig
    baseLender = RULES_CONFIG.FOIR_CAPS.informal.any.lenderCap; // 0.35
    baseSafe = RULES_CONFIG.FOIR_CAPS.informal.any.safeCap;     // 0.25
  }

  let adjLender = baseLender;
  let adjSafe = baseSafe;
  const adjustmentsApplied: string[] = [];

  // Adjustment 1: Credit score under 650 or unscored with red flags
  const isScoreUnder650 = typeof profile.creditScore === 'number' && profile.creditScore < 650;
  const isUnscored = profile.creditScore === 'unknown' || profile.creditScore === undefined;

  if (isScoreUnder650 || isUnscored) {
    adjLender += RULES_CONFIG.FOIR_ADJUSTMENTS.lowScoreOrRedFlag.lenderDelta; // -0.05
    adjSafe += RULES_CONFIG.FOIR_ADJUSTMENTS.lowScoreOrRedFlag.safeDelta;     // -0.05
    adjustmentsApplied.push(
      isScoreUnder650
        ? 'Bureau score below 650: -5% from both lender and safe FOIR caps'
        : 'Unscored borrower profile: -5% conservative baseline adjustment from both caps'
    );
  }

  // Adjustment 2: A bounce in the last 6 months shaves 10 points from SAFE cap only
  const hasRecentBounce = profile.hasBounceInLast12Months && (profile.monthsSinceLastBounce === undefined || profile.monthsSinceLastBounce <= 6);
  if (hasRecentBounce) {
    adjSafe += RULES_CONFIG.FOIR_ADJUSTMENTS.recentBounceSafeCapReduction; // -0.10
    adjustmentsApplied.push('Payment bounce in last 6 months: -10% from safe FOIR cap (safeguards household buffer)');
  }

  // Adjustment 3: Strong collateral pledged adds +5% to LENDER cap only. Safe cap does not move!
  const hasStrongAsset = isStrongCollateral(profile.collateralType);
  if (hasStrongAsset) {
    adjLender += RULES_CONFIG.FOIR_ADJUSTMENTS.collateralLenderCapBoost; // +0.05
    adjustmentsApplied.push('Tangible collateral pledged: +5% to lender cap only (safe cap unchanged, as collateral does not increase monthly cashflow)');
  }

  // Bound caps between 10% and 65%
  adjLender = Math.max(0.15, Math.min(0.65, adjLender));
  adjSafe = Math.max(0.10, Math.min(0.55, adjSafe));

  const existingEmis = profile.existingEmiTotal || 0;
  const currentFoir = assessedMonthlyIncome > 0 ? existingEmis / assessedMonthlyIncome : 0;
  const availableLenderFoir = Math.max(0, adjLender - currentFoir);
  const availableSafeFoir = Math.max(0, adjSafe - currentFoir);

  return {
    baselineLenderCap: baseLender,
    baselineSafeCap: baseSafe,
    adjustedLenderCap: adjLender,
    adjustedSafeCap: adjSafe,
    currentFoir,
    availableLenderFoir,
    availableSafeFoir,
    adjustmentsApplied,
    isCollateralStrong: hasStrongAsset,
  };
}
