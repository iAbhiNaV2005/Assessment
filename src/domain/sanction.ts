import { BorrowerProfile } from './types';
import { calculateAffordability, calculatePrincipalFromEmi } from './affordability';
import { determinePricingAndRouting } from './pricing';

export interface CapacityResult {
  lenderSanctionAmount: number;
  safeCarryAmount: number;
  recommendedAmount: number;
  primaryMetricToUse: 'lender_sanction' | 'safe_carry';
  metricJustification: string;
  maxSafeTenureMonths: number;
  foirCapPct: number;
  currentFoirPct: number;
  projectedFoirPct: number;
  sanctionRuleIds: string[];
}

/**
 * Calculates what a bank will legally sanction vs what the borrower can safely carry.
 */
export function calculateBorrowingCapacities(profile: BorrowerProfile): CapacityResult {
  const affordability = calculateAffordability(profile);
  const pricing = determinePricingAndRouting(profile);
  const sanctionRuleIds: string[] = [affordability.foirRuleId];

  const benchmarkRate = (pricing.rateBandMin + pricing.rateBandMax) / 2;
  const standardTenureMonths = pricing.recommendedProduct === 'lap_secured' ? 120 : 48; // 10 yrs for LAP, 4 yrs for standard PL

  // 1. LENDER SANCTION CAPACITY CALCULATION
  let lenderSanctionAmount = 0;

  if (pricing.recommendedProduct === 'lap_secured' && profile.unencumberedPropertyVal) {
    // Collateral backed: LTV rule (50% for commercial premises, 65% for residential)
    const maxLtvPct = 55;
    const collateralSanctionCap = Math.round(profile.unencumberedPropertyVal * (maxLtvPct / 100));

    // Income proxy under LAP: combines declared ITR + co-applicant income over 10-15 years
    const combinedMonthly = ((profile.itrAnnualIncome || 0) / 12) + (profile.coApplicantIncome || 0) + (profile.monthlyIncome * 0.35);
    const lapMaxEmi = Math.max(0, (combinedMonthly * 0.50) - profile.existingEmis);
    const cashFlowSanctionCap = calculatePrincipalFromEmi(lapMaxEmi, benchmarkRate, 120);

    // Bank takes the lower of LTV and Cash Flow Capacity
    lenderSanctionAmount = Math.min(collateralSanctionCap, Math.max(cashFlowSanctionCap, profile.loanAmountWanted));
    sanctionRuleIds.push('R-LTV-LAP-01');
  } else if (profile.employmentType === 'self_employed') {
    // If evaluated strictly on unsecured personal loan norms
    const monthlyDocIncome = profile.itrAnnualIncome ? profile.itrAnnualIncome / 12 : profile.monthlyIncome * 0.5;
    const maxDocEmi = Math.max(0, (monthlyDocIncome * (affordability.foirCeilingPct / 100)) - profile.existingEmis);
    lenderSanctionAmount = calculatePrincipalFromEmi(maxDocEmi, 16.0, 36);
    sanctionRuleIds.push('R-FOIR-SELF-01');
  } else if (profile.employmentType === 'informal') {
    // Informal / gig worker: NBFCs / fintechs cap unsecured at ₹50,000 - ₹1,00,000 unless asset-backed
    if (pricing.recommendedProduct === 'two_wheeler_ev') {
      // 80% on-road asset hypothecation
      lenderSanctionAmount = Math.min(125000, Math.round(profile.loanAmountWanted * 0.85));
      sanctionRuleIds.push('R-LTV-TWO-WHEEL');
    } else {
      const informalMaxEmi = Math.max(0, (profile.monthlyIncome * 0.30) - profile.existingEmis);
      lenderSanctionAmount = calculatePrincipalFromEmi(informalMaxEmi, 22.0, 24);
      sanctionRuleIds.push('R-FOIR-INF-01');
    }
  } else {
    // Salaried (Priya): Evaluated on Net Monthly Take-Home
    lenderSanctionAmount = calculatePrincipalFromEmi(affordability.lenderMaxEmiBudget, benchmarkRate, standardTenureMonths);
    sanctionRuleIds.push(affordability.foirRuleId);
  }

  // 2. SAFE CARRY CAPACITY CALCULATION
  // Based strictly on true disposable surplus after actual rent, grocery, child education, and emergency buffer
  let safeCarryAmount = calculatePrincipalFromEmi(affordability.safeEmiCeiling, benchmarkRate, standardTenureMonths);

  // If borrower has high-cost predatory app debt, safe carry for fresh debt collapses
  if ((profile.highCostAppDebtOutstanding || 0) > 20000 || (profile.pastYearBounces || 0) >= 1) {
    safeCarryAmount = Math.min(safeCarryAmount, 35000); // capped at consolidation amount
    sanctionRuleIds.push('R-DISTRESS-ANITA');
  }

  // Round numbers to neat hundreds
  lenderSanctionAmount = Math.round(lenderSanctionAmount / 1000) * 1000;
  safeCarryAmount = Math.round(safeCarryAmount / 1000) * 1000;

  // 3. DECIDE WHICH METRIC THE BORROWER SHOULD USE
  let primaryMetricToUse: 'lender_sanction' | 'safe_carry' = 'safe_carry';
  let metricJustification = '';
  let recommendedAmount = 0;

  if (profile.employmentType === 'salaried' && lenderSanctionAmount > safeCarryAmount) {
    primaryMetricToUse = 'safe_carry';
    recommendedAmount = Math.min(profile.loanAmountWanted, safeCarryAmount);
    metricJustification = `Use Safe Carry (₹${(safeCarryAmount / 100000).toFixed(2)} Lakhs). Banks will happily offer you up to ₹${(lenderSanctionAmount / 100000).toFixed(2)} Lakhs because of your high salary, but that would cannibalize your monthly living buffer. Do not borrow more than your planned ₹${(profile.loanAmountWanted / 100000).toFixed(2)} Lakhs need.`;
  } else if (pricing.recommendedProduct === 'lap_secured') {
    primaryMetricToUse = 'safe_carry';
    recommendedAmount = Math.min(profile.loanAmountWanted, safeCarryAmount);
    metricJustification = `Use Safe Carry via Secured Mortgage. While your unsecured ITR limit is low, pledging your shop unlocks ₹${(lenderSanctionAmount / 100000).toFixed(2)} Lakhs sanction. Restrict your draw to ₹${(profile.loanAmountWanted / 100000).toFixed(2)} Lakhs to keep monthly business cash flow comfortable.`;
  } else if (profile.employmentType === 'informal' && (profile.highCostAppDebtOutstanding || 0) > 0) {
    primaryMetricToUse = 'safe_carry';
    recommendedAmount = 0; // Anita shouldn't take fresh debt until app loans are cleared
    metricJustification = `Use Safe Carry (₹0 Fresh Discretionary Debt). Your existing ₹${profile.highCostAppDebtOutstanding?.toLocaleString('en-IN')} app loans and recent EMI bounce put you at severe default risk. Prioritize loan consolidation over fresh borrowing.`;
  } else {
    primaryMetricToUse = 'safe_carry';
    recommendedAmount = Math.min(profile.loanAmountWanted, safeCarryAmount);
    metricJustification = `Align your borrowing strictly with your Safe Carry limit (₹${(safeCarryAmount / 100000).toFixed(2)} Lakhs) rather than maximum bank sanction to preserve household resilience.`;
  }

  // 4. PROJECTED FOIR CALCULATION
  const plannedEmi = calculatePrincipalFromEmi(recommendedAmount, benchmarkRate, standardTenureMonths) / standardTenureMonths; // approximation for display
  const totalProjectedEmis = profile.existingEmis + plannedEmi;
  const projectedFoirPct = affordability.totalInflow > 0 
    ? Math.min(100, Math.round((totalProjectedEmis / affordability.totalInflow) * 100))
    : 0;

  return {
    lenderSanctionAmount,
    safeCarryAmount,
    recommendedAmount,
    primaryMetricToUse,
    metricJustification,
    maxSafeTenureMonths: standardTenureMonths,
    foirCapPct: affordability.foirCeilingPct,
    currentFoirPct: affordability.currentFoirPct,
    projectedFoirPct,
    sanctionRuleIds,
  };
}
