'use client';

/**
 * Persona Quick Load (Dev Tooling)
 * Allows reviewers and recruiters to pre-fill Priya, Ravi, and Anita instantly.
 * Free of emojis.
 */

import React from 'react';
import { useBorrower } from '../../context/BorrowerContext';

interface PersonaQuickLoadProps {
  onLoaded?: () => void;
}

export const PersonaQuickLoad: React.FC<PersonaQuickLoadProps> = ({ onLoaded }) => {
  const { loadPersona, activePersona, resetAnswers } = useBorrower();

  const personas = [
    {
      key: 'priya' as const,
      name: 'Priya',
      role: 'Salaried, Bengaluru',
      details: '₹1.10L/mo, 790 Score, ₹8L PL',
      expected: 'Verdict: Borrow',
      expectedColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      key: 'ravi' as const,
      name: 'Ravi',
      role: 'Self-Employed, Mysuru',
      details: '₹38k/mo assessed, ₹45L Premises, ₹15L Ask',
      expected: 'Verdict: Borrow less',
      expectedColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      key: 'anita' as const,
      name: 'Anita',
      role: 'Informal Gig, Hubballi',
      details: '₹21k/mo, 3 App Loans, Recent Bounce',
      expected: "Verdict: Don't borrow now",
      expectedColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Dev Quick-Load Presets
          </span>
          <p className="text-xs text-slate-500">
            Pre-fills assessment inputs to test canonical personas end-to-end.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetAnswers();
            if (onLoaded) onLoaded();
          }}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          Reset to Clean State
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
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
              className={`text-left p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">{p.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.expectedColor}`}>
                  {p.expected}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-0.5">{p.role}</p>
              <p className="text-[11px] font-mono text-slate-500">{p.details}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
