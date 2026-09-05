'use client';

/**
 * O3 Fair Interest Rate and APR Card
 * Displays nominal interest rate bands anchored to RBI repo rate alongside all-in APR.
 * Free of emojis.
 */

import React from 'react';
import { RateResult } from '../../../lib/engine';

interface RateBandCardProps {
  rate: RateResult;
}

export const RateBandCard: React.FC<RateBandCardProps> = ({ rate }) => {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Output 3 — Fair Market Interest Rate & APR
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            {rate.productName}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Repo Anchor: 5.25%
          </span>
        </div>
      </div>

      {/* Rates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Nominal Rate Band */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Fair Nominal Rate Band
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
            {rate.minNominalRate.toFixed(2)}% – {rate.maxNominalRate.toFixed(2)}%
          </div>
          <p className="text-xs text-blue-400 font-mono mb-2">
            Target Pricing Anchor: {rate.expectedNominalRate.toFixed(2)}% p.a.
          </p>
          <p className="text-[11px] text-slate-400">
            Based on RBI repo transmission spread + credit tier margin.
          </p>
        </div>

        {/* All-In APR */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            All-In APR (Annualized True Cost)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-400 mb-1">
            {rate.aprMin.toFixed(2)}% – {rate.aprMax.toFixed(2)}%
          </div>
          <p className="text-xs text-indigo-300 font-mono mb-2">
            Effective APR: {rate.aprExpected.toFixed(2)}% p.a.
          </p>
          <p className="text-[11px] text-slate-400">
            Includes {rate.effectiveFeePercent.toFixed(2)}% upfront processing fee + 18% statutory GST.
          </p>
        </div>
      </div>

      {/* Why this band: Factor list */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
          Pricing Drivers & Margin Factors
        </span>
        <ul className="space-y-1.5">
          {rate.rateFactors.map((factor, idx) => (
            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
              <span className="text-blue-500 font-mono shrink-0">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {rate.isHighCostWarning && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          <strong>Caution:</strong> The indicated rate is in or near the 24%+ high-cost zone. Lokta recommends avoiding high-cost app borrowings and consolidating existing debt.
        </div>
      )}
    </div>
  );
};
