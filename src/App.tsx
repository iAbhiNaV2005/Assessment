'use client';

import { useState, useEffect, useMemo } from 'react';
import { BorrowerProfile } from './domain/types';
import { PERSONA_PRESETS } from './domain/presets';
import { assessBorrowerProfile } from './domain/engine';
import { Header } from './components/Header';
import { PersonaSelector } from './components/PersonaSelector';
import { AdaptiveForm } from './components/AdaptiveForm';
import { OutputsDashboard } from './components/OutputsDashboard';
import { NegotiationCard } from './components/NegotiationCard';
import { RulesInspectorModal } from './components/RulesInspectorModal';
import confetti from 'canvas-confetti';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const [selectedPersona, setSelectedPersona] = useState<'priya' | 'ravi' | 'anita' | 'custom'>('priya');
  const [profile, setProfile] = useState<BorrowerProfile>(PERSONA_PRESETS.priya.profile);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'card'>('dashboard');

  // Handle dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Compute assessment outputs dynamically
  const outputs = useMemo(() => {
    return assessBorrowerProfile(profile);
  }, [profile]);

  // Switch persona handler
  const handleSelectPersona = (key: 'priya' | 'ravi' | 'anita' | 'custom') => {
    setSelectedPersona(key);
    if (key !== 'custom') {
      setProfile(PERSONA_PRESETS[key].profile);
      if (key === 'priya' || key === 'ravi') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handlePrintCard = () => {
    setActiveTab('card');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-bg-light dark:bg-bg-dark text-ink dark:text-ink-dark transition-colors duration-200">
      <Header
        selectedPersona={selectedPersona}
        onSelectPersona={handleSelectPersona}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onPrintCard={handlePrintCard}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Benchmark Profile Selector Cards */}
        <PersonaSelector
          selectedPersona={selectedPersona}
          onSelect={handleSelectPersona}
        />

        {/* View Switcher Tabs for Mobile & Desktop */}
        <div className="flex items-center gap-2 mb-6 border-b border-rule-light dark:border-rule-dark pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 shadow-sm'
                : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark bg-surface-light/50 dark:bg-surface-dark/50'
            }`}
          >
            4 Core Outputs & Verdict
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'form'
                ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 shadow-sm'
                : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark bg-surface-light/50 dark:bg-surface-dark/50'
            }`}
          >
            Adaptive Questionnaire
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'card'
                ? 'bg-plum-900 dark:bg-plum-300 text-white dark:text-plum-950 shadow-sm'
                : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark bg-surface-light/50 dark:bg-surface-dark/50'
            }`}
          >
            Branch Negotiation Card
          </button>
        </div>

        {/* Dynamic Layout Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Questionnaire (Desktop preview / quick edits) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-6">
                <AdaptiveForm
                  profile={profile}
                  onChange={(newProfile) => {
                    setSelectedPersona('custom');
                    setProfile(newProfile);
                  }}
                  confidence={outputs.confidence}
                />
              </div>
            </div>

            {/* Right Column: 4 Outputs Dashboard */}
            <div className="lg:col-span-8 space-y-8">
              <OutputsDashboard
                outputs={outputs}
                onOpenRules={() => setIsRulesModalOpen(true)}
              />
              <NegotiationCard
                outputs={outputs}
                onPrint={handlePrintCard}
              />
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="max-w-3xl mx-auto">
            <AdaptiveForm
              profile={profile}
              onChange={(newProfile) => {
                setSelectedPersona('custom');
                setProfile(newProfile);
              }}
              confidence={outputs.confidence}
            />
          </div>
        )}

        {activeTab === 'card' && (
          <div className="max-w-4xl mx-auto">
            <NegotiationCard
              outputs={outputs}
              onPrint={handlePrintCard}
            />
          </div>
        )}
      </main>

      {/* Rules Engine Drawer / Modal */}
      <RulesInspectorModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        firedRules={outputs.firedRules}
      />

      {/* Footer */}
      <footer className="border-t border-rule-light dark:border-rule-dark py-8 text-center text-xs text-ink-muted dark:text-ink-muted-dark">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-display italic text-sm text-ink dark:text-ink-dark">
            "What we are really testing: can you turn lending judgement into rules a borrower can see and a machine can run?"
          </p>
          <p>
            Lokta Take-Home Assessment · Borrower Copilot · Zero backend, pure client-side financial computation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
