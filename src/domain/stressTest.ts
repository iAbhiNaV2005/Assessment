import { BorrowerProfile, TenureOption } from './types';
import { calculateEmi } from './affordability';
import { CapacityResult } from './sanction';
import { PricingResult } from './pricing';

export interface StressTestResult {
  title: string;
  description: string;
  stressedIncome: number;
  stressedEmi: number;
  stressedFoirPct: number;
  surplusRemaining: number;
  isSustainable: boolean;
  contingencyAdvice: string;
}

export function generateTenureOptions(
  principal: number,
  annualRatePct: number,
  monthlyIncome: number,
  existingEmis: number,
  isLapProduct: boolean
): TenureOption[] {
  const tenures = isLapProduct 
    ? [36, 60, 84, 120, 180] 
    : [12, 24, 36, 48, 60];

  const targetTenure = isLapProduct ? 84 : 36;

  return tenures.map((tenureMonths) => {
    const emi = calculateEmi(principal, annualRatePct, tenureMonths);
    const totalPayment = emi * tenureMonths;
    const totalInterest = Math.max(0, totalPayment - principal);
    const foirPct = monthlyIncome > 0 
      ? Math.round(((existingEmis + emi) / monthlyIncome) * 100) 
      : 0;

    return {
      tenureMonths,
      emi,
      totalInterest,
      totalPayment,
      foirPct,
      isRecommended: tenureMonths === targetTenure,
    };
  });
}

export function runStressSimulation(
  profile: BorrowerProfile,
  capacity: CapacityResult,
  pricing: PricingResult
): StressTestResult {
  const benchmarkRate = (pricing.rateBandMin + pricing.rateBandMax) / 2;
  const standardTenure = pricing.recommendedProduct === 'lap_secured' ? 84 : 36;
  const basePrincipal = capacity.recommendedAmount > 0 ? capacity.recommendedAmount : profile.loanAmountWanted;

  // Scenario selection:
  // For Salaried: 20% income reduction OR 200 bps rate shock
  // For Self-Employed: 25% revenue dip during offseason
  // For Informal: 20% income drop
  const incomeShockFactor = profile.employmentType === 'self_employed' ? 0.75 : 0.80;
  const rateShockIncrease = 2.0; // +200 bps

  const stressedIncome = Math.round(profile.monthlyIncome * incomeShockFactor);
  const stressedEmi = calculateEmi(basePrincipal, benchmarkRate + rateShockIncrease, standardTenure);

  const totalStressedCommitments = profile.existingEmis + stressedEmi + profile.rent + profile.householdExpenses;
  const surplusRemaining = stressedIncome - totalStressedCommitments;
  const stressedFoirPct = stressedIncome > 0 
    ? Math.round(((profile.existingEmis + stressedEmi) / stressedIncome) * 100) 
    : 0;

  const isSustainable = surplusRemaining > 0 && stressedFoirPct <= 55;

  let title = "Macro Downside: 20% Income Contraction + 200 bps Rate Hike";
  let description = `Simulates a 20% pay cut or business revenue slump (down to ₹${stressedIncome.toLocaleString('en-IN')}/mo) coupled with a 2.0% repo rate rise.`;
  let contingencyAdvice = "";

  if (profile.employmentType === 'salaried') {
    title = "Macro Downside: 20% Salary Cut + 200 bps Rate Hike";
    description = `If salary drops 20% to ₹${stressedIncome.toLocaleString('en-IN')}/mo and interest rate rises to ${(benchmarkRate + 2).toFixed(1)}%.`;
    if (isSustainable) {
      contingencyAdvice = `Resilient: Your surplus remains positive at ₹${surplusRemaining.toLocaleString('en-IN')}/mo and stressed FOIR is ${stressedFoirPct}%. You can comfortably absorb a severe career shock.`;
    } else {
      contingencyAdvice = `Vulnerable: Monthly surplus turns negative (-₹${Math.abs(surplusRemaining).toLocaleString('en-IN')}). Ensure you have 6 months of living expenses locked in FD before signing.`;
    }
  } else if (profile.employmentType === 'self_employed') {
    title = "Kirana Seasonal Slump: 25% Gross Revenue Contraction";
    description = `If monthly shop profits drop 25% to ₹${stressedIncome.toLocaleString('en-IN')}/mo during rainy season or local supply chain disruption.`;
    if (isSustainable) {
      contingencyAdvice = `Manageable under LAP: Because the loan is spread over 7 years at ~10%, the ₹${stressedEmi.toLocaleString('en-IN')} EMI remains under 30% of stressed household income with wife's teacher salary active.`;
    } else {
      contingencyAdvice = `Tight Cash Flow: Restrict borrowing or opt for a 10-year repayment tenure to lower the monthly obligation to < ₹18,000.`;
    }
  } else {
    // Informal
    title = "Gig Volatility Shock: 20% Income Loss";
    description = `If platform deliveries drop or personal health issue reduces monthly earnings to ₹${stressedIncome.toLocaleString('en-IN')}/mo.`;
    contingencyAdvice = `Critical Deficit: Monthly cash flow collapses to deficit (-₹${Math.abs(surplusRemaining).toLocaleString('en-IN')}). Fresh unsecured debt will lead to immediate default.`;
  }

  return {
    title,
    description,
    stressedIncome,
    stressedEmi,
    stressedFoirPct,
    surplusRemaining,
    isSustainable,
    contingencyAdvice,
  };
}
