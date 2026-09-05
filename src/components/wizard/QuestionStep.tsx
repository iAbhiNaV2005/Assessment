'use client';

/**
 * Question Step Component
 * Editorial presentation with tactile inputs, underwriting rationale, and navigation.
 * Built with Apple Liquid Glass aesthetics and zero emojis.
 */

import React from 'react';
import { QuestionDefinition } from '../../../lib/engine';
import { LiquidGlass } from '../LiquidGlass';

interface QuestionStepProps {
  question: QuestionDefinition;
  value: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onFinish: () => void;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onFinish,
}) => {
  const currentValue = value !== undefined ? value : '';

  const renderInput = () => {
    switch (question.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <select
              value={currentValue}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-white dark:bg-surface-dark/90 border border-rule-light dark:border-rule-dark rounded-xl px-4 py-3.5 text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-plum-500/40 text-sm font-medium shadow-sm transition-all"
            >
              <option value="" disabled>
                Select an option
              </option>
              {question.options?.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {question.options?.find((o) => o.value === currentValue)?.hint && (
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
                {question.options.find((o) => o.value === currentValue)?.hint}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2.5">
            {question.options?.map((opt) => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-plum-50/90 dark:bg-plum-950/60 border-plum-900/60 dark:border-plum-400/60 shadow-sm ring-1 ring-plum-900/30 dark:ring-plum-400/30'
                      : 'bg-white/50 dark:bg-surface-dark/50 border-rule-light dark:border-rule-dark text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark hover:border-plum-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink dark:text-ink-dark">
                      {opt.label}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-plum-900 bg-plum-900 dark:border-plum-400 dark:bg-plum-400'
                          : 'border-rule-light dark:border-rule-dark'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-plum-950" />
                      )}
                    </span>
                  </div>
                  {opt.hint && (
                    <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
                      {opt.hint}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        );

      case 'boolean':
        return (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange(true)}
              className={`p-4 rounded-xl border text-center transition-all ${
                currentValue === true
                  ? 'bg-plum-50/90 dark:bg-plum-950/60 border-plum-900/60 dark:border-plum-400/60 text-ink dark:text-ink-dark shadow-sm ring-1 ring-plum-900/30'
                  : 'bg-white/50 dark:bg-surface-dark/50 border-rule-light dark:border-rule-dark text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark'
              }`}
            >
              <span className="text-sm font-medium">Yes</span>
            </button>
            <button
              type="button"
              onClick={() => onChange(false)}
              className={`p-4 rounded-xl border text-center transition-all ${
                currentValue === false
                  ? 'bg-plum-50/90 dark:bg-plum-950/60 border-plum-900/60 dark:border-plum-400/60 text-ink dark:text-ink-dark shadow-sm ring-1 ring-plum-900/30'
                  : 'bg-white/50 dark:bg-surface-dark/50 border-rule-light dark:border-rule-dark text-ink dark:text-ink-dark hover:bg-white dark:hover:bg-surface-dark'
              }`}
            >
              <span className="text-sm font-medium">No</span>
            </button>
          </div>
        );

      case 'number':
      default:
        return (
          <div className="space-y-2">
            <div className="relative rounded-xl shadow-sm">
              <input
                type="number"
                min={question.min}
                max={question.max}
                step={question.step || 1}
                value={currentValue}
                placeholder={question.placeholder}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onChange(val);
                }}
                className="w-full bg-white dark:bg-surface-dark/90 border border-rule-light dark:border-rule-dark rounded-xl px-4 py-3.5 text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-plum-500/40 text-base font-mono num-mono shadow-sm transition-all"
              />
              {question.suffix && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-mono uppercase">
                    {question.suffix}
                  </span>
                </div>
              )}
            </div>
            {typeof currentValue === 'number' && currentValue > 0 && question.field.includes('Income') && (
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-mono">
                Assessed input: ₹{currentValue.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <LiquidGlass variant="card" className="w-full">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {question.isMust ? (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-plum-500/10 text-plum-900 dark:text-plum-300 border border-plum-500/20">
              Core Baseline Field
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-surface-light dark:bg-surface-dark text-ink-muted dark:text-ink-muted-dark border border-rule-light dark:border-rule-dark">
              Adaptive Field
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-medium text-ink dark:text-ink-dark tracking-tight mb-2">
          {question.title}
        </h2>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          {question.subtitle}
        </p>
      </div>

      {/* Input Field */}
      <div className="mb-8">{renderInput()}</div>

      {/* Underwriting Reasoning Box */}
      <div className="bg-surface-light/60 dark:bg-surface-dark/60 rounded-xl p-4 border border-rule-light/80 dark:border-rule-dark/80 mb-8 space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-ink-muted dark:text-ink-muted-dark font-semibold shrink-0">Why asked:</span>
          <span className="text-ink dark:text-ink-dark">{question.whyAsked}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-ink-muted dark:text-ink-muted-dark font-semibold shrink-0">Feeds:</span>
          <span className="text-plum-900 dark:text-plum-300 font-mono">{question.whatItMoves}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-rule-light/80 dark:border-rule-dark/80">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${
            isFirst
              ? 'text-ink-muted/40 dark:text-ink-muted-dark/40 cursor-not-allowed'
              : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-surface-light dark:hover:bg-surface-dark'
          }`}
        >
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onFinish}
            className="px-6 py-2.5 text-sm rounded-xl font-semibold bg-plum-900 hover:bg-plum-800 text-white dark:bg-plum-400 dark:hover:bg-plum-300 dark:text-plum-950 transition-all shadow-sm active:scale-[0.98]"
          >
            Calculate Verdict and Outputs
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 text-sm rounded-xl font-semibold bg-plum-900 hover:bg-plum-800 text-white dark:bg-plum-400 dark:hover:bg-plum-300 dark:text-plum-950 transition-all shadow-sm active:scale-[0.98]"
          >
            Next Question
          </button>
        )}
      </div>
    </LiquidGlass>
  );
};
