'use client';

/**
 * O4 Safe EMI Ceiling & Multi-Tenure Matrix Card
 * Displays monthly safe payment limits alongside tenure vs interest trade-offs.
 * Built with Apple Liquid Glass aesthetic and dual theme tokens. Zero emojis.
 */

import React from 'react';
import { EmiResult } from '../../../lib/engine';
import { LiquidGlass } from '../LiquidGlass';

interface EmiCeilingCardProps {
  emi: EmiResult;
}

export const EmiCeilingCard: React.FC<EmiCeilingCardProps> = ({ emi }) => {
  return (
    <LiquidGlass
      intensity="medium"
      className="p-6 sm:p-8 rounded-2xl mb-8 border border-[var(--glass-border)] transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-medium">
            Output 4 — Monthly Capacity Architecture
          </span>
          <h2 className="text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight mt-1">
            Recommended Monthly Outflow Limit
          </h2>
        </div>
        <div className="sm:text-right">
          <div className="text-2xl sm:text-3xl font-semibold num-mono text-[var(--accent)] tracking-tight">
            ₹{emi.safeEmiCeiling.toLocaleString('en-IN')}
            <span className="text-sm font-normal text-[var(--text-tertiary)]">/mo</span>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            Anchor: {emi.recommendedTenureYears} Years Recommended Tenure
          </span>
        </div>
      </div>

      {/* Tenure Trade-Off Matrix */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-tertiary)] font-medium tracking-wide">
              <th className="py-3 px-3">Tenure Duration</th>
              <th className="py-3 px-3 num-mono">Monthly EMI</th>
              <th className="py-3 px-3 num-mono">Aggregate Interest</th>
              <th className="py-3 px-3 num-mono">Total Loan Cost</th>
              <th className="py-3 px-3 num-mono">Post-Loan FOIR</th>
              <th className="py-3 px-3 text-right">Structure Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {emi.tenureTable.map((opt) => (
              <tr
                key={opt.tenureYears}
                className={`transition-colors duration-150 ${
                  opt.isRecommended
                    ? 'bg-[var(--accent-subtle)] font-medium'
                    : 'hover:bg-[var(--glass-subtle)]'
                }`}
              >
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {opt.tenureYears} Years
                  </span>
                  <span className="text-[var(--text-tertiary)] block text-[11px] num-mono">
                    ({opt.tenureMonths} Months)
                  </span>
                </td>
                <td className="py-3.5 px-3 num-mono font-bold text-[var(--text-primary)]">
                  ₹{opt.monthlyEmi.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 num-mono text-[var(--text-secondary)]">
                  ₹{opt.totalInterestPaid.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 num-mono text-[var(--text-secondary)]">
                  ₹{opt.totalPayment.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 num-mono text-[var(--text-tertiary)]">
                  {Math.round(opt.foirShare * 100)}%
                </td>
                <td className="py-3.5 px-3 text-right">
                  {opt.isRecommended ? (
                    <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-white dark:text-slate-950">
                      Recommended
                    </span>
                  ) : (
                    <span className="text-[11px] text-[var(--text-tertiary)]">Alternative</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rationale on Trade-off */}
      <div className="rounded-xl p-4 bg-[var(--glass-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--text-primary)] block mb-1">
          Tenure Cost-vs-Cashflow Principle:
        </span>
        <p className="leading-relaxed">
          A shorter tenure increases your required monthly EMI, but dramatically curtails lifetime compounded interest. A longer tenure eases immediate monthly pressure, yet significantly inflates the aggregate cost of capital. Select the shortest duration that remains safely within your non-negotiable monthly cashflow envelope.
        </p>
      </div>
    </LiquidGlass>
  );
};
