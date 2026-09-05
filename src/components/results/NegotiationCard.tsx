'use client';

/**
 * Negotiation Card Component
 * Phone-first, branch-ready companion presenting the 8 essential negotiation fields in order.
 * Follows Section 7 of the implementation plan.
 * Free of emojis.
 */

import React, { useState } from 'react';
import { NegotiationCardData } from '../../../lib/engine';
import { useBorrower } from '../../context/BorrowerContext';

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
    <div className="w-full bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black print:shadow-none mb-8">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800 print:border-gray-300 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 print:border-black print:text-black">
              Branch-Ready Companion
            </span>
            <span className="text-xs text-slate-400 print:text-gray-600 font-mono">
              Lokta Borrower Copilot
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white print:text-black tracking-tight mt-1">
            Borrower Negotiation Card
          </h2>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="print:hidden self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 shadow-sm"
        >
          Print / Save PDF
        </button>
      </div>

      {/* 8 Required Fields in Strict Order */}
      <div className="space-y-6 text-sm">
        {/* Field 1: Loan Type and Amount Requested */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            1. Loan Type & Amount Requested
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-base font-bold text-white print:text-black">{card.loanType}</span>
            <span className="text-lg font-mono font-bold text-blue-400 print:text-black">
              ₹{card.amountRequested.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Field 2: Fair Rate Band & All-In APR Range */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            2. Fair Rate Band & All-In APR
          </span>
          <div className="space-y-1">
            <div className="text-base font-mono font-bold text-emerald-400 print:text-black">
              {card.fairRateBandText}
            </div>
            <div className="text-xs font-mono text-slate-300 print:text-gray-700">
              {card.aprRangeText}
            </div>
          </div>
        </div>

        {/* Field 3: One Sentence Why (Top Two Factors) */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            3. Pricing Driver Rationale
          </span>
          <p className="text-slate-200 print:text-black leading-relaxed font-medium">
            {card.topTwoRateFactors}
          </p>
        </div>

        {/* Field 4: Safe EMI Ceiling at Recommended Tenure */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            4. Safe Monthly EMI Ceiling
          </span>
          <div className="text-lg font-mono font-bold text-white print:text-black mb-1">
            {card.safeEmiCeilingText}
          </div>
          <p className="text-xs text-slate-400 print:text-gray-600 leading-relaxed">
            {card.tenureTradeOffNote}
          </p>
        </div>

        {/* Field 5: Safe Amount vs Lender-Likely Amount */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-2">
            5. Sizing Benchmark: Safe vs Lender Ceiling
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div className="p-3 rounded-lg bg-emerald-950/30 print:bg-gray-100 border border-emerald-500/30 print:border-gray-300">
              <span className="text-[10px] uppercase font-bold text-emerald-400 print:text-black block">
                Safe Amount (Target)
              </span>
              <span className="text-base font-mono font-bold text-white print:text-black">
                ₹{card.safeAmount.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-slate-300 print:text-gray-600 mt-1">{card.safeAmountReason}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300">
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-black block">
                Lender-Likely Sanction
              </span>
              <span className="text-base font-mono font-bold text-slate-200 print:text-black">
                ₹{card.lenderSanctionAmount.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1">{card.lenderSanctionReason}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 print:text-gray-600 italic">
            {card.recommendedAmountGuidance}
          </p>
        </div>

        {/* Field 6: Blank Field for Lender's Actual Quote */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            6. Lender Actual Quote (Counter Entry)
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-48">
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 13.5"
                value={localQuote}
                onChange={(e) => handleQuoteChange(e.target.value)}
                className="w-full bg-slate-900 print:bg-white border border-slate-700 print:border-gray-400 rounded-lg px-3 py-2 text-sm font-mono text-white print:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">
                % p.a.
              </span>
            </div>
            {card.quoteComparisonNotes.differenceFromFair !== undefined && (
              <div
                className={`text-xs font-mono font-semibold px-2.5 py-1 rounded ${
                  card.quoteComparisonNotes.differenceFromFair > 0
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                }`}
              >
                {card.quoteComparisonNotes.differenceFromFair > 0
                  ? `+${card.quoteComparisonNotes.differenceFromFair}% above fair anchor`
                  : `${card.quoteComparisonNotes.differenceFromFair}% below fair anchor`}
              </div>
            )}
          </div>
        </div>

        {/* Field 7: What to Say If the Quote is Higher */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            7. Counter Talk-Track (If Offer is Elevated)
          </span>
          <p className="text-xs text-slate-200 print:text-black leading-relaxed font-medium">
            {card.quoteComparisonNotes.talkTrack}
          </p>
        </div>

        {/* Field 8: Confidence Note */}
        <div className="bg-slate-950/60 print:bg-gray-50 rounded-xl p-4 border border-slate-800/80 print:border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 print:text-gray-500 block mb-1">
            8. Estimation Confidence & Data Coverage
          </span>
          <p className="text-xs text-slate-400 print:text-gray-600 leading-relaxed font-mono">
            {card.confidenceNote}
          </p>
        </div>
      </div>
    </div>
  );
};
