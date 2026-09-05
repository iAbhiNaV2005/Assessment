/**
 * Borrower Copilot - O1 Verdict Decision Tree
 * Evaluates Hard Blocks (H1-H4) and Soft Cautions (S1-S3).
 * Follows Section 6 of the implementation plan.
 */

import { RULES_CONFIG } from '../../../data/rules-config';
import { BorrowerProfile, VerdictDecision, VerdictResult } from '../schema';
import { FoirEvaluationResult, isStrongCollateral } from './foir';

export interface DecisionEvaluationInput {
  profile: Partial<BorrowerProfile>;
  safeAmount: number;
  postLoanFoir: number;
  foirResult: FoirEvaluationResult;
}

export function evaluateVerdict(input: DecisionEvaluationInput): VerdictResult {
  const { profile, safeAmount, postLoanFoir, foirResult } = input;
  const contributingFactors: string[] = [];
  const requestedAmount = profile.amountWanted || 0;
  const isConsolidating = profile.purpose === 'debt_consolidation' || profile.isDebtConsolidationSelected === true;
  const isProductive =
    profile.purpose === 'business_stock_equipment' ||
    profile.purpose === 'commercial_vehicle' ||
    profile.purpose === 'education';

  // Vehicle hypothecation does NOT count as strong collateral for hard-block checks!
  const hasStrongAsset = isStrongCollateral(profile.collateralType);
  const isEffectivelyUnsecured = !hasStrongAsset;

  // -------------------------------------------------------------------------
  // HARD BLOCKS (H1 - H4) -> "Don't borrow now"
  // -------------------------------------------------------------------------

  // H1: Current FOIR already over the lender cap
  if (foirResult.currentFoir > foirResult.adjustedLenderCap) {
    contributingFactors.push(
      `Current monthly debt commitments consume ${Math.round(foirResult.currentFoir * 100)}% of assessed income, exceeding the lender ceiling of ${Math.round(foirResult.adjustedLenderCap * 100)}%.`
    );
    return {
      verdict: "Don't borrow now",
      primaryReason: 'Existing debt service already breaches maximum lender capacity.',
      contributingFactors,
      isHardBlock: true,
      recommendedAction: 'Focus on paying down existing obligations before taking on any fresh credit.',
      debtRemediationRoadmap: [
        'Prioritize paying down existing loan balances to bring your current FOIR below 35%.',
        'Consolidate multiple small obligations into a single structured balance transfer if possible.',
        'Wait 3 to 6 months after debt reduction before re-evaluating borrowing eligibility.',
      ],
    };
  }

  // H2: Bounce in last 3 months AND request is unsecured, non-productive
  const hasRecent3mBounce =
    profile.hasBounceInLast12Months &&
    (profile.monthsSinceLastBounce === undefined || profile.monthsSinceLastBounce <= RULES_CONFIG.DECISION_TRIGGERS.recentBounceMonthThreshold);

  if (hasRecent3mBounce && isEffectivelyUnsecured && !isProductive) {
    contributingFactors.push(
      'A payment bounce was recorded within the last 3 months for an unsecured, non-productive loan request.'
    );
    contributingFactors.push(
      'Note: Vehicle hypothecation does not count as strong asset backing due to high depreciation risk.'
    );
    return {
      verdict: "Don't borrow now",
      primaryReason: 'Recent payment failure on non-asset-backed personal consumption.',
      contributingFactors,
      isHardBlock: true,
      recommendedAction: 'Establish an uninterrupted 6-month track record of flawless on-time repayments.',
      debtRemediationRoadmap: [
        'Maintain zero cheque or NACH auto-debit bounces for at least 6 consecutive cycles.',
        'Keep bank balance sufficient 48 hours prior to debit dates to prevent automated return fees.',
        'Clear pending penalty charges with existing financiers to update bureau records.',
      ],
    };
  }

  // H3: Over 30% of existing debt is high-cost (>24% APR) and not being consolidated
  const hasHighCostShareOver30 =
    profile.hasHighCostDebt &&
    !isConsolidating &&
    (profile.highCostDebtShare === undefined || profile.highCostDebtShare >= RULES_CONFIG.DECISION_TRIGGERS.highCostDebtThresholdShare);

  if (hasHighCostShareOver30) {
    contributingFactors.push(
      'Over 30% of existing debt is from high-cost lenders (>24% APR) and this loan is not structured to extinguish that debt.'
    );
    return {
      verdict: "Don't borrow now",
      primaryReason: 'Active high-cost revolving debt will compound financial distress if not consolidated.',
      contributingFactors,
      isHardBlock: true,
      recommendedAction: 'Refinance or clear predatory app/card loans before acquiring new obligations.',
      debtRemediationRoadmap: [
        'Refocus loan request purpose explicitly to "Debt Consolidation" to extinguish 24%+ credit lines.',
        'Close instant lending apps and revolving credit accounts once cleared to stop compounding interest.',
        'Re-run self-assessment only after high-cost liabilities are replaced or retired.',
      ],
    };
  }

  // H4: Zero savings AND informal income AND unsecured, non-productive
  const hasZeroSavings = (profile.savingsBufferMonths ?? 1) < 1;
  const isInformal = profile.employmentType === 'informal_gig';

  if (hasZeroSavings && isInformal && isEffectivelyUnsecured && !isProductive) {
    contributingFactors.push(
      'Informal daily cash earnings with zero emergency savings reserves cannot safely service discretionary debt.'
    );
    return {
      verdict: "Don't borrow now",
      primaryReason: 'Zero liquidity buffer combined with volatile informal earnings.',
      contributingFactors,
      isHardBlock: true,
      recommendedAction: 'Build a minimum 2-month emergency cash reserve before taking on debt obligations.',
      debtRemediationRoadmap: [
        'Set aside ₹2,000 to ₹3,000 monthly into a dedicated recurring bank deposit.',
        'Build at least 2 months of essential living expenses (rent + food) in accessible savings.',
        'Channel daily sales through UPI QR to generate verifiable digital transaction statements.',
      ],
    };
  }

  // -------------------------------------------------------------------------
  // SOFT CAUTIONS (S1 - S3) -> "Borrow less"
  // -------------------------------------------------------------------------

  // S1: Requested amount exceeds safe amount
  if (requestedAmount > safeAmount) {
    contributingFactors.push(
      `Requested amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds your safe borrowing ceiling of ₹${safeAmount.toLocaleString('en-IN')}.`
    );
    let action = `Cap loan ticket size at ₹${safeAmount.toLocaleString('en-IN')} to protect monthly household stability.`;

    if (profile.employmentType === 'self_employed_formal' && requestedAmount >= safeAmount * 1.5) {
      action += ' Alternatively, add an earning spouse or family co-applicant to pool household income.';
    }

    return {
      verdict: 'Borrow less',
      primaryReason: 'Requested loan amount exceeds safe individual debt capacity.',
      contributingFactors,
      isHardBlock: false,
      recommendedAction: action,
    };
  }

  // S2: Post-loan FOIR lands in the 55% to 65% zone
  if (
    postLoanFoir >= RULES_CONFIG.DECISION_TRIGGERS.postLoanFoirCautionMin &&
    postLoanFoir <= RULES_CONFIG.DECISION_TRIGGERS.postLoanFoirCautionMax
  ) {
    contributingFactors.push(
      `Post-loan debt servicing will consume ${Math.round(postLoanFoir * 100)}% of your monthly earnings, placing you in the elevated caution zone (55%–65%).`
    );
    return {
      verdict: 'Borrow less',
      primaryReason: 'Elevated post-loan debt obligation reduces resilience to unforeseen emergencies.',
      contributingFactors,
      isHardBlock: false,
      recommendedAction: 'Downsize the loan amount or select a longer tenure to reduce the monthly EMI outflow.',
    };
  }

  // S3: Productive purpose but expected return is unverified
  if (isProductive && profile.isReturnVerified === false && (profile.expectedMonthlyReturn ?? 0) === 0) {
    contributingFactors.push(
      'Loan is stated for business expansion, but expected revenue accretion is unquantified.'
    );
    return {
      verdict: 'Borrow less',
      primaryReason: 'Unverified incremental cashflows on capital expenditure.',
      contributingFactors,
      isHardBlock: false,
      recommendedAction: 'Phase the capital purchase in smaller increments or verify contract purchase orders.',
    };
  }

  // -------------------------------------------------------------------------
  // DEFAULT -> "Borrow"
  // -------------------------------------------------------------------------
  contributingFactors.push(
    `Requested loan amount (₹${requestedAmount.toLocaleString('en-IN')}) is safely covered within your ₹${safeAmount.toLocaleString('en-IN')} debt threshold.`
  );
  contributingFactors.push(
    `Post-loan debt servicing consumes a comfortable ${Math.round(postLoanFoir * 100)}% of assessed monthly income.`
  );

  return {
    verdict: 'Borrow',
    primaryReason: 'Loan request sits comfortably within safe cashflow limits.',
    contributingFactors,
    isHardBlock: false,
    recommendedAction: 'Proceed at the recommended safe amount and fair interest rate band.',
  };
}
