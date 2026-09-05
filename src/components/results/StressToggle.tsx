'use client';

/**
 * Stress Test Toggle & Results Component
 * Simulates a single combined worst-case shock (-25% income AND +150 bps interest rate).
 * Free of emojis.
 */

import React, { useState } from 'react';
import { StressTestResult } from '../../../lib/engine';

interface StressToggleProps {
  stress: StressTestResult;
  baseIncome: number;
  baseRate: number;
  baseEmi: number;
}

export const StressToggle: React.FC<StressToggleProps> = ({
  stress,
  baseIncome,
  baseRate,
  baseEmi,
}) => {
  const [isStressedView, setIsStressedView] = useState(true);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Resilience Evaluation
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Combined Worst-Case Stress Test
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulates simultaneous -25% income reduction AND +150 bps policy rate hike.
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsStressedView(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isStressedView
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Baseline
          </button>
          <button
            type="button"
            onClick={() => setIsStressedView(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isStressedView
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stressed Scenario
          </button>
        </div>
      </div>

      {/* Comparison Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">Monthly Income</span>
          <div className="text-xl font-bold font-mono text-white">
            ₹
            {isStressedView
              ? stress.stressedMonthlyIncome.toLocaleString('en-IN')
              : baseIncome.toLocaleString('en-IN')}
          </div>
          <span
            className={`text-[11px] font-mono mt-1 block ${
              isStressedView ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            {isStressedView ? '-25% Income Shock' : 'Current Assessed'}
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">Interest Rate</span>
          <div className="text-xl font-bold font-mono text-white">
            {isStressedView ? `${stress.stressedRate}%` : `${baseRate}%`}
          </div>
          <span
            className={`text-[11px] font-mono mt-1 block ${
              isStressedView ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            {isStressedView ? '+150 bps Transmission' : 'Nominal Expected'}
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">Post-Loan FOIR</span>
          <div
            className={`text-xl font-bold font-mono ${
              isStressedView && stress.isOverLenderCap ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {Math.round(stress.stressedPostLoanFoir * 100)}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isStressedView && stress.isOverLenderCap ? 'Breaches Lender Cap' : 'Within Safety Cap'}
          </span>
        </div>
      </div>

      {/* Direct Warning Banner if over cap */}
      {stress.isOverLenderCap && stress.warningMessage ? (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-rose-400 uppercase tracking-wider">
              Stress Threshold Alert:
            </span>
          </div>
          <p className="text-rose-200 leading-relaxed">{stress.warningMessage}</p>
        </div>
      ) : (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200">
          <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
            Shock Absorbent:
          </span>
          Your household maintains positive cashflow buffers even under simultaneous economic contraction and interest rate escalation.
        </div>
      )}
    </div>
  );
};
