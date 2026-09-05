'use client';

/**
 * Landing Page
 * Introduces Lokta Borrower Copilot with Newsreader editorial typography,
 * Apple Liquid Glass bento architecture, and dual-theme elegance. Zero emojis.
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { LiquidGlass } from '../components/LiquidGlass';
import { PersonaQuickLoad } from '../components/dev/PersonaQuickLoad';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between transition-colors duration-300">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 w-full">
        {/* Persona Quick Load Bar */}
        <div className="mb-12">
          <PersonaQuickLoad onLoaded={() => router.push('/result')} />
        </div>

        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/25 text-[var(--accent)] text-xs font-semibold tracking-wide">
                <span>Independent Retail Credit Underwriting</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-[var(--text-primary)] leading-[1.08]">
                Know what you can carry before entering the bank.
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] font-body leading-relaxed max-w-[54ch]">
                An objective, device-only companion for Indian retail borrowers. Turn income and liabilities into four defensible figures and a physical counter sheet.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/assess"
                  className="px-7 py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-white dark:text-slate-950 hover:opacity-90 transition-all text-sm text-center shadow-lg shadow-[var(--accent)]/20 active:scale-[0.98]"
                >
                  Start 3-Minute Assessment
                </Link>
                <Link
                  href="/result"
                  className="px-6 py-3.5 rounded-xl font-medium bg-[var(--glass-subtle)] hover:bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] transition-all text-sm text-center active:scale-[0.98]"
                >
                  View Verified Benchmarks
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-tertiary)] pt-1">
                <span>Zero login</span>
                <span className="text-[var(--border-subtle)]">|</span>
                <span>Zero credit bureau footprint</span>
                <span className="text-[var(--border-subtle)]">|</span>
                <span>100% computed on device</span>
              </div>
            </div>

            {/* Hero Graphic / Interactive Glass Badge */}
            <div className="lg:col-span-5">
              <LiquidGlass
                intensity="high"
                className="p-6 sm:p-7 rounded-3xl border border-[var(--glass-border)] space-y-5 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div className="text-xs uppercase font-medium text-[var(--text-tertiary)] tracking-wider">
                    Counter Readiness Index
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                    Live Engine
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[var(--glass-subtle)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-tertiary)] font-medium">Safe vs Sanction Gap</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg num-mono font-semibold text-[var(--accent)]">₹32,50,000</span>
                      <span className="text-xs text-[var(--text-secondary)]">vs ₹41,00,000 Bank Cap</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--glass-subtle)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-tertiary)] font-medium">Repo Anchored Floor</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg num-mono font-semibold text-[var(--text-primary)]">8.55% — 9.15%</span>
                      <span className="text-xs text-[var(--text-tertiary)] num-mono">+330 bps spread</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--glass-subtle)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-tertiary)] font-medium">Stress Resilience (-25% Income)</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg num-mono font-semibold text-emerald-600 dark:text-emerald-400">41% FOIR</span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-300">Under 50% Cap</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-tertiary)] leading-relaxed border-t border-[var(--border-subtle)] pt-3">
                  Underwritten against Indian banking norms: 50% FOIR ceiling, 5.25% RBI repo rate base, and multi-tenure total cost calculations.
                </div>
              </LiquidGlass>
            </div>
          </div>
        </section>

        {/* Four Deliverables Bento Section */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-medium">
              Core Deliverables
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-[var(--text-primary)] tracking-tight mt-1">
              Four Defensible Outputs, Always
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LiquidGlass
              intensity="low"
              className="p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent)]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs num-mono font-semibold text-[var(--accent)]">
                  OUTPUT 01
                </span>
                <span className="text-xs text-[var(--text-tertiary)] font-mono">Decision Rule</span>
              </div>
              <h3 className="text-xl font-display font-medium text-[var(--text-primary)] mb-2">
                Definitive Borrower Verdict
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
                Borrow, Borrow less, or Do not borrow now. Grounded in transparent underwriting metrics with clear remediation steps rather than arbitrary scoring.
              </p>
            </LiquidGlass>

            <LiquidGlass
              intensity="low"
              className="p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent)]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs num-mono font-semibold text-[var(--accent)]">
                  OUTPUT 02
                </span>
                <span className="text-xs text-[var(--text-tertiary)] font-mono">Debt Sizing</span>
              </div>
              <h3 className="text-xl font-display font-medium text-[var(--text-primary)] mb-2">
                Safe Amount vs Lender Sanction
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
                Separates the maximum a sales-driven lender will approve from the prudent debt load your family can actually service without financial distress.
              </p>
            </LiquidGlass>

            <LiquidGlass
              intensity="low"
              className="p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent)]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs num-mono font-semibold text-[var(--accent)]">
                  OUTPUT 03
                </span>
                <span className="text-xs text-[var(--text-tertiary)] font-mono">Pricing Anchor</span>
              </div>
              <h3 className="text-xl font-display font-medium text-[var(--text-primary)] mb-2">
                Fair Rate Band &amp; All-In APR
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
                Anchored directly to the RBI repo rate (5.25%), combined with risk spread decomposition and true annual percentage rate including processing fees and GST.
              </p>
            </LiquidGlass>

            <LiquidGlass
              intensity="low"
              className="p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent)]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs num-mono font-semibold text-[var(--accent)]">
                  OUTPUT 04
                </span>
                <span className="text-xs text-[var(--text-tertiary)] font-mono">Cashflow Limit</span>
              </div>
              <h3 className="text-xl font-display font-medium text-[var(--text-primary)] mb-2">
                Safe Monthly EMI &amp; Stress Resilience
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
                Multi-tenure cost matrix paired with an instant stress simulation: simultaneous 25% household income loss and 150 bps interest rate escalation.
              </p>
            </LiquidGlass>
          </div>
        </section>

        {/* The Negotiation Card Banner */}
        <LiquidGlass
          intensity="high"
          className="p-8 sm:p-10 rounded-3xl border-2 border-[var(--accent)]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
              Branch Companion
            </span>
            <h3 className="text-2xl font-display font-medium text-[var(--text-primary)] tracking-tight">
              The Phone-Ready Negotiation Card
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body leading-relaxed">
              Formatted specifically to take into your loan interview. Includes exact desk scripts, live rate comparison entry, and print-ready formatting.
            </p>
          </div>

          <Link
            href="/result"
            className="shrink-0 px-6 py-3.5 rounded-xl font-semibold bg-[var(--accent)] text-white dark:text-slate-950 hover:opacity-90 transition-all text-sm shadow-md active:scale-[0.98]"
          >
            Inspect Negotiation Card
          </Link>
        </LiquidGlass>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-6 text-xs text-[var(--text-tertiary)] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Lokta Take-Home Assessment · Indian Retail Credit Underwriting</span>
          <span>Zero Server Storage · 100% Client-Side Evaluation</span>
        </div>
      </footer>
    </div>
  );
}
