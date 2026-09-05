'use client';

/**
 * O2 Maximum Amount Comparison Card
 * Displays Lender-likely Sanction vs Safe Amount side-by-side with explicit guidance on which to use.
 * Free of emojis.
 */

import React from 'react';
import { AmountResult } from '../../../lib/engine';

interface AmountComparisonCardProps {
  amount: AmountResult;
}

export const AmountComparisonCard: React.FC<AmountComparisonCardProps> = ({ amount }) => {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
      <div className="mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Output 2 — Maximum Borrowing Capacity
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
          Lender Sanction vs Safe Amount
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Lenders maximize capital deployed based on legal ceilings. We compute what your monthly cashflow can actually carry.
        </p>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Safe Amount Card */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Safe Amount (Recommended)
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
              Cashflow Safe
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2">
            ₹{amount.safeAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {amount.safeCapReason}
          </p>
          <div className="pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-400/90 font-medium">
            Use this figure when planning your loan request to preserve emergency cash buffers.
          </div>
        </div>

        {/* Lender Likely Sanction Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Lender-Likely Sanction
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              Underwriting Cap
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-200 mb-2">
            ₹{amount.lenderSanctionAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {amount.lenderCapReason}
          </p>
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            The maximum loan a bank or NBFC will disburse before legal limits stop them.
          </div>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-4 text-xs text-slate-300">
        <span className="font-semibold text-white block mb-1">Which number should you use?</span>
        <p className="leading-relaxed text-slate-400">
          Always use the <strong className="text-emerald-400">Safe Amount</strong> unless external circumstances mandate higher borrowing. {amount.differenceNote}
        </p>
      </div>

      {/* Co-applicant potential banner if applicable */}
      {amount.coApplicantPotentialSanction && (
        <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-4 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-blue-300 uppercase tracking-wider">
              Household Co-Applicant Opportunity
            </span>
            <span className="font-mono text-blue-400 font-bold">
              Up to ₹{amount.coApplicantPotentialSanction.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            If your individual safe capacity falls short of your target ticket, pooling income with an earning co-applicant (such as an employed spouse) increases combined debt coverage to bridge the gap legitimately without predatory rates.
          </p>
        </div>
      )}
    </div>
  );
};
