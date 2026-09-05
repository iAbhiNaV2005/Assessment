import React, { useState } from 'react';
import { FiredRule } from '../domain/types';
import { MASTER_RULES_REGISTRY } from '../domain/rulesData';
import { X, Scale, Filter } from 'lucide-react';

interface RulesInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  firedRules: FiredRule[];
}

export const RulesInspectorModal: React.FC<RulesInspectorModalProps> = ({
  isOpen,
  onClose,
  firedRules,
}) => {
  const [activeTab, setActiveTab] = useState<'fired' | 'all'>(
    firedRules.length > 0 ? 'fired' : 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const allRules = MASTER_RULES_REGISTRY;
  const filteredAllRules = categoryFilter === 'ALL'
    ? allRules
    : allRules.filter(r => r.category === categoryFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-bg-light dark:bg-surface-dark border border-rule-light dark:border-rule-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-rule-light dark:border-rule-dark flex items-center justify-between bg-surface-light/50 dark:bg-surface-dark/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-plum-100 dark:bg-plum-950 text-plum-900 dark:text-plum-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-medium text-xl text-ink dark:text-ink-dark">
                Rules & Assumption Engine
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Every threshold, band, and calculation formula with its underlying regulatory or actuarial reason
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-light dark:hover:bg-plum-950/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Filter Controls */}
        <div className="px-6 py-3 border-b border-rule-light dark:border-rule-dark bg-white/40 dark:bg-surface-dark/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('fired')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'fired'
                  ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 shadow-sm'
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              Rules Fired for Current Profile ({firedRules.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 shadow-sm'
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              Master Rules Registry ({allRules.length})
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-ink-muted" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border border-rule-light dark:border-rule-dark rounded-lg px-2 py-1 text-xs font-medium focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="FOIR">FOIR Limits</option>
                <option value="PRICING">Risk Pricing</option>
                <option value="LTV">LTV Caps</option>
                <option value="ROUTING">Product Routing</option>
                <option value="DISTRESS">Distress & Defaults</option>
                <option value="APR">APR Formula</option>
                <option value="STRESS">Stress Testing</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Body / Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'fired' ? (
            <div className="space-y-3">
              {firedRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-2xl bg-surface-light/60 dark:bg-surface-dark/60 border border-rule-light dark:border-rule-dark space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-plum-900 dark:text-plum-300 bg-plum-100 dark:bg-plum-950 px-2 py-0.5 rounded">
                      {rule.id}
                    </span>
                    <span className="text-[11px] text-ink-muted dark:text-ink-muted-dark italic">
                      Source: {rule.source}
                    </span>
                  </div>
                  <h4 className="font-semibold text-ink dark:text-ink-dark text-sm">
                    {rule.what}
                  </h4>
                  <div className="font-mono font-medium text-plum-900 dark:text-plum-200">
                    Threshold Value: {rule.value}
                  </div>
                  <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed pt-1 border-t border-rule-light/50 dark:border-rule-dark/50">
                    <b>Why:</b> {rule.why}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAllRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-2xl bg-surface-light/60 dark:bg-surface-dark/60 border border-rule-light dark:border-rule-dark space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-plum-900 dark:text-plum-300 bg-plum-100 dark:bg-plum-950 px-2 py-0.5 rounded">
                        {rule.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-light dark:bg-surface-dark text-ink-muted">
                        {rule.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-ink-muted dark:text-ink-muted-dark italic">
                      Source: {rule.source}
                    </span>
                  </div>
                  <h4 className="font-semibold text-ink dark:text-ink-dark text-sm">
                    {rule.what}
                  </h4>
                  <div className="font-mono font-medium text-plum-900 dark:text-plum-200">
                    Threshold Value: {rule.value}
                  </div>
                  <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed pt-1 border-t border-rule-light/50 dark:border-rule-dark/50">
                    <b>Why:</b> {rule.why}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-rule-light dark:border-rule-dark bg-surface-light/50 dark:bg-surface-dark/50 flex items-center justify-between text-xs text-ink-muted">
          <span>All rules documented in detail in <code className="font-mono text-plum-900 dark:text-plum-300">RULES.md</code></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
