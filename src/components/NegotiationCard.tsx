import React from 'react';
import { AssessmentOutputs } from '../domain/types';
import { LiquidGlass } from './LiquidGlass';
import { ShieldCheck, AlertCircle, Award, CheckCircle, FileText } from 'lucide-react';

interface NegotiationCardProps {
  outputs: AssessmentOutputs;
  onPrint: () => void;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({
  outputs,
  onPrint,
}) => {
  const { negotiationCard, O3_Pricing, O2_Capacity, O1_Verdict } = outputs;

  return (
    <div className="mt-8 pt-8 border-t border-rule-light dark:border-rule-dark" id="negotiation-card-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-plum-900 dark:text-plum-300">
            Branch Negotiation Tool
          </span>
          <h2 className="font-display font-medium text-2xl text-ink dark:text-ink-dark">
            Your Branch Negotiation Card
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            Hold this screen up or hand this printed card to the branch manager or loan agent before signing
          </p>
        </div>
        <button
          type="button"
          onClick={onPrint}
          className="px-4 py-2 rounded-xl bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 text-xs font-semibold hover:bg-plum-800 dark:hover:bg-plum-200 transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export / Print One-Pager</span>
        </button>
      </div>

      {/* The Printable One-Page Card */}
      <div className="print-area">
        <LiquidGlass className="p-7 border-2 border-plum-700/60 dark:border-plum-400/40 bg-white/90 dark:bg-surface-dark/95 shadow-glass-lg rounded-3xl">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-rule-light dark:border-rule-dark">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-plum-900 dark:text-plum-300 bg-plum-100 dark:bg-plum-950 px-2 py-0.5 rounded">
                  Borrower Copilot · Official Assessment Card
                </span>
              </div>
              <h3 className="font-display font-medium text-2xl text-ink dark:text-ink-dark mt-1">
                {negotiationCard.borrowerProfileSummary}
              </h3>
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Target Product: <b>{O3_Pricing.productDisplayName}</b> | Approved Capacity: <b>₹{(O2_Capacity.recommendedAmount / 100000).toFixed(2)} Lakhs</b>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark block">Assessed Verdict:</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                O1_Verdict.verdict === 'BORROW' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : O1_Verdict.verdict === 'BORROW_LESS'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {O1_Verdict.verdict.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Core Benchmark Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
            <div className="p-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-ink-muted dark:text-ink-muted-dark block">
                Fair Interest Rate
              </span>
              <div className="font-display font-medium text-xl text-plum-900 dark:text-plum-200 mt-0.5 num-mono">
                {O3_Pricing.rateBandMin}% - {O3_Pricing.rateBandMax}%
              </div>
              <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark">
                Annual Reducing Balance (Not Flat)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-ink-muted dark:text-ink-muted-dark block">
                Max Fair Processing Fee
              </span>
              <div className="font-display font-medium text-xl text-ink dark:text-ink-dark mt-0.5 num-mono">
                {O3_Pricing.processingFeePctMin}% - {O3_Pricing.processingFeePctMax}%
              </div>
              <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark">
                Plus 18% GST (Zero extra login fees)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-ink-muted dark:text-ink-muted-dark block">
                All-In True APR Ceiling
              </span>
              <div className="font-display font-medium text-xl text-emerald-700 dark:text-emerald-300 mt-0.5 num-mono">
                {O3_Pricing.aprMin}% - {O3_Pricing.aprMax}%
              </div>
              <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark">
                RBI KFS Standard (All charges included)
              </span>
            </div>
          </div>

          {/* Branch Script & Leverage Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
            {/* What to Say */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-ink-dark">
                <Award className="w-4 h-4 text-plum-900 dark:text-plum-300" />
                <span>Your Leverage Script (Say this to the Loan Officer):</span>
              </div>
              <ul className="space-y-2 text-xs text-ink-muted dark:text-ink-muted-dark">
                {negotiationCard.leveragePoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-surface-light/50 dark:bg-surface-dark/40 p-2 rounded-xl">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags to Refuse */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Predatory Terms to Reject (Walk away if pushed):</span>
              </div>
              <ul className="space-y-2 text-xs text-ink-muted dark:text-ink-muted-dark">
                {negotiationCard.redFlagsToWalkAway.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-xl text-rose-950 dark:text-rose-200">
                    <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">[X]</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="mt-6 pt-4 border-t border-rule-light dark:border-rule-dark flex items-center justify-between text-[11px] text-ink-muted dark:text-ink-muted-dark">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{negotiationCard.rbiKeyFactSheetNotice}</span>
            </div>
            <span className="font-mono text-[10px]">Lokta Borrowing Standards v1.0</span>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
};
