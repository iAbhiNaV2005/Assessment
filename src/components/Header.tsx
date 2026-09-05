'use client';

/**
 * Universal Navigation Header Component
 * Editorial branding, route navigation, live persona quick-switcher, and theme toggle.
 * Built with Apple Liquid Glass pill aesthetics and zero emojis.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBorrower } from '../context/BorrowerContext';
import { RulesInspectorModal } from './RulesInspectorModal';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { loadPersona, activePersona } = useBorrower();
  const [isDark, setIsDark] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lokta_theme');
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    } catch {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('lokta_theme', 'light');
      } catch {}
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('lokta_theme', 'dark');
      } catch {}
      setIsDark(true);
    }
  };

  const personas = [
    { key: 'priya' as const, label: 'Priya', role: '790 CIBIL' },
    { key: 'ravi' as const, label: 'Ravi', role: 'Self-Employed' },
    { key: 'anita' as const, label: 'Anita', role: 'Informal Gig' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-rule-light/80 dark:border-rule-dark/80 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl transition-colors print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-plum-900 dark:bg-plum-400 text-white dark:text-plum-950 flex items-center justify-center font-display font-semibold text-base shadow-sm transition-transform group-hover:scale-105">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-medium text-lg text-ink dark:text-ink-dark tracking-tight">
                  Lokta
                </span>
                <span className="text-xs uppercase tracking-widest text-ink-muted dark:text-ink-muted-dark font-sans font-semibold">
                  Copilot
                </span>
              </div>
              <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark block font-sans">
                Retail Underwriting Companion
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center p-1 rounded-full bg-surface-light dark:bg-surface-dark border border-rule-light dark:border-rule-dark text-xs font-medium">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                pathname === '/'
                  ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/assess"
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                pathname === '/assess'
                  ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              Assessment
            </Link>
            <Link
              href="/result"
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                pathname === '/result'
                  ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              Results &amp; Card
            </Link>
          </nav>

          {/* Right Actions: Persona Switcher, Rules, Theme */}
          <div className="flex items-center gap-2">
            {/* Quick Persona Pills */}
            <div className="hidden lg:flex items-center p-0.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-rule-light dark:border-rule-dark text-[11px]">
              {personas.map((p) => {
                const isActive = activePersona === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => loadPersona(p.key)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-plum-900 text-white dark:bg-plum-400 dark:text-plum-950 shadow-sm'
                        : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
                    }`}
                    title={`Load ${p.label}'s verified benchmark scenario`}
                  >
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Rules Modal Button */}
            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="px-2.5 py-1.5 rounded-xl border border-rule-light dark:border-rule-dark bg-surface-light/80 dark:bg-surface-dark/80 text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark transition-all text-xs font-medium"
              title="Inspect underwriting rules and constants"
            >
              Rules
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-rule-light dark:border-rule-dark bg-surface-light/80 dark:bg-surface-dark/80 text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark transition-all text-xs"
              aria-label="Toggle Theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-plum-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Rules Inspector Drawer */}
      <RulesInspectorModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        firedRules={[]}
      />
    </>
  );
};
