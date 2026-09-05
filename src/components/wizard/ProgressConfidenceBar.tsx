'use client';

/**
 * Progress and Confidence Bar Component
 * Displays question completion progress alongside countable confidence band indicators.
 * Free of emojis.
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
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  const getConfidenceLevelLabel = (level: string) => {
    switch (level) {
      case 'narrow':
        return 'Narrow Band (+/- 5%)';
      case 'medium':
        return 'Medium Band (+/- 10%)';
      default:
        return 'Wide Band (+/- 22%)';
    }
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Question {currentStepIndex + 1} of {totalStepsCount}
          </span>
          <span className="text-xs font-mono text-slate-500">({progressPercent}%)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Precision:</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getConfidenceBadgeColor(
              confidence.confidenceLevel
            )}`}
          >
            {getConfidenceLevelLabel(confidence.confidenceLevel)}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Confidence explanation line */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{confidence.guidanceMessage}</span>
        <span className="font-mono text-slate-400">
          {confidence.answeredCount}/{confidence.applicableCount} adaptive fields covered
        </span>
      </div>
    </div>
  );
};
