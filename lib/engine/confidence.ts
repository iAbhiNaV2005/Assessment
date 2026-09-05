/**
 * Borrower Copilot - Confidence Mechanics
 * Calculates confidence level (wide, medium, narrow) based on countable answered applicable questions.
 * Pure function without React dependencies.
 */

import { RULES_CONFIG } from '../../data/rules-config';
import { BorrowerProfile, ConfidenceLevel } from './schema';
import { QUESTIONS_LIST } from './questions';

export interface ConfidenceCalculationResult {
  confidenceLevel: ConfidenceLevel;
  answeredCount: number;
  applicableCount: number;
  ratio: number;
  percentageText: string;
  varianceFraction: number; // e.g. 0.22 for +/- 22%
  guidanceMessage: string;
  unknownAssumptions: string[];
}

export function calculateConfidence(profile: Partial<BorrowerProfile>): ConfidenceCalculationResult {
  // Identify all additional (non-must) questions that are applicable to this profile
  const additionalQuestions = QUESTIONS_LIST.filter((q) => !q.isMust);
  const applicableAdditionalQuestions = additionalQuestions.filter((q) => q.isVisible(profile));
  const applicableCount = applicableAdditionalQuestions.length;

  // Count how many applicable questions have a defined answer provided in profile
  let answeredCount = 0;
  const unknownAssumptions: string[] = [];

  for (const q of applicableAdditionalQuestions) {
    const val = (profile as any)[q.field];
    if (val !== undefined && val !== null && val !== '') {
      // If answeredQuestionIds is tracked, check membership, or if the property exists and is not default
      answeredCount++;
    }
  }

  // Handle explicit unknown answers
  if (profile.creditScore === 'unknown' || profile.creditScore === undefined) {
    unknownAssumptions.push('Credit score is unknown: assumed unrated banking proxy with conservative prime/subprime boundary rather than lowest score penalty.');
  }

  if (profile.savingsBufferMonths === undefined) {
    unknownAssumptions.push('Savings reserves unstated: assumed conservative 1-2 months buffer.');
  }

  const ratio = applicableCount > 0 ? answeredCount / applicableCount : 0;

  let confidenceLevel: ConfidenceLevel = 'wide';
  let varianceFraction: number = RULES_CONFIG.CONFIDENCE_THRESHOLDS.bandVariances.wide;
  let guidanceMessage = 'Based on the minimum information. Answer more questions to narrow this band.';

  if (ratio > RULES_CONFIG.CONFIDENCE_THRESHOLDS.mediumMax) {
    confidenceLevel = 'narrow';
    varianceFraction = RULES_CONFIG.CONFIDENCE_THRESHOLDS.bandVariances.narrow;
    guidanceMessage = 'High precision estimate based on comprehensive borrower profile disclosure.';
  } else if (ratio > RULES_CONFIG.CONFIDENCE_THRESHOLDS.wideMax) {
    confidenceLevel = 'medium';
    varianceFraction = RULES_CONFIG.CONFIDENCE_THRESHOLDS.bandVariances.medium;
    guidanceMessage = 'Moderate precision estimate. Providing collateral and expense specifics will tighten these numbers further.';
  }

  return {
    confidenceLevel,
    answeredCount,
    applicableCount,
    ratio,
    percentageText: `${Math.round(ratio * 100)}%`,
    varianceFraction,
    guidanceMessage,
    unknownAssumptions,
  };
}

/**
 * Generates lower and upper confidence bounds for a calculated midpoint value.
 */
export function applyConfidenceBand(midpoint: number, varianceFraction: number): { min: number; max: number; midpoint: number } {
  const min = Math.round(midpoint * (1 - varianceFraction));
  const max = Math.round(midpoint * (1 + varianceFraction));
  return { min, max, midpoint };
}
