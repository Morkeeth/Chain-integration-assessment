'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MinimalHero } from '@/app/components/minimal-hero';
import { MinimalAssessmentForm } from '@/app/components/minimal-assessment-form';
import { AnalysisLoading } from '@/app/components/analysis-loading';
import { CodeResults } from '@/app/components/code-results';
import { CommandPalette } from '@/app/components/command-palette';
import { NavigationHeader } from '@/app/components/navigation-header';
import { AnalysisHistoryService } from '@/app/lib/analysis-history';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'dashboard' | 'loading' | 'results'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChainName, setCurrentChainName] = useState('');
  const [loadingStep, setLoadingStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async (chainName: string) => {
    setIsLoading(true);
    setCurrentChainName(chainName);
    setCurrentStep('loading');
    setLoadingStep(1);
    
    // Check cache first
    const cached = AnalysisHistoryService.getCachedAnalysis(chainName);
    if (cached) {
      toast.success('Loaded from cache (24h)', { duration: 2000 });
      setAnalysisResult(cached.fullAnalysis);
      setCurrentStep('results');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/real-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainName }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullResult = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'step') {
                setLoadingStep(data.step);
              } else if (data.type === 'content') {
                // Content streaming - could be used for real-time updates
              } else if (data.type === 'result') {
                fullResult = data;
                setAnalysisResult(data);
                setCurrentStep('results');
                // Save to history
                AnalysisHistoryService.saveAnalysis(chainName, data);
                toast.success('Analysis saved to history', { duration: 2000 });
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (e) {
              // Ignore parsing errors for streaming
            }
          }
        }
      }

      if (!fullResult) {
        throw new Error('No analysis result received');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
      setCurrentStep('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentStep('dashboard');
    setAnalysisResult(null);
    setCurrentChainName('');
    setLoadingStep(1);
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleChainSelect = (chainName: string) => {
    handleAnalyze(chainName);
  };

  const handleNewAssessment = () => {
    setCurrentStep('dashboard');
  };

  const handleSearchHistory = () => {
    // TODO: Implement history search
    console.log('Search history');
  };

  const handleExportReport = () => {
    // TODO: Implement export
    console.log('Export report');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <NavigationHeader
        currentStep={currentStep}
        onBackToDashboard={handleBackToDashboard}
        onNewAnalysis={handleNewAnalysis}
        chainName={currentChainName}
      />

      {/* Command Palette */}
      <CommandPalette
        onChainSelect={handleChainSelect}
        onNewAssessment={handleNewAssessment}
        onSearchHistory={handleSearchHistory}
        onExportReport={handleExportReport}
      />

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />

      {currentStep === 'dashboard' && (
        <div className="px-4 py-16 max-w-4xl mx-auto">
          {/* Minimal hero section */}
          <MinimalHero />

          {/* Minimal assessment form */}
          <MinimalAssessmentForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>
      )}

      {currentStep === 'loading' && (
        <AnalysisLoading
          chainName={currentChainName}
          currentStep={loadingStep}
        />
      )}

      {currentStep === 'results' && analysisResult && (
        <CodeResults
          result={analysisResult}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </div>
  );
}
