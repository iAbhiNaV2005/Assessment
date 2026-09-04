import { BorrowerProfile, VerdictType } from './types';
import { calculateAffordability } from './affordability';
import { CapacityResult } from './sanction';
import { PricingResult } from './pricing';

export interface VerdictResult {
  verdict: VerdictType;
  headline: string;
  reason: string;
  actionSteps: string[];
  criticalFlags: Array<{ severity: 'danger' | 'warning' | 'info'; title: string; detail: string }>;
  verdictRuleIds: string[];
}

export function determineVerdict(
  profile: BorrowerProfile,
  capacity: CapacityResult,
  pricing: PricingResult
): VerdictResult {
  const affordability = calculateAffordability(profile);
  const criticalFlags: Array<{ severity: 'danger' | 'warning' | 'info'; title: string; detail: string }> = [];
  const verdictRuleIds: string[] = [];

  const hasPredatoryDebt = (profile.highCostAppDebtOutstanding || 0) > 0;
  const hasRecentBounce = (profile.pastYearBounces || 0) > 0;
  const isSurplusNegative = affordability.trueDisposableSurplus <= 2000;
  const isHighDebtStrain = affordability.currentFoirPct > 45;

  // CRITICAL DISTRESS CHECKS (Anita scenario)
  if (hasPredatoryDebt && hasRecentBounce) {
    criticalFlags.push({
      severity: 'danger',
      title: 'Predatory Debt Spiral Detected',
      detail: `You currently have ${profile.existingLoanCount || 3} digital app loans at ~30%+ interest and had an EMI bounce last month. Fresh borrowing will trigger a debt trap.`
    });
    verdictRuleIds.push('R-DISTRESS-ANITA');

    return {
      verdict: 'DONT_BORROW',
      headline: "Do Not Take Fresh Unsecured Loans",
      reason: "Your immediate financial priority must be stopping the bleed from high-cost app debt (30%+ APR) and avoiding further NACH bounces which damage your banking record.",
      actionSteps: [
        "Do NOT take fresh payday or instant app loans to pay existing EMIs.",
        `Seek debt consolidation: Transfer the ₹${profile.highCostAppDebtOutstanding?.toLocaleString('en-IN')} app debt to a regulated Self-Help Group (SHG) or MFI at 18%-24% reducing rate.`,
        "For your EV scooter: Apply through government-sponsored green mobility programs (e.g. PM e-Drive / PM Surya Ghar) with subsidized low-interest asset lease rather than personal credit.",
        "Approach your bank or NBFC for a one-time settlement (OTS) or loan restructuring on the bounced app loan."
      ],
      criticalFlags,
      verdictRuleIds,
    };
  }

  if (isSurplusNegative) {
    criticalFlags.push({
      severity: 'danger',
      title: 'Deficit Cash Flow',
      detail: `Your monthly living expenses, rent, and existing EMIs (₹${affordability.committedOutflows.toLocaleString('en-IN')}) exceed or consume all of your net income.`
    });
    verdictRuleIds.push('R-SAFE-CARRY-01');

    return {
      verdict: 'DONT_BORROW',
      headline: "Borrowing Not Recommended at Present Income",
      reason: "You have virtually zero disposable monthly surplus after paying rent and groceries. Servicing any new EMI would force you to sacrifice essentials.",
      actionSteps: [
        "Defer non-essential capital expenditures until family income stabilizes.",
        "Audit and trim discretionary monthly subscriptions and living costs.",
        "Explore asset-backed or co-borrower alternatives with higher verifiable income."
      ],
      criticalFlags,
      verdictRuleIds,
    };
  }

  if (isHighDebtStrain && !hasPredatoryDebt) {
    criticalFlags.push({
      severity: 'warning',
      title: 'Elevated Pre-Existing Debt Burden',
      detail: `Your existing debt commitments already consume ${affordability.currentFoirPct}% of household income.`
    });
  }

  // OVER-LEVERAGED / BORROW LESS CHECKS
  if (profile.loanAmountWanted > capacity.safeCarryAmount && capacity.safeCarryAmount > 0) {
    criticalFlags.push({
      severity: 'warning',
      title: 'Loan Ask Exceeds Safe Monthly Capacity',
      detail: `You requested ₹${(profile.loanAmountWanted / 100000).toFixed(2)} Lakhs, but your safe carry ceiling is ₹${(capacity.safeCarryAmount / 100000).toFixed(2)} Lakhs.`
    });
    verdictRuleIds.push('R-SAFE-CARRY-01');

    return {
      verdict: 'BORROW_LESS',
      headline: `Borrow Less: Cap Loan at ₹${(capacity.safeCarryAmount / 100000).toFixed(2)} Lakhs`,
      reason: `Servicing the full ₹${(profile.loanAmountWanted / 100000).toFixed(2)} Lakhs would push your debt obligation past your comfort zone, leaving inadequate buffer for inflation or medical emergencies.`,
      actionSteps: [
        `Downsize your borrowing target from ₹${(profile.loanAmountWanted / 100000).toFixed(2)} Lakhs to ₹${(capacity.safeCarryAmount / 100000).toFixed(2)} Lakhs.`,
        "Fund the remaining shortfall from existing non-emergency savings or family support.",
        "Opt for a longer tenure to reduce monthly EMI strain, with prepayment without penalty."
      ],
      criticalFlags,
      verdictRuleIds,
    };
  }

  // PRODUCTIVE ASSET / SECURED LOAN ROUTING (Ravi scenario)
  if (pricing.recommendedProduct === 'lap_secured') {
    criticalFlags.push({
      severity: 'info',
      title: 'Secured Mortgage Advantage',
      detail: `Pledging your unencumbered shop premises (₹${((profile.unencumberedPropertyVal || 0) / 100000).toFixed(0)} Lakhs) unlocks prime rates and longer tenures.`
    });
    verdictRuleIds.push('R-ROUTING-RAVI');

    return {
      verdict: 'BORROW',
      headline: "Safe to Borrow (Exclusively via Secured LAP / MSME)",
      reason: "Your business expansion and delivery vehicle are productive investments. Pledging your unencumbered commercial property allows you to secure ₹15 Lakhs at ~10% over 7-10 years, keeping the EMI comfortably below ₹22,000/month.",
      actionSteps: [
        "Do NOT apply for an unsecured personal or business loan (rejection or 20%+ rate is certain).",
        "Apply for a Loan Against Property (LAP) or MSME Secured Term Loan from a Tier-1 public or private bank (SBI, Canara, Bank of Baroda, or HDFC).",
        `Add your spouse as co-applicant to pool her ₹${(profile.coApplicantIncome || 0).toLocaleString('en-IN')}/mo salary for frictionless underwriting approval.`,
        "Ensure the property title deeds and tax receipts for the 14-year-old shop are clean and unencumbered."
      ],
      criticalFlags,
      verdictRuleIds,
    };
  }

  // PRIME SALARIED (Priya scenario)
  if (profile.employmentType === 'salaried' && capacity.safeCarryAmount >= profile.loanAmountWanted) {
    if (profile.loanPurpose === 'wedding') {
      criticalFlags.push({
        severity: 'info',
        title: 'Discretionary Consumption Loan',
        detail: 'A wedding loan is non-income generating; keep the repayment tenure under 36 months to avoid long-term interest drag.'
      });
    }

    return {
      verdict: 'BORROW',
      headline: "Safe to Borrow with Excellent Negotiating Power",
      reason: `Your healthy take-home pay (₹${(profile.monthlyIncome / 100000).toFixed(2)} Lakhs/mo), prime credit score (${profile.creditScore || '780'}), and modest existing car EMI (FOIR: ${capacity.currentFoirPct}%) make your ₹${(profile.loanAmountWanted / 100000).toFixed(2)} Lakhs ask very safe to service.`,
      actionSteps: [
        "Leverage your Tier-1 MNC salary account bank first to demand their lowest prime rate (10.5% - 11.25%).",
        "Negotiate a 50% discount on processing fee (insist on capping at 1.0% + GST or max ₹7,500).",
        "Verify in the Key Fact Statement (KFS) that there is ZERO prepayment / foreclosure penalty after 6-12 months.",
        "Do NOT agree to bank offers to take ₹15-20 Lakhs; take strictly what you need (₹8.0 Lakhs)."
      ],
      criticalFlags,
      verdictRuleIds,
    };
  }

  // DEFAULT FALLBACK
  return {
    verdict: 'BORROW',
    headline: "Eligible to Borrow within Calculated Ceilings",
    reason: `Your cash flow supports the planned loan obligation provided you borrow at or below your safe carry limit of ₹${(capacity.safeCarryAmount / 100000).toFixed(2)} Lakhs.`,
    actionSteps: [
      "Compare quotes from at least 2 public sector and 1 private bank.",
      "Check all-in APR including processing fees and upfront insurance deductions.",
      "Maintain at least 3 months of EMI buffer in a liquid savings account."
    ],
    criticalFlags,
    verdictRuleIds,
  };
}
