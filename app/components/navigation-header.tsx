'use client';

import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface NavigationHeaderProps {
  currentStep: 'dashboard' | 'loading' | 'results';
  onBackToDashboard: () => void;
  onNewAnalysis: () => void;
  chainName?: string;
}

export function NavigationHeader({ 
  currentStep, 
  onBackToDashboard, 
  onNewAnalysis, 
  chainName 
}: NavigationHeaderProps) {
  if (currentStep === 'dashboard') {
    return null; // No header needed on dashboard
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBackToDashboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          {currentStep === 'results' && (
            <Button
              onClick={onNewAnalysis}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              New Analysis
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {currentStep === 'loading' && chainName && (
            <span>Analyzing {chainName}</span>
          )}
          {currentStep === 'results' && chainName && (
            <span>{chainName} Analysis Results</span>
          )}
        </div>
      </div>
    </div>
  );
}
