'use client';

/**
 * Landing Page
 * Introduces Lokta Borrower Copilot, explains the four outputs, and provides entry to /assess.
 * Follows Section 2.2 of the implementation plan.
 * Free of emojis.
 */

import React from 'react';
import Link from 'next/link';
import { PersonaQuickLoad } from '../components/dev/PersonaQuickLoad';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/30">
              L
            </span>
            <span className="font-bold text-base tracking-tight text-white">
              Lokta <span className="text-slate-400 font-normal">Borrower Copilot</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/assess"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 w-full">
        {/* Dev Quick Load Toolbar */}
        <PersonaQuickLoad onLoaded={() => router.push('/result')} />

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <span>Independent Retail Credit Underwriting Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight font-display">
            Know what you can carry before entering the bank.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
            An objective, privacy-first companion for Indian retail borrowers. Turn your income, expenses, and asset profile into four clear numbers and a branch negotiation card.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assess"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 text-sm"
            >
              Start 3-Minute Assessment
            </Link>
            <Link
              href="/result"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-sm"
            >
              View Sample Results
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Zero login</span>
            <span>•</span>
            <span>Zero bureau pull</span>
            <span>•</span>
            <span>100% computed on your device</span>
          </div>
        </div>

        {/* Four Outputs Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Core Deliverables
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Four Defensible Outputs, Always
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono font-bold text-blue-400 block mb-1">
                OUTPUT 1
              </span>
              <h3 className="text-base font-semibold text-white mb-2">Verdict</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Borrow, Borrow less, or Don&apos;t borrow now. Clear, definitive decision with contributing factors and remediation steps.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-1">
                OUTPUT 2
              </span>
              <h3 className="text-base font-semibold text-white mb-2">Maximum Amount</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lender-likely sanction vs true safe debt capacity side-by-side, with clear guidance on why they differ.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-1">
                OUTPUT 3
              </span>
              <h3 className="text-base font-semibold text-white mb-2">Fair Interest Rate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Benchmark rate band anchored to the RBI repo rate (5.25%), plus all-in APR including processing fees and GST.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono font-bold text-purple-400 block mb-1">
                OUTPUT 4
              </span>
              <h3 className="text-base font-semibold text-white mb-2">Safe EMI Ceiling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monthly debt ceiling with multi-tenure trade-offs and a -25% income &amp; +150 bps rate shock stress test.
              </p>
            </div>
          </div>
        </div>

        {/* The Negotiation Card Preview */}
        <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
              Branch Companion
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1 mb-2">
              The Borrower Negotiation Card
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              A single, phone-first screen formatted for you to read at a bank branch counter. Includes your fair rate band, safe EMI ceiling, counter talk-track if the quote is elevated, and an interactive quote comparison input.
            </p>
          </div>

          <Link
            href="/result"
            className="shrink-0 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
          >
            Preview Negotiation Card
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lokta Take-Home Assessment · Indian Retail Credit Underwriting</span>
          <span>Zero Server Storage · 100% Client-Side Evaluation</span>
        </div>
      </footer>
    </div>
  );
}
