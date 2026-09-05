'use client';

/**
 * Question Step Component
 * Renders individual questions with adaptive controls, rationale badges, and navigation.
 * Free of emojis.
 */

import React from 'react';
import { QuestionDefinition } from '../../../lib/engine';

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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              <p className="text-xs text-slate-400 mt-1">
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
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  {opt.hint && <p className="text-xs text-slate-400 mt-1">{opt.hint}</p>}
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
                  ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm font-medium">Yes</span>
            </button>
            <button
              type="button"
              onClick={() => onChange(false)}
              className={`p-4 rounded-xl border text-center transition-all ${
                currentValue === false
                  ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
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
            <div className="relative rounded-lg shadow-sm">
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
              />
              {question.suffix && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-xs text-slate-500 uppercase font-mono">{question.suffix}</span>
                </div>
              )}
            </div>
            {typeof currentValue === 'number' && currentValue > 0 && question.field.includes('Income') && (
              <p className="text-xs text-slate-400 font-mono">
                Assessed at ₹{currentValue.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {question.isMust ? (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Core Baseline Question
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Adaptive Calibration Field
            </span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-1.5">
          {question.title}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">{question.subtitle}</p>
      </div>

      {/* Input Field */}
      <div className="mb-8">{renderInput()}</div>

      {/* Underwriting Reasoning Badges */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/60 mb-8 space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-slate-500 font-semibold shrink-0">Why asked:</span>
          <span className="text-slate-300">{question.whyAsked}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-slate-500 font-semibold shrink-0">Feeds output:</span>
          <span className="text-blue-400 font-mono">{question.whatItMoves}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
            isFirst
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onFinish}
            className="px-6 py-2.5 text-sm rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            Calculate Verdict and Outputs
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2 text-sm rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};
