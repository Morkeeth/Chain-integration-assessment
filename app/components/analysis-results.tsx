'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Copy, 
  Download, 
  ExternalLink, 
  Code, 
  Database, 
  Globe, 
  Github, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
import { copyToClipboard, exportToJSON } from '@/app/lib/utils';

interface ChainMetadata {
  name: string;
  ticker: string;
  rpcUrl: string;
  iconUrl: string;
  chainId: string;
  explorerUrl: string;
  githubRepo: string;
  chainType: string;
  isTestnet: boolean;
  tvl?: number;
  tvlFormatted?: string;
  protocols?: number;
  change24h?: number;
  chainRank?: number;
  totalChains?: number;
}

interface AnalysisResult {
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedTimeframe: string;
  technicalReasoning: string;
  actionChecklist: string[];
  redFlags: string[];
  recommendations: string[];
  confidence: number;
  discoveredMetadata: ChainMetadata;
  generatedCode: {
    currencyConfig: string;
    coinImplementation: string;
    testFile: string;
    readme: string;
  };
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export function AnalysisResults({ result, onNewAnalysis }: AnalysisResultsProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (content: string, section: string) => {
    await copyToClipboard(content);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExport = () => {
    const exportData = {
      chainName: result.discoveredMetadata.name,
      analysis: result,
      timestamp: new Date().toISOString(),
    };
    exportToJSON(exportData, `${result.discoveredMetadata.name.toLowerCase().replace(/\s+/g, '-')}-analysis.json`);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'LOW': return 'text-ledger-green bg-ledger-green/10 border-ledger-green/20';
      case 'MEDIUM': return 'text-ledger-yellow bg-ledger-yellow/10 border-ledger-yellow/20';
      case 'HIGH': return 'text-ledger-red bg-ledger-red/10 border-ledger-red/20';
      default: return 'text-ledger-gray-400 bg-ledger-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ledger-black via-ledger-gray-900 to-ledger-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-ledger-orange rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Analysis Complete</h1>
          </div>
          <p className="text-ledger-gray-300 text-lg">
            {result.discoveredMetadata.name} integration analysis with auto-discovered metadata
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complexity & Overview */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Integration Analysis</h2>
                <Badge className={`px-4 py-2 text-lg font-semibold ${getComplexityColor(result.complexity || 'MEDIUM')}`}>
                  {result.complexity || 'MEDIUM'} COMPLEXITY
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <Clock className="h-5 w-5 text-ledger-orange mb-2" />
                  <p className="text-sm text-ledger-gray-400">Estimated Time</p>
                  <p className="text-lg font-semibold text-white">{result.estimatedTimeframe || 'Unknown'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <Zap className="h-5 w-5 text-ledger-green mb-2" />
                  <p className="text-sm text-ledger-gray-400">Confidence</p>
                  <p className="text-lg font-semibold text-white">{result.confidence || 0}%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <Database className="h-5 w-5 text-ledger-blue mb-2" />
                  <p className="text-sm text-ledger-gray-400">Chain Type</p>
                  <p className="text-lg font-semibold text-white">{result.discoveredMetadata?.chainType || 'Unknown'}</p>
                </div>
                {result.discoveredMetadata?.tvlFormatted && (
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
                    <TrendingUp className="h-5 w-5 text-green-400 mb-2" />
                    <p className="text-sm text-ledger-gray-400">Total TVL</p>
                    <p className="text-lg font-semibold text-green-400">{result.discoveredMetadata.tvlFormatted}</p>
                    {result.discoveredMetadata.chainRank && (
                      <p className="text-xs text-green-300/60 mt-1">#{result.discoveredMetadata.chainRank} globally</p>
                    )}
                  </div>
                )}
              </div>

              {result.discoveredMetadata?.protocols && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-300">Active DeFi Protocols</p>
                      <p className="text-2xl font-bold text-blue-400">{result.discoveredMetadata.protocols}</p>
                    </div>
                    {result.discoveredMetadata.change24h !== undefined && (
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        result.discoveredMetadata.change24h >= 0 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {result.discoveredMetadata.change24h >= 0 ? '+' : ''}{result.discoveredMetadata.change24h}% 24h
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Technical Reasoning</h3>
                <p className="text-ledger-gray-300 leading-relaxed">{result.technicalReasoning || 'No technical reasoning available.'}</p>
              </div>
            </div>

            {/* Action Checklist */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Action Checklist
              </h3>
              <ul className="space-y-3">
                {result.actionChecklist?.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-ledger-orange text-white text-sm flex items-center justify-center font-semibold mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-ledger-gray-300">{item}</span>
                  </li>
                )) || []}
              </ul>
            </div>

            {/* Red Flags */}
            {result.redFlags?.length > 0 && (
              <div className="bg-ledger-red/10 backdrop-blur-lg rounded-2xl border border-ledger-red/20 p-6">
                <h3 className="text-xl font-bold text-ledger-red mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Red Flags
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-ledger-red mt-2 flex-shrink-0" />
                      <span className="text-ledger-red">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-ledger-green/10 backdrop-blur-lg rounded-2xl border border-ledger-green/20 p-6">
              <h3 className="text-xl font-bold text-ledger-green mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-ledger-green mt-2 flex-shrink-0" />
                    <span className="text-ledger-gray-300">{rec}</span>
                  </li>
                )) || []}
              </ul>
            </div>
          </div>

          {/* Sidebar - Discovered Metadata & Code */}
          <div className="space-y-6">
            {/* Discovered Metadata */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Discovered Metadata
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-ledger-gray-400 mb-1">Chain Name</p>
                  <p className="text-white font-semibold">{result.discoveredMetadata?.name || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-ledger-gray-400 mb-1">Ticker</p>
                  <p className="text-white font-semibold">{result.discoveredMetadata?.ticker || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-ledger-gray-400 mb-1">RPC URL</p>
                  <p className="text-ledger-orange text-sm break-all">{result.discoveredMetadata?.rpcUrl || 'Not available'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-ledger-gray-400 mb-1">Chain ID</p>
                  <p className="text-white font-mono">{result.discoveredMetadata?.chainId || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-ledger-gray-400 mb-1">Explorer</p>
                  <a 
                    href={result.discoveredMetadata?.explorerUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ledger-orange hover:underline text-sm break-all flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {result.discoveredMetadata?.explorerUrl || 'Not available'}
                  </a>
                </div>
                
                {result.discoveredMetadata?.githubRepo && (
                  <div>
                    <p className="text-sm text-ledger-gray-400 mb-1">GitHub</p>
                    <a 
                      href={result.discoveredMetadata.githubRepo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-ledger-orange hover:underline text-sm break-all flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" />
                      {result.discoveredMetadata.githubRepo}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Code */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated Code
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleCopy(result.generatedCode.currencyConfig, 'currency')}
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Currency Config
                  {copiedSection === 'currency' && <CheckCircle className="h-4 w-4 ml-auto text-ledger-green" />}
                </Button>
                
                <Button
                  onClick={() => handleCopy(result.generatedCode.coinImplementation, 'implementation')}
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Coin Implementation
                  {copiedSection === 'implementation' && <CheckCircle className="h-4 w-4 ml-auto text-ledger-green" />}
                </Button>
                
                <Button
                  onClick={() => handleCopy(result.generatedCode.testFile, 'test')}
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Test File
                  {copiedSection === 'test' && <CheckCircle className="h-4 w-4 ml-auto text-ledger-green" />}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleExport}
                className="w-full bg-ledger-orange hover:bg-ledger-orange/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Analysis
              </Button>
              
              <Button
                onClick={onNewAnalysis}
                variant="outline"
                className="w-full"
              >
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
