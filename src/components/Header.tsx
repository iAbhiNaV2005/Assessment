import React from 'react';
import { Sun, Moon, Scale, Printer } from 'lucide-react';

interface HeaderProps {
  selectedPersona: 'priya' | 'ravi' | 'anita' | 'custom';
  onSelectPersona: (key: 'priya' | 'ravi' | 'anita' | 'custom') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenRules: () => void;
  onPrintCard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPersona,
  onSelectPersona,
  isDarkMode,
  onToggleTheme,
  onOpenRules,
  onPrintCard,
}) => {
  return (
    <header className="border-b border-rule-light dark:border-rule-dark pb-6 mb-8 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-ink-muted dark:text-ink-muted-dark">
                Lokta · Self-Assessment · Retail Credit
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                100% Client-Side & Private
              </span>
            </div>
            <h1 className="font-display font-normal text-3xl sm:text-4xl text-ink dark:text-ink-dark tracking-tight">
              Borrower <span className="italic text-plum-900 dark:text-plum-300 font-medium">Copilot</span>
            </h1>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1 max-w-2xl">
              Self-assessment companion answering whether to borrow, safe borrowing capacity, fair interest benchmark, and branch negotiation.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Quick Persona Switcher */}
            <div className="flex items-center bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-rule-light dark:border-rule-dark text-xs">
              <button
                type="button"
                onClick={() => onSelectPersona('priya')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPersona === 'priya'
                    ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                    : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                Priya (780 CIBIL)
              </button>
              <button
                type="button"
                onClick={() => onSelectPersona('ravi')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPersona === 'ravi'
                    ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                    : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                Ravi (Kirana / LAP)
              </button>
              <button
                type="button"
                onClick={() => onSelectPersona('anita')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPersona === 'anita'
                    ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                    : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                Anita (Informal / App Debt)
              </button>
              <button
                type="button"
                onClick={() => onSelectPersona('custom')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPersona === 'custom'
                    ? 'bg-white dark:bg-plum-950 text-plum-900 dark:text-plum-200 shadow-sm'
                    : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                Custom Assessment
              </button>
            </div>

            {/* Utility Actions */}
            <button
              type="button"
              onClick={onOpenRules}
              className="p-2 rounded-xl border border-rule-light dark:border-rule-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Inspect Underwriting Rules"
            >
              <Scale className="w-4 h-4 text-plum-900 dark:text-plum-300" />
              <span className="hidden sm:inline">Rules Engine</span>
            </button>

            <button
              type="button"
              onClick={onPrintCard}
              className="p-2 rounded-xl border border-rule-light dark:border-rule-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Print Negotiation Card"
            >
              <Printer className="w-4 h-4 text-plum-900 dark:text-plum-300" />
              <span className="hidden sm:inline">Print Card</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-rule-light dark:border-rule-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark/80 transition-colors"
              aria-label="Toggle color theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-plum-900" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
