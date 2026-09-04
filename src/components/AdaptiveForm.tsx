import React from 'react';
import { BorrowerProfile, EmploymentType, LoanPurpose } from '../domain/types';
import { LiquidGlass } from './LiquidGlass';
import { ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface AdaptiveFormProps {
  profile: BorrowerProfile;
  onChange: (updated: BorrowerProfile) => void;
  confidence: {
    scorePct: number;
    tier: 'LOW' | 'MEDIUM' | 'HIGH';
    summary: string;
    tighteningActions: string[];
  };
}

export const AdaptiveForm: React.FC<AdaptiveFormProps> = ({
  profile,
  onChange,
  confidence,
}) => {
  const updateField = <K extends keyof BorrowerProfile>(key: K, value: BorrowerProfile[K]) => {
    onChange({
      ...profile,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Confidence Indicator Banner */}
      <LiquidGlass className="p-4 border-plum-200 dark:border-plum-900/60 bg-gradient-to-r from-plum-50/50 via-white/50 to-plum-50/20 dark:from-plum-950/40 dark:via-surface-dark/40 dark:to-plum-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${
              confidence.tier === 'HIGH' 
                ? 'bg-emerald-600' 
                : confidence.tier === 'MEDIUM' 
                ? 'bg-plum-800 dark:bg-plum-600' 
                : 'bg-amber-600'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                  Assessment Precision
                </span>
                <span className="num-mono text-xs font-bold px-1.5 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-rule-light dark:border-rule-dark">
                  {confidence.scorePct}%
                </span>
                <span className={`text-xs font-medium ${
                  confidence.tier === 'HIGH' ? 'text-emerald-700 dark:text-emerald-400' : 'text-plum-900 dark:text-plum-300'
                }`}>
                  ({confidence.tier} Confidence)
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
                {confidence.summary}
              </p>
            </div>
          </div>

          {confidence.tighteningActions.length > 0 && (
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium block">
                {confidence.tighteningActions[0]}
              </span>
            </div>
          )}
        </div>
      </LiquidGlass>

      {/* Tier 1: Core Must Questions */}
      <LiquidGlass className="p-6">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-rule-light dark:border-rule-dark">
          <div>
            <h3 className="font-display font-medium text-lg text-ink dark:text-ink-dark">
              Core Financial Baseline
            </h3>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
              Essential signals required to establish basic borrowing viability and FOIR capacity
            </p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-plum-900 dark:text-plum-300 bg-plum-100 dark:bg-plum-950 px-2 py-1 rounded">
            Tier 1 · Must
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Loan Amount Wanted */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Loan Amount Wanted (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-medium text-ink-muted dark:text-ink-muted-dark">₹</span>
              <input
                type="number"
                value={profile.loanAmountWanted || ''}
                onChange={(e) => updateField('loanAmountWanted', Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium num-mono focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
                placeholder="e.g. 800000"
              />
            </div>
          </div>

          {/* Loan Purpose */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Loan Purpose
            </label>
            <select
              value={profile.loanPurpose}
              onChange={(e) => updateField('loanPurpose', e.target.value as LoanPurpose)}
              className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
            >
              <option value="wedding">Wedding / Family Celebration (Consumption)</option>
              <option value="business_expansion">Business Stock & Capital Expansion</option>
              <option value="vehicle_asset">Commercial Vehicle / EV Asset</option>
              <option value="home_renovation">Home Renovation / Improvement</option>
              <option value="debt_consolidation">Consolidating Existing High-Cost Debt</option>
              <option value="medical_emergency">Medical Emergency</option>
              <option value="consumption_other">Other Discretionary Need</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Income / Employment Type
            </label>
            <select
              value={profile.employmentType}
              onChange={(e) => updateField('employmentType', e.target.value as EmploymentType)}
              className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
            >
              <option value="salaried">Salaried (MNC, Corporate, or Regular Pay)</option>
              <option value="self_employed">Self-Employed (Kirana, Trader, Business)</option>
              <option value="informal">Informal / Gig Worker (Delivery, Tailor, Daily Cash)</option>
            </select>
          </div>

          {/* Monthly Net Take-Home */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Net Monthly Take-Home Cash (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-medium text-ink-muted dark:text-ink-muted-dark">₹</span>
              <input
                type="number"
                value={profile.monthlyIncome || ''}
                onChange={(e) => updateField('monthlyIncome', Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium num-mono focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
                placeholder="e.g. 110000"
              />
            </div>
          </div>

          {/* Existing Monthly EMIs */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Existing Monthly EMIs (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-medium text-ink-muted dark:text-ink-muted-dark">₹</span>
              <input
                type="number"
                value={profile.existingEmis}
                onChange={(e) => updateField('existingEmis', Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium num-mono focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
                placeholder="e.g. 14000"
              />
            </div>
          </div>

          {/* Monthly Rent */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Monthly Rent / Housing Outflow (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-medium text-ink-muted dark:text-ink-muted-dark">₹</span>
              <input
                type="number"
                value={profile.rent}
                onChange={(e) => updateField('rent', Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium num-mono focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
                placeholder="0 if owned property"
              />
            </div>
          </div>

          {/* Living Expenses */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Monthly Household Living Costs (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-medium text-ink-muted dark:text-ink-muted-dark">₹</span>
              <input
                type="number"
                value={profile.householdExpenses || ''}
                onChange={(e) => updateField('householdExpenses', Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-sm font-medium num-mono focus:outline-none focus:border-plum-800 dark:focus:border-plum-400"
                placeholder="Groceries, utilities, children fees"
              />
            </div>
          </div>

          {/* Credit Score Known */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Credit Score Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  updateField('creditScoreKnown', true);
                  if (!profile.creditScore) updateField('creditScore', 750);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                  profile.creditScoreKnown
                    ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 border-plum-900 dark:border-plum-300 shadow-sm'
                    : 'bg-white/70 dark:bg-surface-dark/80 border-rule-light dark:border-rule-dark text-ink-muted'
                }`}
              >
                I Know My Score
              </button>
              <button
                type="button"
                onClick={() => {
                  updateField('creditScoreKnown', false);
                  updateField('creditScore', undefined);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                  !profile.creditScoreKnown
                    ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 border-plum-900 dark:border-plum-300 shadow-sm'
                    : 'bg-white/70 dark:bg-surface-dark/80 border-rule-light dark:border-rule-dark text-ink-muted'
                }`}
              >
                Score Unknown / NTC
              </button>
            </div>

            {profile.creditScoreKnown && (
              <div className="mt-2.5">
                <input
                  type="number"
                  min="300"
                  max="900"
                  value={profile.creditScore || ''}
                  onChange={(e) => updateField('creditScore', Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs font-medium num-mono focus:outline-none focus:border-plum-800"
                  placeholder="Enter CIBIL score (e.g. 780)"
                />
              </div>
            )}
          </div>
        </div>
      </LiquidGlass>

      {/* Tier 2: Adaptive Questions */}
      <LiquidGlass className="p-6">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-rule-light dark:border-rule-dark">
          <div>
            <h3 className="font-display font-medium text-lg text-ink dark:text-ink-dark">
              Adaptive Refinements (Rate & Capacity Tighteners)
            </h3>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
              Specific contextual questions that actively tighten your interest band or unlock higher-value products
            </p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded">
            Tier 2 · Adaptive
          </span>
        </div>

        <div className="space-y-4">
          {/* Conditional for Self-Employed (Ravi profile) */}
          {profile.employmentType === 'self_employed' && (
            <div className="p-4 rounded-xl bg-surface-light/60 dark:bg-surface-dark/60 border border-rule-light dark:border-rule-dark space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-plum-900 dark:text-plum-300">
                <ShieldAlert className="w-4 h-4" />
                <span>Self-Employed Underwriting Accelerators</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink dark:text-ink-dark mb-1">
                    Annual ITR Declared Net Profit (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.itrAnnualIncome || ''}
                    onChange={(e) => updateField('itrAnnualIncome', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs num-mono focus:outline-none focus:border-plum-800"
                    placeholder="e.g. 420000"
                  />
                  <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-0.5 block">
                    Tax documented income determines formal unsecured eligibility.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink dark:text-ink-dark mb-1">
                    Unencumbered Property / Shop Valuation (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.unencumberedPropertyVal || ''}
                    onChange={(e) => updateField('unencumberedPropertyVal', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs num-mono focus:outline-none focus:border-plum-800"
                    placeholder="e.g. 4500000"
                  />
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                    Unlocks Loan Against Property (LAP) at 9.25% - 11.0%.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink dark:text-ink-dark mb-1">
                    Co-Applicant Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.coApplicantIncome || ''}
                    onChange={(e) => updateField('coApplicantIncome', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs num-mono focus:outline-none focus:border-plum-800"
                    placeholder="e.g. 18000 (Spouse)"
                  />
                  <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-0.5 block">
                    Adding co-borrower income expands FOIR eligibility buffer.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Conditional for Debt Distress or Informal (Anita profile) */}
          {(profile.employmentType === 'informal' || (profile.existingEmis > 0 && profile.monthlyIncome < 40000)) && (
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300">
                <HelpCircle className="w-4 h-4" />
                <span>Debt Stress & Cash Inflow Indicators</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink dark:text-ink-dark mb-1">
                    Outstanding High-Cost App Debt (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.highCostAppDebtOutstanding || 0}
                    onChange={(e) => updateField('highCostAppDebtOutstanding', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs num-mono focus:outline-none focus:border-plum-800"
                    placeholder="Instant app loans at 30%+"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink dark:text-ink-dark mb-1">
                    Past 12-Month EMI Bounces
                  </label>
                  <select
                    value={profile.pastYearBounces || 0}
                    onChange={(e) => updateField('pastYearBounces', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs font-medium focus:outline-none focus:border-plum-800"
                  >
                    <option value={0}>0 Bounces (Clean Repayment)</option>
                    <option value={1}>1 Bounce (Late payment)</option>
                    <option value={2}>2+ Bounces (High Delinquency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink dark:text-ink-dark mb-1">
                    Expected Monthly Earnings Boost (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.expectedMonthlyEarningsBoost || 0}
                    onChange={(e) => updateField('expectedMonthlyEarningsBoost', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs num-mono focus:outline-none focus:border-plum-800"
                    placeholder="e.g. 12000 from EV scooter"
                  />
                  <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-0.5 block">
                    Productive loans that generate future revenue.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Savings Buffer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">
                Emergency Savings Reserve
              </label>
              <select
                value={profile.emergencySavingsMonths || 2}
                onChange={(e) => updateField('emergencySavingsMonths', Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs font-medium focus:outline-none focus:border-plum-800"
              >
                <option value={0}>Under 1 month of living expenses</option>
                <option value={2}>1 to 3 months of expenses</option>
                <option value={4}>3 to 6 months of expenses</option>
                <option value={6}>6+ months (High resilience)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">
                Borrower Age & City
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs num-mono focus:outline-none"
                  placeholder="Age"
                />
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/70 dark:bg-surface-dark/80 border border-rule-light dark:border-rule-dark rounded-xl text-xs focus:outline-none"
                  placeholder="City (e.g. Bengaluru, Mysuru)"
                />
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
};
