'use client';

/**
 * Persona Quick Load (Benchmark Review Tooling)
 * Pre-fills Priya, Ravi, and Anita with 1-click responsive state updates.
 * Free of emojis.
 */

import React from 'react';
import { useBorrower } from '../../context/BorrowerContext';
import { LiquidGlass } from '../LiquidGlass';

interface PersonaQuickLoadProps {
  onLoaded?: () => void;
  className?: string;
}

export const PersonaQuickLoad: React.FC<PersonaQuickLoadProps> = ({ onLoaded, className = '' }) => {
  const { loadPersona, activePersona, resetAnswers } = useBorrower();

  const personas = [
    {
      key: 'priya' as const,
      name: 'Priya',
      role: 'Salaried Professional',
      location: 'Bengaluru',
      summary: '₹1.10L/mo take-home · 780 CIBIL · ₹8L Personal Loan',
      expected: 'Verdict: Borrow',
      verdictColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    },
    {
      key: 'ravi' as const,
      name: 'Ravi',
      role: 'Self-Employed Retailer',
      location: 'Mysuru',
      summary: '₹38k/mo assessed · ₹45L Shop Premises · ₹15L Ask',
      expected: 'Verdict: Borrow less',
      verdictColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
    },
    {
      key: 'anita' as const,
      name: 'Anita',
      role: 'Informal Gig Worker',
      location: 'Hubballi',
      summary: '₹22.4k/mo · 3 High-Cost Apps · Recent Bounce',
      expected: "Verdict: Don't borrow now",
      verdictColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25',
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
            Benchmark Personas
          </span>
          <span className="text-[11px] text-ink-muted/80 dark:text-ink-muted-dark/80">
            · Fast test presets for evaluation
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            resetAnswers();
            if (onLoaded) onLoaded();
          }}
          className="text-xs text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors self-start sm:self-auto underline decoration-dotted underline-offset-2"
        >
          Reset to Blank
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personas.map((p) => {
          const isActive = activePersona === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                loadPersona(p.key);
                if (onLoaded) onLoaded();
              }}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-plum-50/90 dark:bg-plum-950/60 border-plum-900/60 dark:border-plum-400/60 shadow-glass'
                  : 'bg-white/60 dark:bg-surface-dark/60 border-rule-light dark:border-rule-dark hover:border-plum-400/50 hover:bg-white/90 dark:hover:bg-surface-dark/90'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="font-display font-medium text-base text-ink dark:text-ink-dark group-hover:text-plum-900 dark:group-hover:text-plum-300 transition-colors">
                    {p.name}
                  </span>
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark block">
                    {p.role} · {p.location}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 font-medium ${p.verdictColor}`}
                >
                  {p.expected}
                </span>
              </div>
              <p className="text-[11px] font-mono text-ink-muted dark:text-ink-muted-dark mt-2 line-clamp-1">
                {p.summary}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
