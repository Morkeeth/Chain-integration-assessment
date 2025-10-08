'use client';

import { useState } from 'react';
import { AssessmentResult } from '@/app/types/assessment';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { getComplexityColor, copyToClipboard, exportToJSON } from '@/app/lib/utils';
import { CheckCircle, AlertTriangle, Clock, FileText, Copy, Download, Github } from 'lucide-react';

interface ResultsDisplayProps {
  result: AssessmentResult;
  chainName: string;
  chainMetadata?: {
    rpcUrl: string;
    ticker: string;
    iconUrl?: string;
    chainId?: string;
    explorerUrl?: string;
    githubRepo?: string;
  };
  onNewAssessment: () => void;
}

export function ResultsDisplay({ result, chainName, chainMetadata, onNewAssessment }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const resultText = `
Chain: ${chainName}
Complexity: ${result.complexity}
Timeframe: ${result.estimatedTimeframe}
Confidence: ${result.confidence}%

Technical Reasoning:
${result.technicalReasoning}

Action Checklist:
${result.actionChecklist.map((item, index) => `${index + 1}. ${item}`).join('\n')}

${result.redFlags.length > 0 ? `Red Flags:\n${result.redFlags.map((flag, index) => `${index + 1}. ${flag}`).join('\n')}` : ''}

Recommendations:
${result.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}
    `.trim();

    await copyToClipboard(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const exportData = {
      chainName,
      assessment: result,
      timestamp: new Date().toISOString(),
    };
    exportToJSON(exportData, `${chainName.toLowerCase().replace(/\s+/g, '-')}-assessment.json`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ledger-black">Assessment Results</h2>
          <p className="text-ledger-gray-600">Chain: {chainName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Complexity Badge */}
      <div className="flex items-center gap-4">
        <Badge
          variant={result.complexity === 'LOW' ? 'success' : result.complexity === 'MEDIUM' ? 'warning' : 'destructive'}
          className="text-lg px-4 py-2"
        >
          {result.complexity} COMPLEXITY
        </Badge>
        <div className="flex items-center gap-2 text-ledger-gray-600">
          <Clock className="h-4 w-4" />
          <span>{result.estimatedTimeframe}</span>
        </div>
        <div className="flex items-center gap-2 text-ledger-gray-600">
          <CheckCircle className="h-4 w-4" />
          <span>{result.confidence}% confidence</span>
        </div>
      </div>

      {/* Technical Reasoning */}
      <div className="bg-ledger-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ledger-black mb-3">Technical Reasoning</h3>
        <p className="text-ledger-gray-700 leading-relaxed">{result.technicalReasoning}</p>
      </div>

      {/* Action Checklist */}
      <div className="bg-white border border-ledger-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ledger-black mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Action Checklist
        </h3>
        <ul className="space-y-3">
          {result.actionChecklist.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ledger-orange text-white text-sm flex items-center justify-center font-semibold mt-0.5">
                {index + 1}
              </div>
              <span className="text-ledger-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Red Flags */}
      {result.redFlags.length > 0 && (
        <div className="bg-ledger-red/5 border border-ledger-red/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-ledger-red mb-4 flex items-center gap-2">
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
      <div className="bg-ledger-green/5 border border-ledger-green/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ledger-green mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-ledger-green mt-2 flex-shrink-0" />
              <span className="text-ledger-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chain Metadata Display */}
      {chainMetadata && (
        <div className="bg-ledger-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-ledger-black mb-4">Chain Integration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-ledger-gray-600">RPC URL:</span>
              <p className="text-sm text-ledger-gray-800 break-all">{chainMetadata.rpcUrl}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-ledger-gray-600">Ticker:</span>
              <p className="text-sm text-ledger-gray-800">{chainMetadata.ticker}</p>
            </div>
            {chainMetadata.chainId && (
              <div>
                <span className="text-sm font-medium text-ledger-gray-600">Chain ID:</span>
                <p className="text-sm text-ledger-gray-800">{chainMetadata.chainId}</p>
              </div>
            )}
            {chainMetadata.explorerUrl && (
              <div>
                <span className="text-sm font-medium text-ledger-gray-600">Explorer:</span>
                <a 
                  href={chainMetadata.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-ledger-orange hover:underline break-all"
                >
                  {chainMetadata.explorerUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <Button onClick={onNewAssessment} className="flex-1">
          New Assessment
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          Copy Results
        </Button>
        <Button variant="outline" onClick={handleExport}>
          Export JSON
        </Button>
        {chainMetadata?.githubRepo && (
          <Button 
            variant="outline" 
            onClick={() => window.open(chainMetadata.githubRepo, '_blank')}
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        )}
      </div>
    </div>
  );
}
