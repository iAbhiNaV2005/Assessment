'use client';

/**
 * O2 Maximum Amount Comparison Card
 * Executive double-column ledger comparing Safe Carry Capacity vs Lender Sanction Ceiling.
 * Built with Apple Liquid Glass aesthetics and zero emojis.
 */

import React from 'react';
import { AmountResult } from '../../../lib/engine';
import { LiquidGlass } from '../LiquidGlass';

interface AmountComparisonCardProps {
  amount: AmountResult;
}

export const AmountComparisonCard: React.FC<AmountComparisonCardProps> = ({ amount }) => {
  return (
    <LiquidGlass variant="card" className="w-full mb-8">
      <div className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted dark:text-ink-muted-dark">
          Output 2 · Maximum Borrowing Capacity
        </span>
        <h2 className="text-xl sm:text-2xl font-display font-medium text-ink dark:text-ink-dark tracking-tight mt-1">
          Lender Sanction vs Safe Amount
        </h2>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1 leading-relaxed">
          Lenders maximize capital deployed based on legal ceilings. We compute what your monthly cashflow can actually carry.
        </p>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Safe Amount Card */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Safe Amount (Recommended)
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Cashflow Safe
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono num-mono font-bold text-ink dark:text-ink-dark mb-2">
            ₹{amount.safeAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed mb-4">
            {amount.safeCapReason}
          </p>
          <div className="pt-3 border-t border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            Use this figure to preserve emergency household cash buffers.
          </div>
        </div>

        {/* Lender Likely Sanction Card */}
        <div className="bg-white/50 dark:bg-surface-dark/50 border border-rule-light dark:border-rule-dark rounded-2xl p-5 sm:p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
              Lender-Likely Sanction
            </span>
            <span className="text-[10px] bg-surface-light dark:bg-surface-dark text-ink-muted dark:text-ink-muted-dark px-2.5 py-0.5 rounded-full font-mono font-medium">
              Underwriting Cap
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono num-mono font-bold text-ink dark:text-ink-dark mb-2">
            ₹{amount.lenderSanctionAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed mb-4">
            {amount.lenderCapReason}
          </p>
          <div className="pt-3 border-t border-rule-light dark:border-rule-dark text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
            The maximum ticket an institution will disburse before legal limits stop them.
          </div>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="bg-surface-light/70 dark:bg-surface-dark/70 rounded-xl p-4 border border-rule-light/80 dark:border-rule-dark/80 mb-4 text-xs text-ink-muted dark:text-ink-muted-dark">
        <span className="font-semibold text-ink dark:text-ink-dark block mb-1">
          Which number should you use?
        </span>
        <p className="leading-relaxed">
          Always anchor to the <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Safe Amount</strong> unless external circumstances mandate higher borrowing. {amount.differenceNote}
        </p>
      </div>

      {/* Co-applicant potential banner if applicable */}
      {amount.coApplicantPotentialSanction && (
        <div className="bg-plum-50/80 dark:bg-plum-950/25 border border-plum-500/25 rounded-xl p-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
            <span className="font-semibold text-plum-900 dark:text-plum-300 uppercase tracking-wider text-[11px]">
              Household Co-Applicant Opportunity
            </span>
            <span className="font-mono num-mono text-plum-900 dark:text-plum-300 font-bold text-sm">
              Up to ₹{amount.coApplicantPotentialSanction.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            If individual safe capacity falls short of your target ticket, pooling income with an earning co-applicant (such as an employed spouse) increases combined debt coverage to bridge the gap legitimately.
          </p>
        </div>
      )}
    </LiquidGlass>
  );
};
