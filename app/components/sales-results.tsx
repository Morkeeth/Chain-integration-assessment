'use client';

import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  TrendingUp, Clock, DollarSign, Target, AlertTriangle, 
  CheckCircle, ArrowRight, FileText, Download, CheckCircle2
} from 'lucide-react';
import { RuleBasedAssessment } from '@/app/lib/rule-based-assessment';
import { isChainSupported } from '@/app/lib/integration-database';

interface SalesResultsProps {
  assessment: RuleBasedAssessment;
  chainData: {
    name: string;
    tvl: string;
    rank?: number;
    protocols?: number;
    change24h?: number;
  };
  onNewAssessment: () => void;
  onDetailedAssessment: () => void;
}

export function SalesResults({ 
  assessment, 
  chainData, 
  onNewAssessment,
  onDetailedAssessment 
}: SalesResultsProps) {
  
  const isSupported = isChainSupported(chainData.name);
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'P1': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'P2': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'P3': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleExport = () => {
    const exportData = {
      chain: chainData.name,
      assessment: assessment,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chainData.name.toLowerCase().replace(/\s+/g, '-')}-sales-assessment.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Chain Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">{chainData.name}</h2>
              {isSupported && (
                <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Already Supported
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              {isSupported ? 'Historical Integration Data' : 'Early Stage Sales Assessment'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Market Size</div>
            <div className="text-2xl font-bold text-gray-900">{chainData.tvl}</div>
            {chainData.rank && (
              <div className="text-xs text-gray-500 mt-1">Rank #{chainData.rank}</div>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Complexity</div>
            <div className="text-2xl font-bold text-gray-900">{assessment.complexity}</div>
            <div className="text-xs text-gray-500 mt-1">{assessment.complexityScore}/100</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Timeline</div>
            <div className="text-2xl font-bold text-gray-900">{assessment.estimatedWeeks}w</div>
            <div className="text-xs text-gray-500 mt-1">{Math.ceil(assessment.estimatedWeeks / 4)} months</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Investment</div>
            <div className="text-lg font-bold text-gray-900">{assessment.estimatedCost}</div>
            <div className="text-xs text-gray-500 mt-1">Engineering cost</div>
          </div>
        </div>
      </div>

      {/* Complexity & Priority */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Integration Complexity
          </h3>
          <div className="mb-4">
            <Badge className={`text-lg px-4 py-2 border ${getComplexityColor(assessment.complexity)}`}>
              {assessment.complexity} COMPLEXITY
            </Badge>
          </div>
          <div className="space-y-2">
            {assessment.whyThisComplexity.map((reason, idx) => (
              <p key={idx} className="text-gray-700 text-sm">{reason}</p>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 mb-2">TECHNICAL FACTORS</div>
            <div className="space-y-1">
              {assessment.keyTechnicalFactors.map((factor, idx) => (
                <div key={idx} className="text-sm text-gray-600">{factor}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Business Opportunity
          </h3>
          <div className="mb-4 flex items-center gap-3">
            <Badge className={`text-lg px-4 py-2 border ${getPriorityColor(assessment.recommendedPriority)}`}>
              {assessment.recommendedPriority} PRIORITY
            </Badge>
            <Badge className="text-sm px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300">
              {assessment.marketOpportunity} Opportunity
            </Badge>
          </div>
          {assessment.businessOpportunity.length > 0 ? (
            <div className="space-y-2 mb-4">
              {assessment.businessOpportunity.map((opp, idx) => (
                <div key={idx} className="text-gray-700 text-sm">{opp}</div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm mb-4">Monitor for market growth signals</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 mb-2">COMPETITIVE POSITION</div>
            <div className="space-y-1">
              {assessment.competitivePosition.map((pos, idx) => (
                <div key={idx} className="text-sm text-gray-600">• {pos}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Go-to-Market Strategy */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-orange-600" />
          Recommended Go-to-Market Strategy
        </h3>
        <p className="text-gray-800 font-medium text-lg">{assessment.goToMarketStrategy}</p>
      </div>

      {/* Red Flags */}
      {assessment.redFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Red Flags & Risk Factors
          </h3>
          <ul className="space-y-2">
            {assessment.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-red-800">
                <span className="text-red-500 mt-1">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Recommended Next Steps
        </h3>
        <div className="space-y-3">
          {assessment.nextSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 font-medium">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white rounded-lg p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">Ready for Detailed Technical Assessment?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            This early assessment provides sales-level insights. For engineering planning, 
            proceed to the detailed technical questionnaire with the foundation team.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={onDetailedAssessment}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <FileText className="h-5 w-5 mr-2" />
              Upload Technical Questionnaire
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={onNewAssessment}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Assess Another Chain
            </Button>
          </div>
        </div>
      </div>

      {/* Confidence & Metadata */}
      <div className="text-center text-sm text-gray-500">
        <p>Assessment Confidence: {assessment.confidence}% | Type: {assessment.chainType}</p>
        <p className="mt-1">This is an automated early-stage assessment for sales conversations.</p>
      </div>
    </div>
  );
}

