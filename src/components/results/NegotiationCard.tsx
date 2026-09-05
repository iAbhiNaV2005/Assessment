'use client';

/**
 * Negotiation Card Component
 * Phone-first, branch-ready companion presenting the 8 essential negotiation fields in order.
 * Follows Section 7 of the implementation plan.
 * Liquid Glass styling with print-optimized media support. Zero emojis.
 */

import React, { useState } from 'react';
import { NegotiationCardData } from '../../../lib/engine';
import { useBorrower } from '../../context/BorrowerContext';
import { LiquidGlass } from '../LiquidGlass';

interface NegotiationCardProps {
  card: NegotiationCardData;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({ card }) => {
  const { quoteOverride, setQuoteOverride } = useBorrower();
  const [localQuote, setLocalQuote] = useState<string>(
    quoteOverride !== undefined ? String(quoteOverride) : ''
  );

  const handleQuoteChange = (val: string) => {
    setLocalQuote(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setQuoteOverride(num);
    } else {
      setQuoteOverride(undefined);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full mb-8">
      <LiquidGlass
        intensity="high"
        className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--accent)]/40 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black print:shadow-none print:p-4"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-6 border-b border-[var(--border-subtle)] print:border-gray-300 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 print:border-black print:text-black">
                Branch-Ready Counter Slip
              </span>
              <span className="text-xs text-[var(--text-tertiary)] print:text-gray-600 num-mono">
                Lokta Underwriting Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-[var(--text-primary)] print:text-black tracking-tight mt-1.5">
              Borrower Negotiation Counter Sheet
            </h2>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="print:hidden self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--glass-subtle)] hover:bg-[var(--glass-bg)] text-[var(--text-primary)] transition-all border border-[var(--border-subtle)] shadow-sm hover:border-[var(--accent)]"
          >
            Print / Save Document
          </button>
        </div>

        {/* 8 Required Fields in Strict Sequential Order */}
        <div className="space-y-4 text-sm">
          {/* Field 1: Loan Type and Amount Requested */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-1">
              1. Loan Classification & Amount Requested
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-base font-semibold text-[var(--text-primary)] print:text-black">
                {card.loanType}
              </span>
              <span className="text-xl num-mono font-semibold text-[var(--accent)] print:text-black">
                ₹{card.amountRequested.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Field 2: Fair Rate Band & All-In APR Range */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-1">
              2. Fair Rate Band & All-In APR Envelope
            </span>
            <div className="space-y-1">
              <div className="text-lg num-mono font-semibold text-[var(--text-primary)] print:text-black">
                {card.fairRateBandText}
              </div>
              <div className="text-xs num-mono text-[var(--text-secondary)] print:text-gray-700">
                {card.aprRangeText}
              </div>
            </div>
          </div>

          {/* Field 3: One Sentence Why (Top Two Factors) */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-1">
              3. Pricing Driver Rationale
            </span>
            <p className="text-[var(--text-secondary)] print:text-black leading-relaxed font-normal">
              {card.topTwoRateFactors}
            </p>
          </div>

          {/* Field 4: Safe EMI Ceiling at Recommended Tenure */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-1">
              4. Safe Monthly EMI Ceiling
            </span>
            <div className="text-lg num-mono font-semibold text-[var(--text-primary)] print:text-black mb-1">
              {card.safeEmiCeilingText}
            </div>
            <p className="text-xs text-[var(--text-secondary)] print:text-gray-600 leading-relaxed">
              {card.tenureTradeOffNote}
            </p>
          </div>

          {/* Field 5: Safe Amount vs Lender-Likely Amount */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-3">
              5. Principal Sizing Benchmark: Safe vs Lender Ceiling
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <div className="p-3.5 rounded-lg bg-[var(--accent-subtle)] print:bg-gray-100 border border-[var(--accent)]/30 print:border-gray-300">
                <span className="text-xs uppercase font-medium text-[var(--accent)] print:text-black block mb-0.5">
                  Safe Amount (Recommended)
                </span>
                <span className="text-lg num-mono font-semibold text-[var(--text-primary)] print:text-black">
                  ₹{card.safeAmount.toLocaleString('en-IN')}
                </span>
                <p className="text-xs text-[var(--text-secondary)] print:text-gray-600 mt-1">
                  {card.safeAmountReason}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[var(--glass-bg)] print:bg-gray-100 border border-[var(--border-subtle)] print:border-gray-300">
                <span className="text-xs uppercase font-medium text-[var(--text-tertiary)] print:text-black block mb-0.5">
                  Lender-Likely Sanction Limit
                </span>
                <span className="text-lg num-mono font-semibold text-[var(--text-primary)] print:text-black">
                  ₹{card.lenderSanctionAmount.toLocaleString('en-IN')}
                </span>
                <p className="text-xs text-[var(--text-secondary)] print:text-gray-600 mt-1">
                  {card.lenderSanctionReason}
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] print:text-gray-600 italic">
              {card.recommendedAmountGuidance}
            </p>
          </div>

          {/* Field 6: Blank Field for Lender's Actual Quote */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-2">
              6. Lender Branch Quote (Live Comparison Entry)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:w-56">
                <input
                  type="number"
                  step="0.05"
                  placeholder="e.g. 11.25"
                  value={localQuote}
                  onChange={(e) => handleQuoteChange(e.target.value)}
                  className="w-full bg-[var(--glass-bg)] print:bg-white border border-[var(--glass-border)] print:border-gray-400 rounded-xl px-3.5 py-2 text-sm num-mono text-[var(--text-primary)] print:text-black focus:outline-none focus:border-[var(--accent)] transition-all"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-[var(--text-tertiary)] pointer-events-none">
                  % p.a.
                </span>
              </div>
              {card.quoteComparisonNotes.differenceFromFair !== undefined && (
                <div
                  className={`text-xs num-mono font-semibold px-3 py-1.5 rounded-lg ${
                    card.quoteComparisonNotes.differenceFromFair > 0
                      ? 'text-amber-700 bg-amber-500/15 dark:text-amber-300 border border-amber-500/30'
                      : 'text-emerald-700 bg-emerald-500/15 dark:text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {card.quoteComparisonNotes.differenceFromFair > 0
                    ? `+${card.quoteComparisonNotes.differenceFromFair}% above benchmark median`
                    : `${card.quoteComparisonNotes.differenceFromFair}% below benchmark median`}
                </div>
              )}
            </div>
          </div>

          {/* Field 7: What to Say If the Quote is Higher */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-1">
              7. Counter Talk-Track (Desk Script)
            </span>
            <p className="text-xs text-[var(--text-primary)] print:text-black leading-relaxed font-medium">
              {card.quoteComparisonNotes.talkTrack}
            </p>
          </div>

          {/* Field 8: Confidence Note */}
          <div className="bg-[var(--glass-subtle)] print:bg-gray-50 rounded-xl p-4 border border-[var(--border-subtle)] print:border-gray-300">
            <span className="text-xs uppercase tracking-wider font-medium text-[var(--text-tertiary)] print:text-gray-500 block mb-1">
              8. Confidence Calibration & Coverage
            </span>
            <p className="text-xs text-[var(--text-tertiary)] print:text-gray-600 leading-relaxed num-mono">
              {card.confidenceNote}
            </p>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
};
