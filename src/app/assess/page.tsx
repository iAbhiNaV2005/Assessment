'use client';

/**
 * Question Wizard Page (/assess)
 * Adaptive step-by-step questionnaire with dynamic confidence narrowing.
 * Follows Section 2.2 and Section 4 of the implementation plan.
 * Free of emojis.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBorrower } from '../../context/BorrowerContext';
import { QUESTIONS_LIST } from '../../../lib/engine';
import { QuestionStep } from '../../components/wizard/QuestionStep';
import { ProgressConfidenceBar } from '../../components/wizard/ProgressConfidenceBar';
import { PersonaQuickLoad } from '../../components/dev/PersonaQuickLoad';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              L
            </span>
            <span className="font-bold text-base tracking-tight text-white">
              Lokta <span className="text-slate-400 font-normal">Assessment</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDevBar(!showDevBar)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
            >
              {showDevBar ? 'Hide Dev Presets' : 'Show Dev Presets'}
            </button>
            <Link
              href="/result"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Skip to Results
            </Link>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Dev Quick Load Toolbar */}
        {showDevBar && (
          <PersonaQuickLoad
            onLoaded={() => {
              setCurrentStepIndex(0);
            }}
          />
        )}

        {/* Confidence & Progress Bar */}
        {currentQuestion && (
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
          <div className="text-center py-12">
            <p className="text-slate-400">All questions completed.</p>
            <button
              type="button"
              onClick={handleFinish}
              className="mt-4 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold"
            >
              View Results
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4">
          Lokta Copilot · Answers never leave your browser tab · Cleared on tab close
        </div>
      </footer>
    </div>
  );
}
