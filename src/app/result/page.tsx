'use client';

/**
 * Results Page (/result)
 * Hosts all four defensible output cards and the 8-section Negotiation Card.
 * Follows Section 2.2 of the implementation plan.
 * Free of emojis.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useBorrower } from '../../context/BorrowerContext';
import { VerdictBanner } from '../../components/results/VerdictBanner';
import { AmountComparisonCard } from '../../components/results/AmountComparisonCard';
import { RateBandCard } from '../../components/results/RateBandCard';
import { EmiCeilingCard } from '../../components/results/EmiCeilingCard';
import { StressToggle } from '../../components/results/StressToggle';
import { NegotiationCard } from '../../components/results/NegotiationCard';
import { PersonaQuickLoad } from '../../components/dev/PersonaQuickLoad';

export default function ResultPage() {
  const { evaluation, activePersona } = useBorrower();
  const [showDevBar, setShowDevBar] = useState<boolean>(true);

  const { o1Verdict, o2Amount, o3Rate, o4Emi, negotiationCard, metrics } = evaluation;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              L
            </span>
            <span className="font-bold text-base tracking-tight text-white">
              Lokta <span className="text-slate-400 font-normal">Results</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {activePersona && (
              <span className="hidden sm:inline-block text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Persona: {activePersona.toUpperCase()}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowDevBar(!showDevBar)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
            >
              {showDevBar ? 'Hide Dev Presets' : 'Dev Presets'}
            </button>
            <Link
              href="/assess"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
            >
              Edit Inputs
            </Link>
          </div>
        </div>
      </header>

      {/* Main Results Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Dev Quick Load Presets */}
        <div className="print:hidden">
          {showDevBar && <PersonaQuickLoad />}
        </div>

        {/* Confidence Summary Badge */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 print:hidden text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Assessed Monthly Income:</span>
            <span className="font-mono font-bold text-white">
              ₹{metrics.assessedIncome.toLocaleString('en-IN')}/mo
            </span>
            {metrics.incomeHaircutPercent > 0 && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                {metrics.incomeHaircutPercent}% Haircut
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Confidence Band:</span>
            <span
              className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border ${
                metrics.confidenceLevel === 'narrow'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : metrics.confidenceLevel === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}
            >
              {metrics.confidenceLevel} (+/-{' '}
              {metrics.confidenceLevel === 'narrow'
                ? '5%'
                : metrics.confidenceLevel === 'medium'
                ? '10%'
                : '22%'}
              )
            </span>
            <Link href="/assess" className="text-blue-400 hover:underline text-xs">
              Refine answers
            </Link>
          </div>
        </div>

        {/* Output 1: Verdict Banner */}
        <VerdictBanner verdict={o1Verdict} />

        {/* Output 2: Maximum Amount (Lender vs Safe) */}
        <AmountComparisonCard amount={o2Amount} />

        {/* Output 3: Fair Rate and APR */}
        <RateBandCard rate={o3Rate} />

        {/* Output 4: Safe EMI Ceiling & Multi-Tenure Matrix */}
        <EmiCeilingCard emi={o4Emi} />

        {/* Output 4 Stress Scenario Simulator */}
        <StressToggle
          stress={o4Emi.stressTest}
          baseIncome={metrics.assessedIncome}
          baseRate={o3Rate.expectedNominalRate}
          baseEmi={o4Emi.safeEmiCeiling}
        />

        {/* Deliverable: The Negotiation Card */}
        <div className="mt-12">
          <div className="mb-3 print:hidden">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Branch Action Companion
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Negotiation Card for Bank Counters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Take this to your bank or NBFC branch. Use the interactive counter quote field to evaluate their proposal in real time.
            </p>
          </div>
          <NegotiationCard card={negotiationCard} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lokta Borrower Copilot · Take-Home Assessment</span>
          <span>Client-Side App Router Architecture · Pure Domain Rules</span>
        </div>
      </footer>
    </div>
  );
}
