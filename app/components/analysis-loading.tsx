'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, Brain, Code, CheckCircle } from 'lucide-react';

interface AnalysisLoadingProps {
  chainName: string;
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: 'Querying Documentation',
    description: 'Searching official docs and technical specifications',
    icon: Search,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  {
    id: 2,
    title: 'Activating Web Search',
    description: 'Gathering real-time blockchain data and recent updates',
    icon: Globe,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  {
    id: 3,
    title: 'Finalizing Complexity',
    description: 'AI analysis of integration complexity and requirements',
    icon: Brain,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  {
    id: 4,
    title: 'Generating Code',
    description: 'Creating Ledger integration code and metadata',
    icon: Code,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
];

export function AnalysisLoading({ chainName, currentStep }: AnalysisLoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-6 w-6 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">
            Analyzing {chainName}
          </h1>
          <p className="text-gray-600">
            AI analysis in progress{dots}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`relative flex items-center p-4 rounded-lg border transition-all duration-500 ${
                  isActive
                    ? 'bg-gray-50 border-gray-300'
                    : isCompleted
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Step Number */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 transition-all duration-500 ${
                    isActive
                      ? 'bg-black text-white animate-pulse'
                      : isCompleted
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="font-bold text-sm">{step.id}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? step.color : isCompleted ? 'text-ledger-green' : 'text-ledger-gray-400'
                      }`}
                    />
                    <h3
                      className={`text-base font-medium ${
                        isActive ? 'text-black' : isCompleted ? 'text-black' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      isActive ? 'text-gray-600' : isCompleted ? 'text-gray-600' : 'text-gray-500'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Loading Animation */}
                {isActive && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
