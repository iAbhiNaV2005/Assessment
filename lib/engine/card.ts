/**
 * Borrower Copilot - Negotiation Card Assembler
 * Packages outputs O1 to O4 into an 8-section bank counter companion.
 * Follows Section 7 of the implementation plan.
 */

import { AmountResult, BorrowerProfile, EmiResult, NegotiationCardData, RateResult } from './schema';
import { ConfidenceCalculationResult } from './confidence';

export interface CardAssemblyInput {
  profile: Partial<BorrowerProfile>;
  o2Amount: AmountResult;
  o3Rate: RateResult;
  o4Emi: EmiResult;
  confidence: ConfidenceCalculationResult;
  actualQuote?: number;
}

export function assembleNegotiationCard(input: CardAssemblyInput): NegotiationCardData {
  const { profile, o2Amount, o3Rate, o4Emi, confidence, actualQuote } = input;

  // 1. Loan type and amount requested
  const loanType = o3Rate.productName;
  const amountRequested = profile.amountWanted || o2Amount.safeAmount;

  // 2. Fair rate band and all-in APR range
  const fairRateBandText = `${o3Rate.minNominalRate.toFixed(2)}% – ${o3Rate.maxNominalRate.toFixed(2)}% p.a. (Anchor: ${o3Rate.expectedNominalRate.toFixed(2)}%)`;
  const aprRangeText = `${o3Rate.aprMin.toFixed(2)}% – ${o3Rate.aprMax.toFixed(2)}% APR (Includes ${o3Rate.effectiveFeePercent.toFixed(2)}% processing fee + GST)`;

  // 3. Top two rate factors (One sentence why)
  const topFactors = o3Rate.rateFactors.slice(0, 2);
  const topTwoRateFactors =
    topFactors.length > 0
      ? topFactors.join(' ')
      : `Priced based on your employment stability and asset backing.`;

  // 4. Safe EMI ceiling at recommended tenure with tenure trade-off note
  const safeEmiCeilingText = `₹${o4Emi.safeEmiCeiling.toLocaleString('en-IN')}/month at ${o4Emi.recommendedTenureYears} years`;
  const tenureTradeOffNote = `Opting for a 2-year tenure saves total interest; extending to 5 years lowers monthly cash outflow but increases aggregate interest paid.`;

  // 5. Safe amount and lender-likely amount side by side
  const safeAmount = o2Amount.safeAmount;
  const lenderSanctionAmount = o2Amount.lenderSanctionAmount;
  const safeAmountReason = o2Amount.safeCapReason;
  const lenderSanctionReason = o2Amount.lenderCapReason;
  const recommendedAmountGuidance =
    'Use the Safe Amount to protect your household against unexpected emergencies. Only borrow up to the Lender Sanction if you have external liquid reserves.';

  // 6 & 7. Quote comparison & talk track
  const quoteVal = actualQuote ?? profile.existingLenderQuote?.nominalRate;
  let diffFromFair: number | undefined;
  let talkTrack =
    'If the lender quotes a higher rate, ask if they have bundled credit life insurance (which is voluntary under RBI rules) or priced for high-risk band. Request an itemized Key Fact Statement (KFS).';

  if (quoteVal) {
    diffFromFair = Number((quoteVal - o3Rate.expectedNominalRate).toFixed(2));
    if (diffFromFair > 0) {
      talkTrack = `The quoted rate of ${quoteVal}% is ${diffFromFair}% higher than your expected market band (${o3Rate.expectedNominalRate}%). Ask: "What risk tier was I mapped to? Can bundled insurance or optional fees be removed from the loan sanction?"`;
    } else {
      talkTrack = `The quoted rate of ${quoteVal}% is competitive and aligns with or beats fair market pricing. Confirm there are no hidden documentation or pre-closure penalty charges.`;
    }
  }

  // 8. Confidence note
  const confidenceNote = `Calculated with ${confidence.answeredCount} of ${confidence.applicableCount} applicable questions answered (${confidence.percentageText} profile coverage). Complete remaining questions to tighten variance bands.`;

  return {
    loanType,
    amountRequested,
    fairRateBandText,
    aprRangeText,
    topTwoRateFactors,
    safeEmiCeilingText,
    tenureTradeOffNote,
    safeAmount,
    lenderSanctionAmount,
    safeAmountReason,
    lenderSanctionReason,
    recommendedAmountGuidance,
    quoteComparisonNotes: {
      lenderQuoteGiven: quoteVal,
      differenceFromFair: diffFromFair,
      talkTrack,
    },
    confidenceNote,
  };
}
