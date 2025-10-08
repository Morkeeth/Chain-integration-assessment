// Smart prioritization scoring system for blockchain integrations

import { DeFiLlamaService } from './defilama-api';

export interface PriorityScore {
  total: number; // 0-100
  breakdown: {
    marketOpportunity: number; // 0-30 (TVL, volume, users)
    technicalFeasibility: number; // 0-25 (complexity, EVM compat)
    strategicValue: number; // 0-25 (ecosystem, partnerships)
    urgency: number; // 0-20 (competitor status, community demand)
  };
  rating: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string[];
}

export class PrioritizationService {
  /**
   * Calculate comprehensive priority score
   */
  static async calculatePriority(
    chainName: string,
    complexity: 'LOW' | 'MEDIUM' | 'HIGH',
    tvl?: number,
    protocols?: number,
    chainRank?: number
  ): Promise<PriorityScore> {
    const reasoning: string[] = [];
    let marketOpportunity = 0;
    let technicalFeasibility = 0;
    let strategicValue = 0;
    let urgency = 0;

    // 1. Market Opportunity (0-30)
    if (tvl) {
      if (tvl > 10_000_000_000) { // >$10B
        marketOpportunity += 30;
        reasoning.push(`Massive TVL of ${DeFiLlamaService.formatTVL(tvl)} indicates huge market`);
      } else if (tvl > 1_000_000_000) { // >$1B
        marketOpportunity += 20;
        reasoning.push(`Strong TVL of ${DeFiLlamaService.formatTVL(tvl)}`);
      } else if (tvl > 100_000_000) { // >$100M
        marketOpportunity += 10;
        reasoning.push(`Moderate TVL of ${DeFiLlamaService.formatTVL(tvl)}`);
      } else {
        marketOpportunity += 5;
        reasoning.push(`Emerging market with ${DeFiLlamaService.formatTVL(tvl)} TVL`);
      }
    }

    if (protocols) {
      if (protocols > 100) {
        marketOpportunity += 5;
        reasoning.push(`Rich ecosystem with ${protocols}+ active protocols`);
      } else if (protocols > 50) {
        marketOpportunity += 3;
      } else if (protocols > 20) {
        marketOpportunity += 2;
      }
    }

    // 2. Technical Feasibility (0-25)
    switch (complexity) {
      case 'LOW':
        technicalFeasibility = 25;
        reasoning.push('LOW complexity - quick integration possible (2-4 weeks)');
        break;
      case 'MEDIUM':
        technicalFeasibility = 15;
        reasoning.push('MEDIUM complexity - moderate effort required (6-8 weeks)');
        break;
      case 'HIGH':
        technicalFeasibility = 5;
        reasoning.push('HIGH complexity - significant development needed (3-6 months)');
        break;
    }

    // 3. Strategic Value (0-25)
    const normalizedName = chainName.toLowerCase();
    
    // High-profile chains
    if (['berachain', 'movement', 'hyperliquid', 'monad'].includes(normalizedName)) {
      strategicValue += 15;
      reasoning.push('High-profile chain with strong community demand');
    }
    
    // Top 10 chains by TVL
    if (chainRank && chainRank <= 10) {
      strategicValue += 10;
      reasoning.push(`Top ${chainRank} chain globally - strategic importance`);
    } else if (chainRank && chainRank <= 25) {
      strategicValue += 7;
      reasoning.push(`Top 25 chain - good strategic fit`);
    } else if (chainRank && chainRank <= 50) {
      strategicValue += 4;
    }

    // Ecosystem diversity
    if (normalizedName.includes('move') || normalizedName.includes('aptos') || normalizedName.includes('sui')) {
      strategicValue += 5;
      reasoning.push('Move ecosystem - diversifies Ledger portfolio');
    }
    
    if (normalizedName.includes('zk') || normalizedName.includes('stark')) {
      strategicValue += 5;
      reasoning.push('ZK technology - future-proof integration');
    }

    // 4. Urgency (0-20)
    const urgentChains = ['berachain', 'movement', 'hyperliquid'];
    if (urgentChains.includes(normalizedName)) {
      urgency += 20;
      reasoning.push('IMMEDIATE priority - live mainnet with high adoption');
    } else if (['monad', 'starknet'].includes(normalizedName)) {
      urgency += 12;
      reasoning.push('Q3-Q4 2025 priority - significant funding/anticipation');
    } else if (tvl && tvl > 1_000_000_000) {
      urgency += 10;
      reasoning.push('Market opportunity growing - act soon');
    } else {
      urgency += 5;
      reasoning.push('Standard priority - monitor for growth');
    }

    // Calculate total
    const total = Math.min(100, marketOpportunity + technicalFeasibility + strategicValue + urgency);

    // Determine rating
    let rating: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    if (total >= 80) {
      rating = 'CRITICAL';
    } else if (total >= 60) {
      rating = 'HIGH';
    } else if (total >= 40) {
      rating = 'MEDIUM';
    } else {
      rating = 'LOW';
    }

    return {
      total: Math.round(total),
      breakdown: {
        marketOpportunity: Math.round(marketOpportunity),
        technicalFeasibility: Math.round(technicalFeasibility),
        strategicValue: Math.round(strategicValue),
        urgency: Math.round(urgency),
      },
      rating,
      reasoning,
    };
  }

  /**
   * Get recommended action based on priority
   */
  static getRecommendedAction(score: PriorityScore): string {
    switch (score.rating) {
      case 'CRITICAL':
        return 'START IMMEDIATELY - Allocate team resources and begin integration sprint';
      case 'HIGH':
        return 'PRIORITIZE - Add to next quarter roadmap with dedicated resources';
      case 'MEDIUM':
        return 'MONITOR - Track growth metrics and revisit in 1-2 quarters';
      case 'LOW':
        return 'BACKLOG - Keep on radar but no immediate action needed';
    }
  }

  /**
   * Compare two chains
   */
  static comparePriorities(score1: PriorityScore, score2: PriorityScore): string {
    const diff = score1.total - score2.total;
    if (Math.abs(diff) < 10) {
      return 'Similar priority - consider both';
    } else if (diff > 0) {
      return `First chain is ${diff} points higher priority`;
    } else {
      return `Second chain is ${Math.abs(diff)} points higher priority`;
    }
  }
}

