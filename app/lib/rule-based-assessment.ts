/**
 * DETERMINISTIC RULE-BASED ASSESSMENT SYSTEM
 * 
 * This is a sales-focused tool for early blockchain integration assessment.
 * Uses clear, deterministic rules to classify complexity and provide actionable insights.
 */

export type ComplexityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RuleBasedAssessment {
  // Core Assessment
  complexity: ComplexityLevel;
  complexityScore: number; // 0-100 (0=easiest, 100=hardest)
  estimatedWeeks: number;
  estimatedCost: string; // Resource estimate
  
  // Sales Metrics
  marketOpportunity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedPriority: 'P0' | 'P1' | 'P2' | 'P3';
  
  // Clear Reasoning
  whyThisComplexity: string[];
  keyTechnicalFactors: string[];
  businessOpportunity: string[];
  competitivePosition: string[];
  
  // Actionable Next Steps
  nextSteps: string[];
  redFlags: string[];
  goToMarketStrategy: string;
  
  // Metadata
  chainType: string;
  matchedRules: string[];
  confidence: number; // 0-100
}

interface ChainPattern {
  patterns: string[];
  complexity: ComplexityLevel;
  baseWeeks: number;
  reasoning: string;
}

/**
 * DETERMINISTIC COMPLEXITY RULES
 * These rules are applied in order - first match wins
 */
const COMPLEXITY_RULES: ChainPattern[] = [
  // ===== LOW COMPLEXITY =====
  // EVM L2s and Rollups (2-4 weeks)
  {
    patterns: ['base', 'optimism', 'arbitrum', 'zksync', 'linea', 'scroll', 'blast', 'mode', 'zora', 'mantle', 'manta', 'metis'],
    complexity: 'LOW',
    baseWeeks: 3,
    reasoning: 'EVM L2 - Fork existing L2 integration, update RPC/chainId, minimal changes'
  },
  // EVM L1s (3-5 weeks)
  {
    patterns: ['polygon', 'avalanche', 'bsc', 'bnb', 'fantom', 'moonbeam', 'celo', 'gnosis', 'aurora', 'sonic', 'flare', 'berachain', 'monad'],
    complexity: 'LOW',
    baseWeeks: 4,
    reasoning: 'EVM L1 - Standard EVM implementation, well-documented, mature tooling'
  },
  // Bitcoin forks (3-4 weeks)
  {
    patterns: ['litecoin', 'dogecoin', 'bitcoin cash', 'zcash'],
    complexity: 'LOW',
    baseWeeks: 3,
    reasoning: 'Bitcoin fork - Leverage existing Bitcoin integration with minor modifications'
  },
  
  // ===== MEDIUM COMPLEXITY =====
  // Cosmos ecosystem (6-8 weeks)
  {
    patterns: ['cosmos', 'osmosis', 'juno', 'stargaze', 'akash', 'celestia', 'dydx', 'injective', 'sei', 'noble'],
    complexity: 'MEDIUM',
    baseWeeks: 7,
    reasoning: 'Cosmos SDK chain - Custom but standardized, IBC support, good documentation'
  },
  // Solana ecosystem (6-8 weeks)
  {
    patterns: ['solana', 'sol'],
    complexity: 'MEDIUM',
    baseWeeks: 7,
    reasoning: 'Solana VM - Custom runtime, SPL token standard, established SDK'
  },
  // Move-based chains (8-10 weeks)
  {
    patterns: ['aptos', 'sui', 'movement'],
    complexity: 'MEDIUM',
    baseWeeks: 9,
    reasoning: 'Move VM - New paradigm but growing ecosystem, moderate documentation'
  },
  // Substrate-based chains (7-9 weeks)
  {
    patterns: ['polkadot', 'kusama', 'moonriver', 'astar', 'substrate'],
    complexity: 'MEDIUM',
    baseWeeks: 8,
    reasoning: 'Substrate framework - Modular but complex, custom runtime, parachain considerations'
  },
  // Alt-L1s with unique features (6-8 weeks)
  {
    patterns: ['near', 'algorand', 'hedera', 'iota', 'cardano', 'tezos', 'flow', 'hyperliquid', 'fuel'],
    complexity: 'MEDIUM',
    baseWeeks: 7,
    reasoning: 'Alt-L1 - Unique architecture, custom transaction model, varying doc quality'
  },
  // StarkNet ecosystem (8-10 weeks)
  {
    patterns: ['starknet', 'stark'],
    complexity: 'MEDIUM',
    baseWeeks: 9,
    reasoning: 'Cairo VM - ZK rollup with custom VM, growing but complex ecosystem'
  },
  
  // ===== HIGH COMPLEXITY =====
  // Privacy chains (12-16 weeks)
  {
    patterns: ['monero', 'zcash', 'ironfish', 'iron fish', 'aleo', 'penumbra'],
    complexity: 'HIGH',
    baseWeeks: 14,
    reasoning: 'Privacy-focused - Zero-knowledge proofs, shielded transactions, complex cryptography'
  },
  // Experimental/cutting-edge (10-14 weeks)
  {
    patterns: ['mina', 'fuel', 'aztec', 'noir'],
    complexity: 'HIGH',
    baseWeeks: 12,
    reasoning: 'Experimental tech - Novel approach, limited tooling, immature ecosystem'
  },
  // Enterprise/permissioned (10-12 weeks)
  {
    patterns: ['hyperledger', 'corda', 'quorum', 'canton'],
    complexity: 'HIGH',
    baseWeeks: 11,
    reasoning: 'Enterprise blockchain - Permissioned, custom architecture, limited public docs'
  },
];

/**
 * TVL-based market opportunity scoring
 */
function calculateMarketOpportunity(tvl?: number, chainRank?: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (!tvl) return 'LOW';
  
  if (tvl > 10_000_000_000 || (chainRank && chainRank <= 5)) return 'CRITICAL'; // >$10B or Top 5
  if (tvl > 2_000_000_000 || (chainRank && chainRank <= 15)) return 'HIGH';     // >$2B or Top 15
  if (tvl > 500_000_000 || (chainRank && chainRank <= 30)) return 'MEDIUM';     // >$500M or Top 30
  return 'LOW';
}

/**
 * Calculate priority based on complexity vs opportunity
 */
function calculatePriority(
  complexity: ComplexityLevel,
  opportunity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
): 'P0' | 'P1' | 'P2' | 'P3' {
  // Priority matrix: LOW complexity + HIGH opportunity = P0
  const priorityMatrix: Record<string, 'P0' | 'P1' | 'P2' | 'P3'> = {
    'LOW-CRITICAL': 'P0',
    'LOW-HIGH': 'P0',
    'LOW-MEDIUM': 'P1',
    'LOW-LOW': 'P2',
    
    'MEDIUM-CRITICAL': 'P0',
    'MEDIUM-HIGH': 'P1',
    'MEDIUM-MEDIUM': 'P2',
    'MEDIUM-LOW': 'P3',
    
    'HIGH-CRITICAL': 'P1',
    'HIGH-HIGH': 'P1',
    'HIGH-MEDIUM': 'P2',
    'HIGH-LOW': 'P3',
  };
  
  return priorityMatrix[`${complexity}-${opportunity}`] || 'P2';
}

/**
 * Main assessment function - completely deterministic
 */
export function assessChainComplexity(
  chainName: string,
  tvl?: number,
  chainRank?: number,
  protocols?: number,
  isMainnetLive?: boolean
): RuleBasedAssessment {
  const normalizedName = chainName.toLowerCase().trim();
  
  // Check if already supported (import dynamically to avoid circular deps)
  try {
    const { isChainSupported, getIntegrationRecord } = require('./integration-database');
    if (isChainSupported(chainName)) {
      const record = getIntegrationRecord(chainName);
      if (record) {
        // Return assessment based on actual historical data
        return {
          complexity: record.actualComplexity || record.initialComplexityEstimate || 'MEDIUM',
          complexityScore: record.actualComplexity === 'LOW' ? 25 : 
                          record.actualComplexity === 'MEDIUM' ? 55 : 85,
          estimatedWeeks: record.integrationDuration || record.estimatedWeeks || 8,
          estimatedCost: record.actualCost 
            ? `$${(record.actualCost / 1000).toFixed(0)}K (actual)`
            : `$${((record.estimatedWeeks || 8) * 5000 / 1000).toFixed(0)}K (estimated)`,
          marketOpportunity: 'SUPPORTED' as any,
          recommendedPriority: 'P0' as any,
          whyThisComplexity: [
            `Already supported in Ledger Live since ${record.launchDate || 'N/A'}`,
            `Actual complexity: ${record.actualComplexity || record.initialComplexityEstimate || 'MEDIUM'}`,
            `Integration took ${record.integrationDuration || record.estimatedWeeks || 8} weeks`
          ],
          keyTechnicalFactors: record.lessonsLearned || [],
          businessOpportunity: [`✅ Already integrated - no new opportunity`],
          competitivePosition: [`Live in production since ${record.launchDate || 'N/A'}`],
          nextSteps: [
            '✅ Already supported - no action needed',
            `View integration: ${record.repositoryUrl || 'N/A'}`,
            `Ledger Live version: ${record.ledgerLiveVersion || 'N/A'}`
          ],
          redFlags: [],
          goToMarketStrategy: '✅ Already supported in Ledger Live',
          chainType: record.family,
          matchedRules: ['Already supported - using historical data'],
          confidence: 100
        };
      }
    }
  } catch (e) {
    // Integration database not available, continue with normal assessment
  }
  
  // Find matching rule
  let matchedRule = COMPLEXITY_RULES.find(rule =>
    rule.patterns.some(pattern => normalizedName.includes(pattern))
  );
  
  // Default fallback for unknown chains
  if (!matchedRule) {
    matchedRule = {
      patterns: [normalizedName],
      complexity: 'MEDIUM',
      baseWeeks: 8,
      reasoning: 'Unknown chain type - requires custom analysis. Defaulting to MEDIUM complexity pending technical assessment.'
    };
  }
  
  // Calculate scores
  const complexityScore = matchedRule.complexity === 'LOW' ? 25 : 
                         matchedRule.complexity === 'MEDIUM' ? 55 : 85;
  
  const marketOpportunity = calculateMarketOpportunity(tvl, chainRank);
  const priority = calculatePriority(matchedRule.complexity, marketOpportunity);
  
  // Build reasoning
  const whyThisComplexity: string[] = [matchedRule.reasoning];
  
  const keyTechnicalFactors: string[] = [];
  if (matchedRule.complexity === 'LOW') {
    keyTechnicalFactors.push('✓ Standard architecture (EVM/Bitcoin-based)');
    keyTechnicalFactors.push('✓ Can leverage existing Ledger integrations');
    keyTechnicalFactors.push('✓ Well-documented with mature tooling');
    keyTechnicalFactors.push('✓ Established developer community');
  } else if (matchedRule.complexity === 'MEDIUM') {
    keyTechnicalFactors.push('⚠ Custom virtual machine or runtime');
    keyTechnicalFactors.push('⚠ Requires new integration patterns');
    keyTechnicalFactors.push('✓ Growing ecosystem with SDK support');
    keyTechnicalFactors.push('⚠ Moderate documentation quality');
  } else {
    keyTechnicalFactors.push('⚠ Novel cryptography or consensus');
    keyTechnicalFactors.push('⚠ Limited tooling and documentation');
    keyTechnicalFactors.push('⚠ Requires significant R&D');
    keyTechnicalFactors.push('⚠ Security audit complexity high');
  }
  
  // Business opportunity
  const businessOpportunity: string[] = [];
  if (tvl && tvl > 1_000_000_000) {
    businessOpportunity.push(`💰 Strong market: $${(tvl / 1_000_000_000).toFixed(1)}B TVL`);
  }
  if (chainRank && chainRank <= 20) {
    businessOpportunity.push(`📊 Top ${chainRank} chain by TVL`);
  }
  if (protocols && protocols > 50) {
    businessOpportunity.push(`🔥 Active ecosystem: ${protocols}+ protocols`);
  }
  if (businessOpportunity.length === 0) {
    businessOpportunity.push('📈 Emerging opportunity - monitor growth metrics');
  }
  
  // Competitive position
  const competitivePosition: string[] = [];
  if (matchedRule.complexity === 'LOW') {
    competitivePosition.push('Fast time-to-market advantage');
    competitivePosition.push('Low risk integration - proven patterns');
    competitivePosition.push('Can launch ahead of competitors');
  } else if (matchedRule.complexity === 'MEDIUM') {
    competitivePosition.push('Moderate development investment required');
    competitivePosition.push('Strategic positioning in growing ecosystem');
    competitivePosition.push('Balance of risk vs opportunity');
  } else {
    competitivePosition.push('High complexity - first-mover challenges');
    competitivePosition.push('Significant R&D investment needed');
    competitivePosition.push('Long-term strategic bet');
  }
  
  // Next steps
  const nextSteps: string[] = [];
  if (matchedRule.complexity === 'LOW' && marketOpportunity !== 'LOW') {
    nextSteps.push('✅ RECOMMEND: Fast-track this integration');
    nextSteps.push('📋 Request technical questionnaire from foundation');
    nextSteps.push('🚀 Allocate 1 senior engineer for ' + matchedRule.baseWeeks + ' weeks');
    nextSteps.push('📅 Target launch: ' + Math.ceil(matchedRule.baseWeeks / 4) + ' months');
  } else if (matchedRule.complexity === 'MEDIUM') {
    nextSteps.push('📊 Conduct detailed technical assessment');
    nextSteps.push('📋 Request comprehensive tech questionnaire');
    nextSteps.push('👥 Allocate 2 engineers for ' + matchedRule.baseWeeks + ' weeks');
    nextSteps.push('🔍 Review security requirements and audit needs');
    nextSteps.push('📅 Plan for ' + Math.ceil(matchedRule.baseWeeks / 4) + '-' + Math.ceil(matchedRule.baseWeeks / 4 + 1) + ' month timeline');
  } else {
    nextSteps.push('⚠️ CAUTION: High complexity integration');
    nextSteps.push('🔬 Requires deep R&D phase before commitment');
    nextSteps.push('📋 Request detailed technical documentation + audit reports');
    nextSteps.push('👥 Form specialized team (3-4 engineers)');
    nextSteps.push('📅 Expect ' + Math.ceil(matchedRule.baseWeeks / 4) + '+ month timeline');
    nextSteps.push('💰 Budget for external security audits');
  }
  
  // Red flags
  const redFlags: string[] = [];
  if (!isMainnetLive) {
    redFlags.push('🚨 Mainnet not live - wait for production launch');
  }
  if (matchedRule.complexity === 'HIGH' && (!tvl || tvl < 100_000_000)) {
    redFlags.push('⚠️ High complexity + low market opportunity = risky investment');
  }
  if (matchedRule.patterns[0] === normalizedName && !tvl) {
    redFlags.push('❓ Unknown chain - requires comprehensive technical diligence');
  }
  
  // Go-to-market strategy
  let goToMarketStrategy = '';
  if (priority === 'P0') {
    goToMarketStrategy = '🎯 P0 - IMMEDIATE: Fast-track to capture market opportunity. Launch within ' + Math.ceil(matchedRule.baseWeeks / 4) + ' months.';
  } else if (priority === 'P1') {
    goToMarketStrategy = '📋 P1 - HIGH: Add to Q2 roadmap. Plan ' + Math.ceil(matchedRule.baseWeeks / 4) + '-month sprint.';
  } else if (priority === 'P2') {
    goToMarketStrategy = '📊 P2 - MEDIUM: Monitor and reassess quarterly. Consider if market grows.';
  } else {
    goToMarketStrategy = '⏸️ P3 - LOW: Backlog only. Wait for significant market signals.';
  }
  
  // Cost estimate
  const weeklyEngCost = 5000; // Rough estimate per engineer per week
  const engineersNeeded = matchedRule.complexity === 'LOW' ? 1 : 
                          matchedRule.complexity === 'MEDIUM' ? 2 : 3;
  const totalCost = matchedRule.baseWeeks * engineersNeeded * weeklyEngCost;
  const estimatedCost = `$${(totalCost / 1000).toFixed(0)}K (${engineersNeeded} eng × ${matchedRule.baseWeeks} weeks)`;
  
  // Confidence score (higher for pattern matches)
  const confidence = matchedRule.patterns[0] !== normalizedName ? 90 : 60;
  
  return {
    complexity: matchedRule.complexity,
    complexityScore,
    estimatedWeeks: matchedRule.baseWeeks,
    estimatedCost,
    marketOpportunity,
    recommendedPriority: priority,
    whyThisComplexity,
    keyTechnicalFactors,
    businessOpportunity,
    competitivePosition,
    nextSteps,
    redFlags,
    goToMarketStrategy,
    chainType: matchedRule.patterns[0],
    matchedRules: [matchedRule.reasoning],
    confidence
  };
}

/**
 * Format TVL for display
 */
export function formatTVL(tvl?: number): string {
  if (!tvl) return 'Unknown';
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(0)}M`;
  return `$${(tvl / 1_000).toFixed(0)}K`;
}

