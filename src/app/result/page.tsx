'use client';

/**
 * Results Page (/result)
 * Hosts all four defensible output cards and the 8-section Negotiation Card.
 * Uses shared Header, Apple Liquid Glass architecture, and dual-theme styling. Zero emojis.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useBorrower } from '../../context/BorrowerContext';
import { Header } from '../../components/Header';
import { VerdictBanner } from '../../components/results/VerdictBanner';
import { AmountComparisonCard } from '../../components/results/AmountComparisonCard';
import { RateBandCard } from '../../components/results/RateBandCard';
import { EmiCeilingCard } from '../../components/results/EmiCeilingCard';
import { StressToggle } from '../../components/results/StressToggle';
import { NegotiationCard } from '../../components/results/NegotiationCard';
import { PersonaQuickLoad } from '../../components/dev/PersonaQuickLoad';
import { LiquidGlass } from '../../components/LiquidGlass';

export default function ResultPage() {
  const { evaluation, activePersona } = useBorrower();
  const [showDevBar, setShowDevBar] = useState<boolean>(true);

  const { o1Verdict, o2Amount, o3Rate, o4Emi, negotiationCard, metrics } = evaluation;

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between transition-colors duration-300">
      <Header />

      {/* Main Results Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Presets Bar */}
        <div className="print:hidden mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[var(--accent)]">
              Evaluation Deliverables
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDevBar(!showDevBar)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg bg-[var(--glass-subtle)] border border-[var(--border-subtle)] transition-colors"
              >
                {showDevBar ? 'Hide Benchmark Presets' : 'Benchmark Presets'}
              </button>
              <Link
                href="/assess"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white dark:text-slate-950 hover:opacity-90 transition-all shadow-sm"
              >
                Edit Answers
              </Link>
            </div>
          </div>

          {showDevBar && <PersonaQuickLoad />}
        </div>

        {/* Confidence Summary Badge */}
        <LiquidGlass
          intensity="low"
          className="mb-8 p-4 rounded-xl border border-[var(--glass-border)] print:hidden text-xs flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-tertiary)]">Assessed Net Income:</span>
            <span className="num-mono font-semibold text-[var(--text-primary)]">
              ₹{metrics.assessedIncome.toLocaleString('en-IN')}/mo
            </span>
            {metrics.incomeHaircutPercent > 0 && (
              <span className="text-[11px] num-mono text-amber-700 bg-amber-500/15 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/25">
                {metrics.incomeHaircutPercent}% Haircut Applied
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-tertiary)]">Confidence Calibration:</span>
            <span
              className={`font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full border ${
                metrics.confidenceLevel === 'narrow'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : metrics.confidenceLevel === 'medium'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
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
            <Link href="/assess" className="text-[var(--accent)] hover:underline text-xs font-medium ml-1">
              Tighten band
            </Link>
          </div>
        </LiquidGlass>

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
          <div className="mb-4 print:hidden">
            <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
              Branch Action Slip
            </span>
            <h3 className="text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight mt-0.5">
              Phone-Ready Borrower Negotiation Card
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              Take this to your lender branch or meeting. Enter their live interest rate quote in Field 6 to immediately surface your custom counter script.
            </p>
          </div>
          <NegotiationCard card={negotiationCard} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-6 text-center text-xs text-[var(--text-tertiary)] print:hidden transition-colors">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lokta Borrower Copilot · Independent Underwriting Framework</span>
          <span>Client-Side App Router Architecture · Pure Domain Rules</span>
        </div>
      </footer>
    </div>
  );
}
