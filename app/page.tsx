'use client';

import { useState } from 'react';
import { MinimalHero } from '@/app/components/minimal-hero';
import { MinimalAssessmentForm } from '@/app/components/minimal-assessment-form';
import { SalesResults } from '@/app/components/sales-results';
import { AssessmentForm } from '@/app/components/assessment-form';
import { ResultsDisplay } from '@/app/components/results-display';
import { CommandPalette } from '@/app/components/command-palette';
import { NavigationHeader } from '@/app/components/navigation-header';
import { RuleBasedAssessment } from '@/app/lib/rule-based-assessment';
import { AssessmentFormData, AssessmentResult } from '@/app/types/assessment';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

type AppStep = 'sales-input' | 'sales-results' | 'tech-form' | 'tech-results';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('sales-input');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChainName, setCurrentChainName] = useState('');
  
  // Sales assessment state
  const [salesAssessment, setSalesAssessment] = useState<RuleBasedAssessment | null>(null);
  const [chainData, setChainData] = useState<any>(null);
  
  // Technical assessment state
  const [techAssessment, setTechAssessment] = useState<AssessmentResult | null>(null);
  const [techMetadata, setTechMetadata] = useState<any>(null);

  /**
   * STEP 1: Quick Sales Assessment
   * Uses deterministic rule-based system
   */
  const handleSalesAssessment = async (chainName: string) => {
    setIsLoading(true);
    setCurrentChainName(chainName);
    
    try {
      const response = await fetch('/api/sales-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chainName }),
      });

      if (!response.ok) {
        throw new Error('Assessment failed');
      }

      const result = await response.json();
      setSalesAssessment(result);
      setChainData(result.chainData);
      setCurrentStep('sales-results');
      toast.success('Sales assessment complete!', { duration: 2000 });
    } catch (error) {
      console.error('Sales assessment error:', error);
      toast.error('Assessment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * STEP 2: Navigate to detailed technical form
   */
  const handleGoToTechnicalForm = () => {
    setCurrentStep('tech-form');
  };

  /**
   * STEP 3: Detailed Technical Assessment
   * Uses AI + comprehensive form data
   */
  const handleTechnicalAssessment = async (formData: AssessmentFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Technical assessment failed');
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullResponse += data.content;
              }
            } catch (e) {
              // Ignore parsing errors for streaming
            }
          }
        }
      }

      // Parse the final JSON result
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid assessment returned');
      }

      const assessment = JSON.parse(jsonMatch[0]);
      setTechAssessment(assessment);
      setTechMetadata({
        rpcUrl: formData.rpcUrl,
        ticker: formData.ticker,
        iconUrl: formData.iconUrl,
        chainId: formData.chainId,
        explorerUrl: formData.explorerUrl,
        githubRepo: formData.githubRepo,
      });
      setCurrentStep('tech-results');
      toast.success('Technical assessment complete!', { duration: 2000 });
    } catch (error) {
      console.error('Technical assessment error:', error);
      toast.error('Technical assessment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAssessment = () => {
    setCurrentStep('sales-input');
    setSalesAssessment(null);
    setChainData(null);
    setTechAssessment(null);
    setTechMetadata(null);
    setCurrentChainName('');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('sales-input');
  };

  const handleChainSelect = (chainName: string) => {
    handleSalesAssessment(chainName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <NavigationHeader
        currentStep={currentStep === 'sales-input' ? 'dashboard' : 
                    currentStep === 'sales-results' || currentStep === 'tech-results' ? 'results' : 'loading'}
        onBackToDashboard={handleBackToDashboard}
        onNewAnalysis={handleNewAssessment}
        chainName={currentChainName}
      />

      {/* Command Palette */}
      <CommandPalette
        onChainSelect={handleChainSelect}
        onNewAssessment={handleNewAssessment}
        onSearchHistory={() => console.log('Search history')}
        onExportReport={() => console.log('Export report')}
      />

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />

      <div className="px-4 py-8">
        {/* STEP 1: Sales Input */}
        {currentStep === 'sales-input' && (
          <div className="max-w-4xl mx-auto">
            <MinimalHero />
            <MinimalAssessmentForm
              onAnalyze={handleSalesAssessment}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* STEP 2: Sales Results */}
        {currentStep === 'sales-results' && salesAssessment && chainData && (
          <SalesResults
            assessment={salesAssessment}
            chainData={chainData}
            onNewAssessment={handleNewAssessment}
            onDetailedAssessment={handleGoToTechnicalForm}
          />
        )}

        {/* STEP 3: Technical Form */}
        {currentStep === 'tech-form' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Detailed Technical Assessment
              </h2>
              <p className="text-gray-600 mb-6">
                Upload the technical questionnaire from the foundation team for a comprehensive 
                engineering analysis.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <AssessmentForm
                onSubmit={handleTechnicalAssessment}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Technical Results */}
        {currentStep === 'tech-results' && techAssessment && (
          <div className="max-w-4xl mx-auto">
            <ResultsDisplay
              result={techAssessment}
              chainName={currentChainName}
              chainMetadata={techMetadata}
              onNewAssessment={handleNewAssessment}
            />
          </div>
        )}
      </div>
    </div>
  );
}
