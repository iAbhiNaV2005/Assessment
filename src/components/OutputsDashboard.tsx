import React, { useState } from 'react';
import { AssessmentOutputs } from '../domain/types';
import { LiquidGlass } from './LiquidGlass';
import { 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';

interface OutputsDashboardProps {
  outputs: AssessmentOutputs;
  onOpenRules: () => void;
}

export const OutputsDashboard: React.FC<OutputsDashboardProps> = ({
  outputs,
  onOpenRules,
}) => {
  const { O1_Verdict, O2_Capacity, O3_Pricing, O4_Outflow } = outputs;
  const [selectedTenure, setSelectedTenure] = useState<number>(O4_Outflow.recommendedTenureMonths);
  const [showStressDetails, setShowStressDetails] = useState<boolean>(true);

  // Pick active tenure option
  const activeTenure = O4_Outflow.tenureOptions.find(t => t.tenureMonths === selectedTenure) 
    || O4_Outflow.tenureOptions[0];

  const getVerdictStyle = (v: string) => {
    switch (v) {
      case 'BORROW':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        };
      case 'BORROW_LESS':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-600 dark:border-amber-400 text-amber-800 dark:text-amber-300',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        };
      case 'DONT_BORROW':
      default:
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-600 dark:border-rose-400 text-rose-800 dark:text-rose-300',
          badge: 'bg-rose-600 text-white',
          icon: <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        };
    }
  };

  const verdictStyle = getVerdictStyle(O1_Verdict.verdict);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* OUTPUT 1: THE VERDICT BANNER                                              */}
      {/* ========================================================================= */}
      <LiquidGlass className={`p-6 border-2 ${verdictStyle.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5">{verdictStyle.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${verdictStyle.badge}`}>
                  Output 1 · {O1_Verdict.verdict.replace('_', ' ')}
                </span>
              </div>
              <h2 className="font-display font-medium text-2xl text-ink dark:text-ink-dark mt-1">
                {O1_Verdict.headline}
              </h2>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1.5 max-w-2xl leading-relaxed">
                {O1_Verdict.reason}
              </p>
              <button
                type="button"
                onClick={onOpenRules}
                className="mt-2 text-xs font-semibold text-plum-900 dark:text-plum-300 hover:underline inline-flex items-center gap-1"
              >
                Inspect {outputs.firedRules.length} underwriting rules applied to this verdict →
              </button>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="mt-5 pt-4 border-t border-rule-light dark:border-rule-dark/50 grid grid-cols-1 md:grid-cols-2 gap-3">
          {O1_Verdict.actionSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-ink dark:text-ink-dark">
              <span className="w-4 h-4 rounded-full bg-plum-100 dark:bg-plum-950 text-plum-900 dark:text-plum-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Critical Flags */}
        {O1_Verdict.criticalFlags.length > 0 && (
          <div className="mt-4 space-y-2">
            {O1_Verdict.criticalFlags.map((flag, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                  flag.severity === 'danger'
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-900'
                    : flag.severity === 'warning'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-900'
                    : 'bg-plum-100 dark:bg-plum-950/80 text-plum-950 dark:text-plum-200 border border-plum-300 dark:border-plum-900'
                }`}
              >
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{flag.title}: </span>
                  <span>{flag.detail}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </LiquidGlass>

      {/* 2-Column Grid for O2 (Capacity) & O3 (Pricing) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================================= */}
        {/* OUTPUT 2: MAXIMUM AMOUNT (Lender Sanction vs Safe Carry)                  */}
        {/* ========================================================================= */}
        <LiquidGlass className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rule-light dark:border-rule-dark mb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-plum-900 dark:text-plum-300">
                  Output 2 · Capacity Separation
                </span>
                <h3 className="font-display font-medium text-xl text-ink dark:text-ink-dark">
                  Maximum Borrowing Capacity
                </h3>
              </div>
              <ShieldCheck className="w-5 h-5 text-plum-900 dark:text-plum-300" />
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Lender Sanction */}
              <div className="p-3.5 rounded-xl bg-surface-light/70 dark:bg-surface-dark/70 border border-rule-light dark:border-rule-dark">
                <span className="text-[11px] font-medium text-ink-muted dark:text-ink-muted-dark block">
                  What Lender Will Sanction
                </span>
                <div className="font-display font-medium text-2xl text-ink dark:text-ink-dark mt-1 num-mono">
                  ₹{(O2_Capacity.lenderSanctionAmount / 100000).toFixed(2)} <span className="text-xs font-sans text-ink-muted">Lakhs</span>
                </div>
                <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-1 block">
                  Max bank underwriting threshold (FOIR: {O2_Capacity.foirCapPct}%)
                </span>
              </div>

              {/* Safe Carry */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-600 dark:border-emerald-400">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  What You Can Safely Carry
                </span>
                <div className="font-display font-medium text-2xl text-emerald-900 dark:text-emerald-200 mt-1 num-mono">
                  ₹{(O2_Capacity.safeCarryAmount / 100000).toFixed(2)} <span className="text-xs font-sans text-emerald-700 dark:text-emerald-400">Lakhs</span>
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block font-medium">
                  Protected surplus after living costs & buffer
                </span>
              </div>
            </div>

            {/* Guidance on which to use */}
            <div className="p-3 rounded-xl bg-plum-50 dark:bg-plum-950/50 border border-plum-200 dark:border-plum-900/60 text-xs">
              <span className="font-semibold text-plum-900 dark:text-plum-200 block mb-0.5">
                Recommendation: Which number to follow?
              </span>
              <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                {O2_Capacity.metricJustification}
              </p>
            </div>
          </div>

          {/* FOIR Meter */}
          <div className="mt-4 pt-3 border-t border-rule-light dark:border-rule-dark flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark">
            <span>Current FOIR: <b className="text-ink dark:text-ink-dark num-mono">{O2_Capacity.currentFoirPct}%</b></span>
            <span>Projected FOIR: <b className="text-plum-900 dark:text-plum-300 num-mono">{O2_Capacity.projectedFoirPct}%</b> (Max: {O2_Capacity.foirCapPct}%)</span>
          </div>
        </LiquidGlass>

        {/* ========================================================================= */}
        {/* OUTPUT 3: FAIR INTEREST RATE & ALL-IN APR                                */}
        {/* ========================================================================= */}
        <LiquidGlass className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rule-light dark:border-rule-dark mb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-plum-900 dark:text-plum-300">
                  Output 3 · Pricing Benchmark
                </span>
                <h3 className="font-display font-medium text-xl text-ink dark:text-ink-dark">
                  Fair Interest Rate & True APR
                </h3>
              </div>
              <Percent className="w-5 h-5 text-plum-900 dark:text-plum-300" />
            </div>

            {/* Product routing pill */}
            <div className="mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-plum-100 dark:bg-plum-950 text-plum-950 dark:text-plum-200 border border-plum-300 dark:border-plum-800">
                Routed Product: {O3_Pricing.productDisplayName}
              </span>
            </div>

            {/* Rate vs APR Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Benchmark Rate Band */}
              <div className="p-3.5 rounded-xl bg-surface-light/70 dark:bg-surface-dark/70 border border-rule-light dark:border-rule-dark">
                <span className="text-[11px] font-medium text-ink-muted dark:text-ink-muted-dark block">
                  Fair Rate Band (Reducing)
                </span>
                <div className="font-display font-medium text-2xl text-ink dark:text-ink-dark mt-1 num-mono">
                  {O3_Pricing.rateBandMin}% - {O3_Pricing.rateBandMax}%
                </div>
                <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-1 block">
                  Expected bank benchmark quote
                </span>
              </div>

              {/* All-in APR */}
              <div className="p-3.5 rounded-xl bg-surface-light/70 dark:bg-surface-dark/70 border border-plum-300 dark:border-plum-700/60">
                <span className="text-[11px] font-bold text-plum-900 dark:text-plum-300 block">
                  All-In APR (RBI Standard)
                </span>
                <div className="font-display font-medium text-2xl text-plum-900 dark:text-plum-200 mt-1 num-mono">
                  {O3_Pricing.aprMin}% - {O3_Pricing.aprMax}%
                </div>
                <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-1 block">
                  True cost with {O3_Pricing.processingFeePctMin}%-{O3_Pricing.processingFeePctMax}% fee + 18% GST
                </span>
              </div>
            </div>

            {/* Why this rate */}
            <div className="p-3 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 border border-rule-light dark:border-rule-dark text-xs space-y-1">
              <span className="font-semibold text-ink dark:text-ink-dark block">
                Why this rate band?
              </span>
              <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                {O3_Pricing.rateDriverExplanation}
              </p>
            </div>
          </div>

          {/* Fee Cap Advice */}
          <div className="mt-4 pt-3 border-t border-rule-light dark:border-rule-dark text-xs text-ink-muted dark:text-ink-muted-dark">
            <span>Processing fee ceiling: <b className="text-ink dark:text-ink-dark">{O3_Pricing.processingFeePctMax}% + GST</b> (Refuse higher quotes).</span>
          </div>
        </LiquidGlass>
      </div>

      {/* ========================================================================= */}
      {/* OUTPUT 4: SAFE EMI CEILING & TENURE SENSITIVITY                           */}
      {/* ========================================================================= */}
      <LiquidGlass className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-rule-light dark:border-rule-dark mb-5 gap-2">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-plum-900 dark:text-plum-300">
              Output 4 · Outflow Discipline
            </span>
            <h3 className="font-display font-medium text-xl text-ink dark:text-ink-dark">
              Safe Monthly EMI Ceiling & Tenure Trade-Off
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-ink-muted dark:text-ink-muted-dark block">Safe Monthly Outflow Cap:</span>
            <span className="font-display font-medium text-2xl text-emerald-700 dark:text-emerald-400 num-mono">
              ₹{O4_Outflow.safeEmiCeiling.toLocaleString('en-IN')} <span className="text-xs font-sans">/ month</span>
            </span>
          </div>
        </div>

        {/* Tenure Selection & Matrix */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-xs gap-1">
            <span className="font-semibold text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-plum-900 dark:text-plum-300" />
              Compare Repayment Tenures:
            </span>
            <span className="text-plum-900 dark:text-plum-300 font-medium num-mono">
              Selected {activeTenure.tenureMonths} Mo: EMI ₹{activeTenure.emi.toLocaleString('en-IN')}/mo (Total Interest: ₹{(activeTenure.totalInterest / 100000).toFixed(2)}L)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {O4_Outflow.tenureOptions.map((opt) => (
              <button
                type="button"
                key={opt.tenureMonths}
                onClick={() => setSelectedTenure(opt.tenureMonths)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  selectedTenure === opt.tenureMonths
                    ? 'bg-plum-900 text-white dark:bg-plum-950 dark:text-plum-100 border-plum-900 dark:border-plum-400 shadow-md ring-2 ring-plum-400/20'
                    : 'bg-surface-light/60 dark:bg-surface-dark/60 border-rule-light dark:border-rule-dark hover:border-plum-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{opt.tenureMonths} Months</span>
                  {opt.isRecommended && (
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1 py-0.2 rounded bg-emerald-500 text-white">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="font-display font-medium text-lg mt-1 num-mono">
                  ₹{opt.emi.toLocaleString('en-IN')}
                  <span className="text-[10px] font-sans block opacity-75">/ mo</span>
                </div>
                <div className="text-[10px] opacity-80 mt-1 border-t border-current/20 pt-1">
                  Interest: ₹{(opt.totalInterest / 100000).toFixed(2)}L
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Case Section */}
        <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h4 className="font-semibold text-xs text-amber-950 dark:text-amber-200">
                Stress Case Simulation: {O4_Outflow.stressCase.title}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowStressDetails(!showStressDetails)}
              className="text-xs text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              {showStressDetails ? 'Hide details' : 'View shock impact'}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showStressDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showStressDetails && (
            <div className="mt-3 text-xs space-y-2 pt-2 border-t border-amber-200 dark:border-amber-900/40">
              <p className="text-amber-900 dark:text-amber-300">
                {O4_Outflow.stressCase.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 font-medium">
                <div>
                  <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 block">Stressed Income:</span>
                  <span className="num-mono font-bold text-ink dark:text-ink-dark">₹{O4_Outflow.stressCase.stressedIncome.toLocaleString('en-IN')}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 block">Stressed EMI (+2% rate):</span>
                  <span className="num-mono font-bold text-ink dark:text-ink-dark">₹{O4_Outflow.stressCase.stressedEmi.toLocaleString('en-IN')}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 block">Stressed FOIR:</span>
                  <span className="num-mono font-bold text-ink dark:text-ink-dark">{O4_Outflow.stressCase.stressedFoirPct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 block">Solvency Status:</span>
                  <span className={`font-bold ${O4_Outflow.stressCase.isSustainable ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {O4_Outflow.stressCase.isSustainable ? 'Sustainable Surplus' : 'Deficit Risk'}
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/60 dark:bg-surface-dark/80 text-ink dark:text-ink-dark">
                <b>Contingency Advice: </b>{O4_Outflow.stressCase.contingencyAdvice}
              </div>
            </div>
          )}
        </div>
      </LiquidGlass>
    </div>
  );
};
