'use client';

/**
 * Stress Test Toggle & Results Component
 * Simulates a single combined worst-case shock (-25% income AND +150 bps interest rate).
 * Apple Liquid Glass styling with dual theme support. Zero emojis.
 */

import React, { useState } from 'react';
import { StressTestResult } from '../../../lib/engine';
import { LiquidGlass } from '../LiquidGlass';

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
    <LiquidGlass
      intensity="medium"
      className="p-6 sm:p-8 rounded-2xl mb-8 border border-[var(--glass-border)] transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-medium">
            Resilience Audit
          </span>
          <h2 className="text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight mt-1">
            Combined Worst-Case Stress Simulation
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl leading-relaxed">
            Simulates simultaneous macroeconomic contraction: a 25% drop in net household earnings alongside a 150 bps policy rate hike transmitted directly into your loan.
          </p>
        </div>

        {/* Tactile Toggle Controls */}
        <div className="flex items-center bg-[var(--glass-subtle)] p-1 rounded-xl border border-[var(--border-subtle)] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsStressedView(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              !isStressedView
                ? 'bg-[var(--accent)] text-white dark:text-slate-950 font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Baseline State
          </button>
          <button
            type="button"
            onClick={() => setIsStressedView(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isStressedView
                ? 'bg-rose-600 text-white font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Stressed Shock
          </button>
        </div>
      </div>

      {/* Comparison Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--glass-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 transition-all">
          <span className="text-xs text-[var(--text-tertiary)] font-medium block mb-1">
            Monthly Net Income
          </span>
          <div className="text-xl sm:text-2xl font-semibold num-mono text-[var(--text-primary)] tracking-tight">
            ₹
            {isStressedView
              ? stress.stressedMonthlyIncome.toLocaleString('en-IN')
              : baseIncome.toLocaleString('en-IN')}
          </div>
          <span
            className={`text-xs num-mono mt-1.5 block font-medium ${
              isStressedView ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text-tertiary)]'
            }`}
          >
            {isStressedView ? '-25% Income Shock' : 'Standard Underwriting'}
          </span>
        </div>

        <div className="bg-[var(--glass-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 transition-all">
          <span className="text-xs text-[var(--text-tertiary)] font-medium block mb-1">
            Benchmark Interest Rate
          </span>
          <div className="text-xl sm:text-2xl font-semibold num-mono text-[var(--text-primary)] tracking-tight">
            {isStressedView ? `${stress.stressedRate}%` : `${baseRate}%`}
          </div>
          <span
            className={`text-xs num-mono mt-1.5 block font-medium ${
              isStressedView ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text-tertiary)]'
            }`}
          >
            {isStressedView ? '+150 bps Transmission' : 'Nominal Assessed Rate'}
          </span>
        </div>

        <div className="bg-[var(--glass-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 transition-all">
          <span className="text-xs text-[var(--text-tertiary)] font-medium block mb-1">
            Post-Loan FOIR Obligation
          </span>
          <div
            className={`text-xl sm:text-2xl font-semibold num-mono tracking-tight ${
              isStressedView && stress.isOverLenderCap
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-[var(--accent)]'
            }`}
          >
            {Math.round(stress.stressedPostLoanFoir * 100)}%
          </div>
          <span className="text-xs text-[var(--text-tertiary)] mt-1.5 block">
            {isStressedView && stress.isOverLenderCap
              ? 'Exceeds Prudential 50% Threshold'
              : 'Safely Within Prudential Limit'}
          </span>
        </div>
      </div>

      {/* Outcome Analysis Box */}
      {stress.isOverLenderCap && stress.warningMessage ? (
        <div className="rounded-xl p-4 text-xs bg-rose-500/10 border border-rose-500/25 text-rose-900 dark:text-rose-200">
          <div className="font-semibold uppercase tracking-wider mb-1 text-rose-700 dark:text-rose-300">
            Prudential Threshold Alert
          </div>
          <p className="leading-relaxed">{stress.warningMessage}</p>
        </div>
      ) : (
        <div className="rounded-xl p-4 text-xs bg-emerald-500/10 border border-emerald-500/25 text-emerald-900 dark:text-emerald-200">
          <span className="font-semibold uppercase tracking-wider block mb-1 text-emerald-700 dark:text-emerald-300">
            Resilient Cushion Confirmed
          </span>
          <p className="leading-relaxed">
            Your monthly net cash flows retain healthy operational safety margins even under severe concurrent income disruption and macroeconomic rate tightening.
          </p>
        </div>
      )}
    </LiquidGlass>
  );
};
