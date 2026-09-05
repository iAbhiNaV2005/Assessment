'use client';

/**
 * Borrower Copilot - Borrower Context & State Management
 * Implements React Context + useReducer with sessionStorage synchronization.
 * Follows Section 2.3 of the implementation plan.
 * Pure derivation: O1 to O4 are computed on every render, never stored in state.
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import {
  BorrowerProfile,
  FullEvaluationResult,
  evaluateBorrowerProfile,
  CANONICAL_PERSONAS,
} from '../../lib/engine';

const SESSION_STORAGE_KEY = 'lokta_borrower_copilot_answers_v1';

export const DEFAULT_PROFILE: Partial<BorrowerProfile> = {
  purpose: 'wedding_discretionary',
  amountWanted: 500000,
  employmentType: 'salaried',
  netMonthlyIncome: 65000,
  yearsInJobOrBusiness: 4,
  existingEmiTotal: 10000,
  essentialExpenses: 25000,
  age: 29,
  creditScore: 720,
  hasBounceInLast12Months: false,
  savingsBufferMonths: 3,
  collateralType: 'none',
  answeredQuestionIds: [
    'q1_purpose',
    'q2_amount_wanted',
    'q3_employment_type',
    'q4_income',
    'q5_years_experience',
    'q6_existing_emis',
    'q7_essential_expenses',
    'q8_age',
    'q9_credit_score',
  ],
};

type Action =
  | { type: 'SET_ANSWER'; field: keyof BorrowerProfile; value: any }
  | { type: 'LOAD_PERSONA'; personaKey: 'priya' | 'ravi' | 'anita'; profile: Partial<BorrowerProfile> }
  | { type: 'RESET_ANSWERS' }
  | { type: 'SET_QUOTE_OVERRIDE'; quote?: number };

interface State {
  profile: Partial<BorrowerProfile>;
  quoteOverride?: number;
  activePersona?: 'priya' | 'ravi' | 'anita';
}

function borrowerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ANSWER': {
      const updatedAnswers = {
        ...state.profile,
        [action.field]: action.value,
      };

      // Track answered question id if not present
      const answeredIds = new Set(updatedAnswers.answeredQuestionIds || []);
      // Match question id pattern
      answeredIds.add(action.field);
      updatedAnswers.answeredQuestionIds = Array.from(answeredIds);

      return {
        ...state,
        profile: updatedAnswers,
        activePersona: undefined, // Clears persona label if user modified
      };
    }

    case 'LOAD_PERSONA': {
      return {
        ...state,
        profile: { ...action.profile },
        activePersona: action.personaKey,
        quoteOverride: undefined,
      };
    }

    case 'RESET_ANSWERS': {
      return {
        profile: { ...DEFAULT_PROFILE },
        activePersona: undefined,
        quoteOverride: undefined,
      };
    }

    case 'SET_QUOTE_OVERRIDE': {
      return {
        ...state,
        quoteOverride: action.quote,
      };
    }

    default:
      return state;
  }
}

interface BorrowerContextType {
  profile: Partial<BorrowerProfile>;
  evaluation: FullEvaluationResult;
  activePersona?: 'priya' | 'ravi' | 'anita';
  quoteOverride?: number;
  setAnswer: (field: keyof BorrowerProfile, value: any) => void;
  loadPersona: (personaKey: 'priya' | 'ravi' | 'anita') => void;
  resetAnswers: () => void;
  setQuoteOverride: (quote?: number) => void;
}

const BorrowerContext = createContext<BorrowerContextType | undefined>(undefined);

export function BorrowerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(borrowerReducer, {
    profile: DEFAULT_PROFILE,
  });

  // Restore from sessionStorage on initial client mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Pre-populate state
          for (const key of Object.keys(parsed)) {
            dispatch({ type: 'SET_ANSWER', field: key as keyof BorrowerProfile, value: parsed[key] });
          }
        }
      }
    } catch {
      // Ignore sessionStorage issues in restricted private browsing
    }
  }, []);

  // Sync to sessionStorage on state change
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.profile));
    } catch {
      // Ignore
    }
  }, [state.profile]);

  // Derive all 4 outputs dynamically on every render
  const evaluation = useMemo(() => {
    return evaluateBorrowerProfile(state.profile, state.quoteOverride);
  }, [state.profile, state.quoteOverride]);

  const setAnswer = (field: keyof BorrowerProfile, value: any) => {
    dispatch({ type: 'SET_ANSWER', field, value });
  };

  const loadPersona = (personaKey: 'priya' | 'ravi' | 'anita') => {
    const personaProfile = CANONICAL_PERSONAS[personaKey];
    if (personaProfile) {
      dispatch({ type: 'LOAD_PERSONA', personaKey, profile: personaProfile });
    }
  };

  const resetAnswers = () => {
    dispatch({ type: 'RESET_ANSWERS' });
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const setQuoteOverride = (quote?: number) => {
    dispatch({ type: 'SET_QUOTE_OVERRIDE', quote });
  };

  return (
    <BorrowerContext.Provider
      value={{
        profile: state.profile,
        evaluation,
        activePersona: state.activePersona,
        quoteOverride: state.quoteOverride,
        setAnswer,
        loadPersona,
        resetAnswers,
        setQuoteOverride,
      }}
    >
      {children}
    </BorrowerContext.Provider>
  );
}

export function useBorrower() {
  const context = useContext(BorrowerContext);
  if (!context) {
    throw new Error('useBorrower must be used within a BorrowerProvider');
  }
  return context;
}
