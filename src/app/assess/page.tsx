'use client';

/**
 * Question Wizard Page (/assess)
 * Adaptive step-by-step questionnaire with dynamic confidence narrowing.
 * Uses shared Header, Apple Liquid Glass aesthetic, and dual theme styling. Zero emojis.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBorrower } from '../../context/BorrowerContext';
import { QUESTIONS_LIST } from '../../../lib/engine';
import { Header } from '../../components/Header';
import { QuestionStep } from '../../components/wizard/QuestionStep';
import { ProgressConfidenceBar } from '../../components/wizard/ProgressConfidenceBar';
import { PersonaQuickLoad } from '../../components/dev/PersonaQuickLoad';
import { LiquidGlass } from '../../components/LiquidGlass';

export default function AssessPage() {
  const router = useRouter();
  const { profile, setAnswer, evaluation } = useBorrower();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showDevBar, setShowDevBar] = useState<boolean>(true);

  // Compute currently visible questions dynamically based on answered profile
  const visibleQuestions = useMemo(() => {
    return QUESTIONS_LIST.filter((q) => q.isVisible(profile));
  }, [profile]);

  // Ensure step index stays within bounds if questions dynamically filter
  const clampedStepIndex = Math.min(currentStepIndex, Math.max(0, visibleQuestions.length - 1));
  const currentQuestion = visibleQuestions[clampedStepIndex];

  const handleNext = () => {
    if (clampedStepIndex < visibleQuestions.length - 1) {
      setCurrentStepIndex(clampedStepIndex + 1);
    } else {
      router.push('/result');
    }
  };

  const handlePrev = () => {
    if (clampedStepIndex > 0) {
      setCurrentStepIndex(clampedStepIndex - 1);
    }
  };

  const handleFinish = () => {
    router.push('/result');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between transition-colors duration-300">
      <Header />

      {/* Main Wizard Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Secondary Subnav / Controls */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[var(--accent)]">
              Assessment Wizard
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">|</span>
            <span className="text-xs text-[var(--text-tertiary)] num-mono">
              Step {clampedStepIndex + 1} of {visibleQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDevBar(!showDevBar)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg bg-[var(--glass-subtle)] border border-[var(--border-subtle)] transition-colors"
            >
              {showDevBar ? 'Hide Presets' : 'Show Presets'}
            </button>
            <Link
              href="/result"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--glass-subtle)] hover:bg-[var(--glass-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all"
            >
              Skip to Results
            </Link>
          </div>
        </div>

        {/* Dev Quick Load Toolbar */}
        {showDevBar && (
          <div className="mb-6">
            <PersonaQuickLoad
              onLoaded={() => {
                setCurrentStepIndex(0);
              }}
            />
          </div>
        )}

        {/* Confidence & Progress Bar */}
        {currentQuestion && (
          <div className="mb-8">
            <ProgressConfidenceBar
              currentStepIndex={clampedStepIndex}
              totalStepsCount={visibleQuestions.length}
              mustQuestionsCount={QUESTIONS_LIST.filter((q) => q.isMust).length}
              answeredCount={evaluation.metrics.answeredAdditionalQuestionsCount}
              confidence={{
                confidenceLevel: evaluation.metrics.confidenceLevel,
                answeredCount: evaluation.metrics.answeredAdditionalQuestionsCount,
                applicableCount: evaluation.metrics.applicableAdditionalQuestionsCount,
                ratio: evaluation.metrics.confidenceRatio,
                percentageText: `${Math.round(evaluation.metrics.confidenceRatio * 100)}%`,
                varianceFraction: 0.1,
                guidanceMessage:
                  evaluation.metrics.confidenceLevel === 'narrow'
                    ? 'High precision estimate based on comprehensive borrower profile disclosure.'
                    : evaluation.metrics.confidenceLevel === 'medium'
                    ? 'Moderate precision estimate. Providing collateral and expense specifics will tighten these numbers further.'
                    : 'Based on the minimum information. Answer more questions to narrow this band.',
                unknownAssumptions: [],
              }}
            />
          </div>
        )}

        {/* Active Question Step */}
        {currentQuestion ? (
          <QuestionStep
            question={currentQuestion}
            value={(profile as any)[currentQuestion.field]}
            onChange={(val) => setAnswer(currentQuestion.field as any, val)}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={clampedStepIndex === 0}
            isLast={clampedStepIndex === visibleQuestions.length - 1}
            onFinish={handleFinish}
          />
        ) : (
          <LiquidGlass intensity="medium" className="text-center py-12 rounded-2xl p-8 border border-[var(--glass-border)]">
            <h3 className="text-xl font-display font-medium text-[var(--text-primary)] mb-2">
              All questions completed
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Your financial capacity and underwriting metrics have been fully calculated.
            </p>
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white dark:text-slate-950 font-semibold text-sm shadow-md"
            >
              View Results &amp; Negotiation Card
            </button>
          </LiquidGlass>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-4 text-center text-xs text-[var(--text-tertiary)]">
        <div className="max-w-4xl mx-auto px-4">
          Lokta Copilot · Answers never leave your browser memory · Zero persistent storage
        </div>
      </footer>
    </div>
  );
}
