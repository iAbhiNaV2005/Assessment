import React from 'react';
import { LiquidGlass } from './LiquidGlass';
import { User, Briefcase, AlertTriangle, ArrowRight } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: 'priya' | 'ravi' | 'anita' | 'custom';
  onSelect: (key: 'priya' | 'ravi' | 'anita' | 'custom') => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelect,
}) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl text-ink dark:text-ink-dark font-medium">
          Benchmark Profiles
        </h2>
        <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
          Select a profile to load verified test data, or customize your own
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Priya Card */}
        <LiquidGlass
          variant={selectedPersona === 'priya' ? 'highlight' : 'card'}
          interactive
          onClick={() => onSelect('priya')}
          className={`relative p-5 cursor-pointer border-2 transition-all ${
            selectedPersona === 'priya'
              ? 'border-plum-700 dark:border-plum-300 ring-2 ring-plum-400/20'
              : 'border-rule-light dark:border-rule-dark hover:border-plum-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Salaried · Bengaluru
              </span>
              <h3 className="font-display font-medium text-lg text-ink dark:text-ink-dark mt-1.5">
                Priya, 29
              </h3>
            </div>
            <User className="w-5 h-5 text-plum-900 dark:text-plum-300" />
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-2 line-clamp-2">
            MNC Software Engineer, Net ₹1.10L/mo, CIBIL 780. Has ₹14k car loan, rents at ₹28k.
          </p>
          <div className="mt-4 pt-3 border-t border-rule-light dark:border-rule-dark text-xs flex items-center justify-between font-medium">
            <span className="text-plum-950 dark:text-plum-200">
              Wants: <b>₹8,00,000</b> (Wedding)
            </span>
            <span className="flex items-center gap-1 text-plum-700 dark:text-plum-300 text-[11px]">
              Load <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </LiquidGlass>

        {/* Ravi Card */}
        <LiquidGlass
          variant={selectedPersona === 'ravi' ? 'highlight' : 'card'}
          interactive
          onClick={() => onSelect('ravi')}
          className={`relative p-5 cursor-pointer border-2 transition-all ${
            selectedPersona === 'ravi'
              ? 'border-plum-700 dark:border-plum-300 ring-2 ring-plum-400/20'
              : 'border-rule-light dark:border-rule-dark hover:border-plum-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                Self-Employed · Mysuru
              </span>
              <h3 className="font-display font-medium text-lg text-ink dark:text-ink-dark mt-1.5">
                Ravi, 42
              </h3>
            </div>
            <Briefcase className="w-5 h-5 text-plum-900 dark:text-plum-300" />
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-2 line-clamp-2">
            Kirana store 14 yrs. Cash ₹40k-80k/mo, ITR ₹4.2L/yr. Owns ₹45L shop premises unencumbered. No CIBIL.
          </p>
          <div className="mt-4 pt-3 border-t border-rule-light dark:border-rule-dark text-xs flex items-center justify-between font-medium">
            <span className="text-plum-950 dark:text-plum-200">
              Wants: <b>₹15,00,000</b> (Stock & EV)
            </span>
            <span className="flex items-center gap-1 text-plum-700 dark:text-plum-300 text-[11px]">
              Load <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </LiquidGlass>

        {/* Anita Card */}
        <LiquidGlass
          variant={selectedPersona === 'anita' ? 'highlight' : 'card'}
          interactive
          onClick={() => onSelect('anita')}
          className={`relative p-5 cursor-pointer border-2 transition-all ${
            selectedPersona === 'anita'
              ? 'border-plum-700 dark:border-plum-300 ring-2 ring-plum-400/20'
              : 'border-rule-light dark:border-rule-dark hover:border-plum-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                Informal / Gig · Hubballi
              </span>
              <h3 className="font-display font-medium text-lg text-ink dark:text-ink-dark mt-1.5">
                Anita, 35
              </h3>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-2 line-clamp-2">
            Delivery rider & tailor. ₹26k-30k/mo. 3 app loans (₹35k @ 30%+), 1 EMI bounced last month.
          </p>
          <div className="mt-4 pt-3 border-t border-rule-light dark:border-rule-dark text-xs flex items-center justify-between font-medium">
            <span className="text-plum-950 dark:text-plum-200">
              Wants: <b>₹1,50,000</b> (EV Scooter)
            </span>
            <span className="flex items-center gap-1 text-plum-700 dark:text-plum-300 text-[11px]">
              Load <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </LiquidGlass>
      </div>
    </section>
  );
};
