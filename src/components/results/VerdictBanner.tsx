'use client';

/**
 * O1 Verdict Banner Component
 * Executive credit decision presentation with contextual status styling and remediation roadmap.
 * Built with Apple Liquid Glass aesthetics and zero emojis.
 */

import React from 'react';
import { VerdictResult } from '../../../lib/engine';
import { LiquidGlass } from '../LiquidGlass';

interface VerdictBannerProps {
  verdict: VerdictResult;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict }) => {
  const getTheme = () => {
    switch (verdict.verdict) {
      case 'Borrow':
        return {
          badge: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
          border: 'border-emerald-500/30',
          textColor: 'text-emerald-800 dark:text-emerald-300',
          tint: 'from-emerald-50/50 via-white/80 to-white/60 dark:from-emerald-950/30 dark:via-surface-dark/80 dark:to-surface-dark/60',
        };
      case 'Borrow less':
        return {
          badge: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
          border: 'border-amber-500/30',
          textColor: 'text-amber-800 dark:text-amber-300',
          tint: 'from-amber-50/50 via-white/80 to-white/60 dark:from-amber-950/30 dark:via-surface-dark/80 dark:to-surface-dark/60',
        };
      case "Don't borrow now":
      default:
        return {
          badge: 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30',
          border: 'border-rose-500/30',
          textColor: 'text-rose-800 dark:text-rose-300',
          tint: 'from-rose-50/50 via-white/80 to-white/60 dark:from-rose-950/30 dark:via-surface-dark/80 dark:to-surface-dark/60',
        };
    }
  };

  const theme = getTheme();

  return (
    <LiquidGlass
      variant="highlight"
      className={`w-full mb-8 border ${theme.border} bg-gradient-to-br ${theme.tint}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted dark:text-ink-muted-dark">
            Output 1 · Assessment Verdict
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className={`text-2xl sm:text-4xl font-display font-semibold tracking-tight ${theme.textColor}`}>
              {verdict.verdict}
            </h1>
            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${theme.badge}`}>
              {verdict.isHardBlock ? 'Hard Block Triggered' : 'Cashflow Feasible'}
            </span>
          </div>
        </div>

        <div className="sm:text-right sm:max-w-xs">
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium block">
            Recommended Action
          </span>
          <span className="text-xs text-ink dark:text-ink-dark font-semibold block mt-0.5 leading-snug">
            {verdict.recommendedAction}
          </span>
        </div>
      </div>

      {/* Rationale and Factors */}
      <div className="bg-white/60 dark:bg-surface-dark/60 rounded-xl p-4 border border-rule-light/80 dark:border-rule-dark/80 mb-4">
        <p className="text-sm font-medium text-ink dark:text-ink-dark mb-2.5">
          {verdict.primaryReason}
        </p>
        <ul className="space-y-1.5">
          {verdict.contributingFactors.map((factor, idx) => (
            <li key={idx} className="text-xs text-ink-muted dark:text-ink-muted-dark flex items-start gap-2">
              <span className="text-plum-900 dark:text-plum-400 font-mono shrink-0">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Debt Remediation Roadmap for Hard Block */}
      {verdict.debtRemediationRoadmap && verdict.debtRemediationRoadmap.length > 0 && (
        <div className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 mt-4">
          <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider block mb-2">
            Actionable Debt Remediation Roadmap
          </span>
          <ol className="space-y-2">
            {verdict.debtRemediationRoadmap.map((step, idx) => (
              <li key={idx} className="text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5 leading-relaxed">
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </LiquidGlass>
  );
};
