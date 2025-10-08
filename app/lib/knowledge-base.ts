import { HistoricalAssessment } from '@/app/types/assessment';

// Sample historical assessment data - in a real app, this would come from a database
export const historicalAssessments: HistoricalAssessment[] = [
  {
    id: '1',
    chainName: 'Ethereum',
    chainType: 'EVM',
    complexity: 'LOW',
    timestamp: '2024-01-15T10:30:00Z',
    result: {
      complexity: 'LOW',
      estimatedTimeframe: '2-3 weeks',
      technicalReasoning: 'Well-established EVM chain with extensive documentation, mature tooling, and proven security model. Standard ERC-20/721 token support.',
      actionChecklist: [
        'Implement EVM transaction signing',
        'Add ERC-20 token support',
        'Integrate with MetaMask compatibility',
        'Test with mainnet and testnets'
      ],
      redFlags: [],
      recommendations: [
        'Leverage existing EVM infrastructure',
        'Follow standard Ledger EVM integration patterns'
      ],
      confidence: 95,
      timestamp: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: '2',
    chainName: 'Cosmos Hub',
    chainType: 'Cosmos',
    complexity: 'MEDIUM',
    timestamp: '2024-02-20T14:15:00Z',
    result: {
      complexity: 'MEDIUM',
      estimatedTimeframe: '6-8 weeks',
      technicalReasoning: 'Custom consensus mechanism (Tendermint), IBC protocol complexity, custom transaction format. Good documentation but requires custom implementation.',
      actionChecklist: [
        'Implement Tendermint transaction signing',
        'Add IBC token support',
        'Handle custom transaction encoding',
        'Test with Cosmos Hub mainnet'
      ],
      redFlags: [
        'Custom consensus may have security implications',
        'IBC protocol complexity could introduce bugs'
      ],
      recommendations: [
        'Start with basic transaction support',
        'Gradually add IBC features',
        'Extensive testing required'
      ],
      confidence: 80,
      timestamp: '2024-02-20T14:15:00Z'
    }
  },
  {
    id: '3',
    chainName: 'Solana',
    chainType: 'Custom',
    complexity: 'MEDIUM',
    timestamp: '2024-03-10T09:45:00Z',
    result: {
      complexity: 'MEDIUM',
      estimatedTimeframe: '8-10 weeks',
      technicalReasoning: 'Custom VM (BVM), unique account model, fast finality requirements. Growing ecosystem but custom implementation needed.',
      actionChecklist: [
        'Implement BVM transaction signing',
        'Handle Solana account model',
        'Add SPL token support',
        'Optimize for fast finality'
      ],
      redFlags: [
        'Fast finality may conflict with hardware wallet security',
        'Custom VM requires extensive testing'
      ],
      recommendations: [
        'Focus on security over speed',
        'Implement proper validation',
        'Consider phased rollout'
      ],
      confidence: 75,
      timestamp: '2024-03-10T09:45:00Z'
    }
  }
];

export function searchHistoricalAssessments(query: string, filters?: any): HistoricalAssessment[] {
  let results = historicalAssessments;
  
  if (query) {
    results = results.filter(assessment => 
      assessment.chainName.toLowerCase().includes(query.toLowerCase()) ||
      assessment.chainType.toLowerCase().includes(query.toLowerCase()) ||
      assessment.result.technicalReasoning.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  if (filters?.chainType) {
    results = results.filter(assessment => assessment.chainType === filters.chainType);
  }
  
  if (filters?.complexity) {
    results = results.filter(assessment => assessment.complexity === filters.complexity);
  }
  
  return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
