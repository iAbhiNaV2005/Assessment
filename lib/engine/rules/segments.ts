/**
 * Borrower Copilot - Segment Income Assessment Rules
 * Pure function computing assessed income and documentation haircuts.
 * Follows Section 3.3 of the implementation plan.
 */

import { RULES_CONFIG } from '../../../data/rules-config';
import { BorrowerProfile, EmploymentType } from '../schema';

export interface AssessedIncomeResult {
  assessedMonthlyIncome: number;
  statedGrossIncome: number;
  haircutPercent: number;
  haircutAmount: number;
  methodology: string;
  rationale: string;
}

export function calculateAssessedIncome(profile: Partial<BorrowerProfile>): AssessedIncomeResult {
  const empType: EmploymentType = profile.employmentType || 'salaried';
  const statedNet = profile.netMonthlyIncome || 0;

  if (empType === 'salaried') {
    return {
      assessedMonthlyIncome: Math.round(statedNet),
      statedGrossIncome: statedNet,
      haircutPercent: 0,
      haircutAmount: 0,
      methodology: 'Stated Net Take-Home (0% Haircut)',
      rationale: 'Salaried earnings are verifiable via formal monthly payslips and direct salary bank credits. Assumed 100% reliable.',
    };
  }

  if (empType === 'self_employed_formal') {
    // Blended methodology: average of monthly ITR income and midpoint of self-declared cash income
    const itrMonthly = profile.itrAnnualIncome
      ? profile.itrAnnualIncome / 12
      : statedNet * 0.75; // Fallback if annual ITR not separated
    const cashMonthly = profile.cashMonthlyIncome || statedNet;

    const blendedPreHaircut = (itrMonthly + cashMonthly) / 2;

    // Haircut based on variable share
    const variableShare = profile.variableIncomeShare ?? 0.30;
    let haircutPercent: number = RULES_CONFIG.INCOME_ASSESSMENT.selfEmployedVariableHaircuts.moderateVariable20To40;

    if (variableShare < 0.20) {
      haircutPercent = RULES_CONFIG.INCOME_ASSESSMENT.selfEmployedVariableHaircuts.lowVariableUnder20;
    } else if (variableShare > 0.40) {
      haircutPercent = RULES_CONFIG.INCOME_ASSESSMENT.selfEmployedVariableHaircuts.highVariableOver40;
    }

    const assessed = Math.round(blendedPreHaircut * (1 - haircutPercent));
    const haircutAmt = Math.round(blendedPreHaircut * haircutPercent);

    return {
      assessedMonthlyIncome: assessed,
      statedGrossIncome: Math.round(blendedPreHaircut),
      haircutPercent: Math.round(haircutPercent * 100),
      haircutAmount: haircutAmt,
      methodology: `Blended ITR + Cash Average with ${Math.round(haircutPercent * 100)}% Volatility Haircut`,
      rationale: 'ITR alone tends to under-state cash receipts in trade businesses, while self-declared cash is unverifiable. Blending both and discounting for volatility provides an objective middle ground.',
    };
  }

  // Informal / gig worker
  const incomeMin = profile.incomeMin ?? statedNet * 0.85;
  const incomeMax = profile.incomeMax ?? statedNet * 1.15;
  const midpoint = (incomeMin + incomeMax) / 2;

  let haircutPercent: number = RULES_CONFIG.INCOME_ASSESSMENT.informalFlatHaircut; // 25% flat

  // If borrower has strong digital UPI footprint, slight haircut mitigation
  if (profile.informalDigitalPaymentHistory) {
    haircutPercent = 0.20; // 5% relief for verifiable UPI cashflows
  }

  const assessed = Math.round(midpoint * (1 - haircutPercent));
  const haircutAmt = Math.round(midpoint * haircutPercent);

  return {
    assessedMonthlyIncome: assessed,
    statedGrossIncome: Math.round(midpoint),
    haircutPercent: Math.round(haircutPercent * 100),
    haircutAmount: haircutAmt,
    methodology: `Declared Range Midpoint with ${Math.round(haircutPercent * 100)}% Flat Discount`,
    rationale: 'Informal daily contracts and gig earnings lack documentary tax trails. A flat haircut accounts for seasonality and income volatility.',
  };
}
