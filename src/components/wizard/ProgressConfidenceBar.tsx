'use client';

/**
 * Progress and Confidence Bar Component
 * Displays question completion progress and countable precision band indicators.
 * Clean, tactile, and free of emojis.
 */

import React from 'react';
import { ConfidenceCalculationResult } from '../../../lib/engine';

interface ProgressConfidenceBarProps {
  currentStepIndex: number;
  totalStepsCount: number;
  mustQuestionsCount: number;
  answeredCount: number;
  confidence: ConfidenceCalculationResult;
}

export const ProgressConfidenceBar: React.FC<ProgressConfidenceBarProps> = ({
  currentStepIndex,
  totalStepsCount,
  confidence,
}) => {
  const progressPercent = Math.round(((currentStepIndex + 1) / totalStepsCount) * 100);

  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'narrow':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-plum-500/10 text-plum-900 dark:text-plum-300 border-plum-500/30';
    }
  };

  const getConfidenceLabel = (level: string) => {
    switch (level) {
      case 'narrow':
        return 'Narrow (+/- 5%)';
      case 'medium':
        return 'Medium (+/- 10%)';
      default:
        return 'Wide (+/- 22%)';
    }
  };

  return (
    <div className="w-full bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border border-rule-light dark:border-rule-dark rounded-2xl p-5 shadow-glass mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
            Question {currentStepIndex + 1} of {totalStepsCount}
          </span>
          <span className="text-xs font-mono text-ink-muted dark:text-ink-muted-dark">
            ({progressPercent}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">Precision Band:</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${getConfidenceBadgeColor(
              confidence.confidenceLevel
            )}`}
          >
            {getConfidenceLabel(confidence.confidenceLevel)}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-surface-light dark:bg-plum-950/40 rounded-full h-1.5 overflow-hidden mb-2.5">
        <div
          className="h-full bg-plum-900 dark:bg-plum-400 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Live explanation line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-ink-muted dark:text-ink-muted-dark">
        <span>{confidence.guidanceMessage}</span>
        <span className="font-mono text-[11px] shrink-0">
          {confidence.answeredCount}/{confidence.applicableCount} adaptive calibrations
        </span>
      </div>
    </div>
  );
};
