'use client';

/**
 * O1 Verdict Banner Component
 * Displays verdict (Borrow / Borrow less / Don't borrow now), rationale, and remediation roadmap.
 * Free of emojis.
 */

import React from 'react';
import { VerdictResult } from '../../../lib/engine';

interface VerdictBannerProps {
  verdict: VerdictResult;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict }) => {
  const getTheme = () => {
    switch (verdict.verdict) {
      case 'Borrow':
        return {
          badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          border: 'border-emerald-500/40',
          gradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
          textColor: 'text-emerald-400',
        };
      case 'Borrow less':
        return {
          badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          border: 'border-amber-500/40',
          gradient: 'from-amber-950/40 via-slate-900 to-slate-900',
          textColor: 'text-amber-400',
        };
      case "Don't borrow now":
      default:
        return {
          badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          border: 'border-rose-500/40',
          gradient: 'from-rose-950/40 via-slate-900 to-slate-900',
          textColor: 'text-rose-400',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`w-full bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6 sm:p-8 shadow-xl mb-8`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Output 1 — Overall Verdict
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.textColor}`}>
              {verdict.verdict}
            </h1>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold border ${theme.badgeBg}`}
            >
              {verdict.isHardBlock ? 'Hard Block Triggered' : 'Cashflow Feasible'}
            </span>
          </div>
        </div>

        <div className="text-right sm:max-w-xs">
          <span className="text-xs text-slate-400 block font-medium">Recommended Action</span>
          <span className="text-xs text-slate-200 font-medium block mt-0.5">
            {verdict.recommendedAction}
          </span>
        </div>
      </div>

      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 mb-4">
        <p className="text-sm text-slate-200 font-medium mb-2">{verdict.primaryReason}</p>
        <ul className="space-y-1.5">
          {verdict.contributingFactors.map((factor, idx) => (
            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
              <span className="text-slate-600 font-mono shrink-0">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {verdict.debtRemediationRoadmap && verdict.debtRemediationRoadmap.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
          <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block mb-2">
            Actionable Debt Remediation Roadmap
          </span>
          <ol className="space-y-2">
            {verdict.debtRemediationRoadmap.map((step, idx) => (
              <li key={idx} className="text-xs text-rose-200 flex items-start gap-2.5">
                <span className="font-mono text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
