import { BorrowerProfile } from './types';

/**
 * Calculates monthly EMI using the standard reducing balance annuity formula.
 * @param principal Loan principal in INR
 * @param annualRatePct Annual interest rate in percent (e.g. 11.5)
 * @param tenureMonths Loan tenure in months (e.g. 36)
 */
export function calculateEmi(principal: number, annualRatePct: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRatePct / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculates maximum principal loan amount given a target monthly EMI capacity, interest rate, and tenure.
 */
export function calculatePrincipalFromEmi(targetEmi: number, annualRatePct: number, tenureMonths: number): number {
  if (targetEmi <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return targetEmi * tenureMonths;

  const monthlyRate = annualRatePct / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = (targetEmi * (factor - 1)) / (monthlyRate * factor);
  return Math.round(principal);
}

/**
 * Determines the regulatory / industry standard FOIR cap for the borrower's profile.
 */
export function getFoirCeiling(profile: BorrowerProfile): { foirPct: number; ruleId: string } {
  if (profile.employmentType === 'salaried') {
    if (profile.monthlyIncome >= 100000) {
      return { foirPct: 55, ruleId: 'R-FOIR-SAL-01' };
    } else if (profile.monthlyIncome >= 40000) {
      return { foirPct: 50, ruleId: 'R-FOIR-SAL-02' };
    } else {
      return { foirPct: 40, ruleId: 'R-FOIR-SAL-02' };
    }
  } else if (profile.employmentType === 'self_employed') {
    return { foirPct: 45, ruleId: 'R-FOIR-SELF-01' };
  } else {
    // Informal / gig worker
    return { foirPct: 35, ruleId: 'R-FOIR-INF-01' };
  }
}

/**
 * Evaluates the borrower's Net Disposable Income (NDI) and Safe Carry capacity.
 */
export function calculateAffordability(profile: BorrowerProfile) {
  const { foirPct, ruleId: foirRuleId } = getFoirCeiling(profile);

  // Total household cash inflow
  const primaryIncome = profile.monthlyIncome;
  const coIncome = profile.coApplicantIncome || 0;
  const totalInflow = primaryIncome + coIncome;

  // Existing commitments
  const committedOutflows = profile.existingEmis + profile.rent + profile.householdExpenses;

  // Baseline current FOIR
  const currentFoirPct = totalInflow > 0 ? Math.round((profile.existingEmis / totalInflow) * 100) : 0;

  // Maximum EMI bank considers affordable under FOIR cap
  const lenderMaxEmiBudget = Math.max(0, (totalInflow * (foirPct / 100)) - profile.existingEmis);

  // Actual borrower disposable surplus after ALL expenses (rent, groceries, utilities)
  const trueDisposableSurplus = totalInflow - committedOutflows;

  // Emergency buffer deduction: we mandate reserving at least 15% of surplus or ₹3,000 for unexpected shocks
  const emergencyBufferMandate = Math.max(2500, Math.round(profile.householdExpenses * 0.15));
  const safeEmiCeiling = Math.max(0, Math.round(trueDisposableSurplus - emergencyBufferMandate));

  // Stretch EMI ceiling allows dipping slightly into buffer (for high-urgency productive needs)
  const stretchEmiCeiling = Math.max(0, Math.round(trueDisposableSurplus));

  return {
    totalInflow,
    committedOutflows,
    currentFoirPct,
    foirCeilingPct: foirPct,
    foirRuleId,
    lenderMaxEmiBudget,
    trueDisposableSurplus,
    emergencyBufferMandate,
    safeEmiCeiling,
    stretchEmiCeiling,
  };
}
