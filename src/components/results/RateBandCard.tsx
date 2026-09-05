'use client';

/**
 * O3 Fair Interest Rate and APR Card
 * Displays nominal interest rate bands anchored to RBI repo rate alongside all-in APR.
 * Built with Apple Liquid Glass aesthetics and zero emojis.
 */

import React from 'react';
import { RateResult } from '../../../lib/engine';
import { LiquidGlass } from '../LiquidGlass';

interface RateBandCardProps {
  rate: RateResult;
}

export const RateBandCard: React.FC<RateBandCardProps> = ({ rate }) => {
  return (
    <LiquidGlass variant="card" className="w-full mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted dark:text-ink-muted-dark">
            Output 3 · Fair Market Interest Rate &amp; APR
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-ink dark:text-ink-dark tracking-tight mt-1">
            {rate.productName}
          </h2>
        </div>
        <div className="text-right self-start sm:self-auto">
          <span className="text-xs font-mono num-mono px-3 py-1 rounded-full bg-surface-light dark:bg-surface-dark text-ink-muted dark:text-ink-muted-dark border border-rule-light dark:border-rule-dark">
            Repo Anchor: 5.25%
          </span>
        </div>
      </div>

      {/* Rates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Nominal Rate Band */}
        <div className="bg-white/50 dark:bg-surface-dark/50 border border-rule-light dark:border-rule-dark rounded-2xl p-5 sm:p-6 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark block mb-1">
            Fair Nominal Rate Band
          </span>
          <div className="text-3xl sm:text-4xl font-mono num-mono font-bold text-ink dark:text-ink-dark mb-1">
            {rate.minNominalRate.toFixed(2)}% – {rate.maxNominalRate.toFixed(2)}%
          </div>
          <p className="text-xs text-plum-900 dark:text-plum-300 font-mono font-medium mb-2">
            Target Pricing Anchor: {rate.expectedNominalRate.toFixed(2)}% p.a.
          </p>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Based on RBI repo transmission spread + credit tier margin.
          </p>
        </div>

        {/* All-In APR */}
        <div className="bg-white/50 dark:bg-surface-dark/50 border border-rule-light dark:border-rule-dark rounded-2xl p-5 sm:p-6 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark block mb-1">
            All-In APR (Annualized True Cost)
          </span>
          <div className="text-3xl sm:text-4xl font-mono num-mono font-bold text-plum-900 dark:text-plum-300 mb-1">
            {rate.aprMin.toFixed(2)}% – {rate.aprMax.toFixed(2)}%
          </div>
          <p className="text-xs text-plum-900/80 dark:text-plum-300/80 font-mono font-medium mb-2">
            Effective APR: {rate.aprExpected.toFixed(2)}% p.a.
          </p>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Includes {rate.effectiveFeePercent.toFixed(2)}% upfront processing fee + 18% statutory GST.
          </p>
        </div>
      </div>

      {/* Pricing Drivers List */}
      <div className="bg-surface-light/70 dark:bg-surface-dark/70 rounded-xl p-4 border border-rule-light/80 dark:border-rule-dark/80">
        <span className="text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider block mb-2">
          Pricing Drivers &amp; Margin Factors
        </span>
        <ul className="space-y-1.5">
          {rate.rateFactors.map((factor, idx) => (
            <li key={idx} className="text-xs text-ink-muted dark:text-ink-muted-dark flex items-start gap-2">
              <span className="text-plum-900 dark:text-plum-400 font-mono shrink-0">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {rate.isHighCostWarning && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 dark:text-rose-300">
          <strong>Caution:</strong> The indicated rate is in or near the 24%+ high-cost zone. Lokta recommends avoiding high-cost app borrowings and consolidating existing debt.
        </div>
      )}
    </LiquidGlass>
  );
};
