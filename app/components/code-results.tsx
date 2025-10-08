'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  Globe, 
  GitBranch, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Zap,
  ExternalLink,
  Github,
  ArrowLeft
} from 'lucide-react';

interface CodeResultsProps {
  result: any;
  onNewAnalysis: () => void;
}

export function CodeResults({ result, onNewAnalysis }: CodeResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedFiles, setCopiedFiles] = useState<Set<string>>(new Set());

  const copyToClipboard = async (content: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFiles(prev => new Set([...prev, fileName]));
      setTimeout(() => {
        setCopiedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileName);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'currency', label: 'Currency Config', icon: Code },
    { id: 'implementation', label: 'Implementation', icon: Terminal },
    { id: 'tests', label: 'Tests', icon: CheckCircle },
    { id: 'readme', label: 'README', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onNewAnalysis}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              New Analysis
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  {result.discoveredMetadata?.name || 'Chain'} Integration
                </h1>
                <p className="text-sm text-gray-600">Analysis Results</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getComplexityColor(result.analysis?.complexity || 'MEDIUM')}`}>
              {result.analysis?.complexity || 'MEDIUM'} COMPLEXITY
            </span>
            <span className="text-sm text-gray-600">
              {result.analysis?.estimatedTimeframe || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Analysis Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Analysis Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Complexity:</span>
                  <span className="font-medium">{result.analysis?.complexity || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{result.analysis?.estimatedTimeframe || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{result.analysis?.confidence || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chain Type:</span>
                  <span className="font-medium">{result.discoveredMetadata?.chainType || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Chain Metadata */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Chain Metadata
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 block">Ticker:</span>
                  <span className="font-mono text-black">{result.discoveredMetadata?.ticker || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Chain ID:</span>
                  <span className="font-mono text-black">{result.discoveredMetadata?.chainId || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">RPC URL:</span>
                  <a 
                    href={result.discoveredMetadata?.rpcUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 hover:underline text-xs break-all"
                  >
                    {result.discoveredMetadata?.rpcUrl || 'Not available'}
                  </a>
                </div>
                <div>
                  <span className="text-gray-600 block">Explorer:</span>
                  <a 
                    href={result.discoveredMetadata?.explorerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 hover:underline text-xs break-all flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {result.discoveredMetadata?.explorerUrl || 'Not available'}
                  </a>
                </div>
                {result.discoveredMetadata?.githubRepo && (
                  <div>
                    <span className="text-gray-600 block">GitHub:</span>
                    <a 
                      href={result.discoveredMetadata.githubRepo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 hover:underline text-xs break-all flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" />
                      {result.discoveredMetadata.githubRepo}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Action Items
              </h3>
              <ul className="space-y-2 text-sm">
                {result.analysis?.actionChecklist?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                )) || []}
              </ul>
            </div>

            {/* Red Flags */}
            {result.analysis?.redFlags?.length > 0 && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Red Flags
                </h3>
                <ul className="space-y-2 text-sm">
                  {result.analysis.redFlags.map((flag: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">⚠</span>
                      <span className="text-red-700">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 px-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-600 hover:text-black'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="max-w-4xl">
                  <h2 className="text-2xl font-bold text-black mb-6">Technical Analysis</h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-black mb-3">Technical Reasoning</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {result.analysis?.technicalReasoning || 'No technical reasoning available.'}
                    </p>
                  </div>
                  
                  {result.analysis?.recommendations?.length > 0 && (
                    <div className="mt-6 bg-green-50 rounded-xl border border-green-200 p-6">
                      <h3 className="font-semibold text-green-800 mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {result.analysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span className="text-green-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'currency' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Currency Configuration</h2>
                  <Button
                    onClick={() => copyToClipboard(result.generatedCode?.currencyConfig || '', 'currency.ts')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copiedFiles.has('currency.ts') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedFiles.has('currency.ts') ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="bg-black rounded-xl p-6 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    <code>{result.generatedCode?.currencyConfig || 'No code available'}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'implementation' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Coin Implementation</h2>
                  <Button
                    onClick={() => copyToClipboard(result.generatedCode?.coinImplementation || '', 'coin.ts')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copiedFiles.has('coin.ts') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedFiles.has('coin.ts') ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="bg-black rounded-xl p-6 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    <code>{result.generatedCode?.coinImplementation || 'No code available'}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Test Suite</h2>
                  <Button
                    onClick={() => copyToClipboard(result.generatedCode?.testFile || '', 'coin.test.ts')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copiedFiles.has('coin.test.ts') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedFiles.has('coin.test.ts') ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="bg-black rounded-xl p-6 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    <code>{result.generatedCode?.testFile || 'No code available'}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'readme' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">README Documentation</h2>
                  <Button
                    onClick={() => copyToClipboard(result.generatedCode?.readme || '', 'README.md')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copiedFiles.has('README.md') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedFiles.has('README.md') ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
                      {result.generatedCode?.readme || 'No documentation available'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
