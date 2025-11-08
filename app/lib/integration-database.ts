/**
 * INTEGRATION DATABASE
 * Central source of truth for all Ledger blockchain integrations
 * 
 * Status tracking, historical data, and lessons learned
 * Maintained by: Product Team + Engineering
 */

export type IntegrationStatus = 
  | 'SUPPORTED'      // Live in Ledger Live
  | 'IN_PROGRESS'    // Active development
  | 'APPROVED'       // Approved, awaiting resources
  | 'EVALUATION'     // Under technical review
  | 'PLANNED'        // On roadmap
  | 'REJECTED'       // Not pursuing
  | 'ON_HOLD';       // Paused

export type ChainFamily = 
  | 'EVM' 
  | 'Bitcoin' 
  | 'Cosmos' 
  | 'Solana' 
  | 'Move' 
  | 'Substrate' 
  | 'Custom';

export interface IntegrationRecord {
  // Basic info
  chainName: string;
  chainId?: string;
  ticker: string;
  status: IntegrationStatus;
  
  // Categorization
  family: ChainFamily;
  architecture: string; // 'L1', 'L2', 'Rollup', 'Sidechain', etc.
  
  // Integration details (for SUPPORTED chains)
  launchDate?: string;           // ISO date when released
  ledgerLiveVersion?: string;    // Version when released
  hardwareSupport?: string[];    // ['Nano S Plus', 'Nano X', 'Stax']
  repositoryUrl?: string;        // GitHub URL to integration code
  
  // Historical data
  initialComplexityEstimate?: 'LOW' | 'MEDIUM' | 'HIGH';
  actualComplexity?: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedWeeks?: number;       // Initial estimate
  integrationDuration?: number;  // Actual weeks taken
  engineersAssigned?: number;
  estimatedCost?: number;        // Initial estimate
  actualCost?: number;           // Actual cost
  
  // Learning
  blockers?: string[];           // What slowed us down
  lessonsLearned?: string[];     // What we learned
  keyChallenges?: string[];       // Major technical challenges
  
  // Business metrics at time of integration
  tvlAtIntegration?: number;
  marketRankAtIntegration?: number;
  protocolsAtIntegration?: number;
  
  // Tracking
  jiraTicket?: string;           // JIRA ticket ID
  githubPR?: string;             // Main PR URL
  
  // Timestamps
  timestamps: {
    evaluated?: string;          // First assessment
    approved?: string;           // Approved for development
    started?: string;            // Development started
    completed?: string;          // Development completed
    released?: string;           // Released to users
    lastUpdated?: string;        // Last status update
  };
  
  // Notes
  notes?: string;                // Free-form notes
}

/**
 * INTEGRATION HISTORY
 * 
 * This is the source of truth for all past integrations.
 * 
 * TODO: Populate with actual historical data from:
 * - Ledger Live releases
 * - GitHub repository history
 * - JIRA tickets (when available)
 * - Product team records
 * 
 * Current status: Structure ready, awaiting data population
 */
export const INTEGRATION_HISTORY: IntegrationRecord[] = [
  // Example structure - replace with actual data
  {
    chainName: 'Solana',
    ticker: 'SOL',
    status: 'SUPPORTED',
    family: 'Solana',
    architecture: 'L1',
    launchDate: '2021-06-15',
    ledgerLiveVersion: '2.31.0',
    hardwareSupport: ['Nano S Plus', 'Nano X', 'Stax'],
    repositoryUrl: 'https://github.com/LedgerHQ/ledger-live/tree/develop/libs/ledger-live-common/src/families/solana',
    initialComplexityEstimate: 'MEDIUM',
    actualComplexity: 'MEDIUM',
    estimatedWeeks: 8,
    integrationDuration: 8,
    engineersAssigned: 2,
    estimatedCost: 80000,
    actualCost: 85000,
    blockers: [
      'SPL token standard required custom implementation',
      'Stake account management complexity'
    ],
    lessonsLearned: [
      'SPL token standard well-documented but requires custom handling',
      'Community SDKs are mature and helpful',
      'Staking mechanism more complex than expected'
    ],
    keyChallenges: [
      'Transaction signing with SPL tokens',
      'Account derivation for stake accounts'
    ],
    tvlAtIntegration: 5000000000,
    marketRankAtIntegration: 5,
    timestamps: {
      evaluated: '2021-04-01',
      approved: '2021-04-15',
      started: '2021-04-20',
      completed: '2021-06-10',
      released: '2021-06-15',
      lastUpdated: '2021-06-15'
    },
    notes: 'First non-EVM chain integration. Set pattern for custom VM integrations.'
  },
  
  // Add more SUPPORTED chains here...
  // TODO: Populate with actual data from:
  // - Bitcoin, Ethereum, Polygon, BNB Chain, Avalanche, Cosmos, Polkadot, etc.
];

/**
 * EVALUATIONS IN PROGRESS
 * 
 * Chains currently being evaluated or in development
 */
export const EVALUATIONS_IN_PROGRESS: IntegrationRecord[] = [
  // Example structure
  {
    chainName: 'Berachain',
    ticker: 'BERA',
    status: 'EVALUATION',
    family: 'EVM',
    architecture: 'L1',
    initialComplexityEstimate: 'LOW',
    estimatedWeeks: 4,
    timestamps: {
      evaluated: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  },
  // Add more evaluations...
];

/**
 * Get integration record by chain name
 */
export function getIntegrationRecord(chainName: string): IntegrationRecord | undefined {
  const normalized = chainName.toLowerCase().trim();
  
  // Check SUPPORTED chains first
  const supported = INTEGRATION_HISTORY.find(
    record => record.chainName.toLowerCase() === normalized
  );
  if (supported) return supported;
  
  // Check evaluations in progress
  const evaluation = EVALUATIONS_IN_PROGRESS.find(
    record => record.chainName.toLowerCase() === normalized
  );
  if (evaluation) return evaluation;
  
  return undefined;
}

/**
 * Check if chain is already supported
 */
export function isChainSupported(chainName: string): boolean {
  const record = getIntegrationRecord(chainName);
  return record?.status === 'SUPPORTED';
}

/**
 * Get similar past integrations
 */
export function getSimilarIntegrations(
  chainName: string,
  family?: ChainFamily,
  architecture?: string
): IntegrationRecord[] {
  const record = getIntegrationRecord(chainName);
  
  // If we have a record, find similar ones
  const similar = INTEGRATION_HISTORY.filter(integration => {
    // Same family
    if (family && integration.family === family) return true;
    // Same architecture
    if (architecture && integration.architecture === architecture) return true;
    // Same complexity
    if (record?.initialComplexityEstimate && 
        integration.initialComplexityEstimate === record.initialComplexityEstimate) {
      return true;
    }
    return false;
  });
  
  return similar.slice(0, 5); // Return top 5 similar
}

/**
 * Get lessons learned from similar integrations
 */
export function getLessonsLearned(chainName: string): string[] {
  const record = getIntegrationRecord(chainName);
  if (!record) return [];
  
  const similar = getSimilarIntegrations(
    chainName,
    record.family,
    record.architecture
  );
  
  const lessons: string[] = [];
  similar.forEach(integration => {
    if (integration.lessonsLearned) {
      lessons.push(...integration.lessonsLearned);
    }
  });
  
  return [...new Set(lessons)]; // Remove duplicates
}

/**
 * Get common blockers from similar integrations
 */
export function getCommonBlockers(chainName: string): string[] {
  const record = getIntegrationRecord(chainName);
  if (!record) return [];
  
  const similar = getSimilarIntegrations(
    chainName,
    record.family,
    record.architecture
  );
  
  const blockers: string[] = [];
  similar.forEach(integration => {
    if (integration.blockers) {
      blockers.push(...integration.blockers);
    }
  });
  
  return [...new Set(blockers)]; // Remove duplicates
}

/**
 * Calculate average integration time for complexity level
 */
export function getAverageIntegrationTime(
  complexity: 'LOW' | 'MEDIUM' | 'HIGH'
): number {
  const integrations = INTEGRATION_HISTORY.filter(
    i => i.actualComplexity === complexity && i.integrationDuration
  );
  
  if (integrations.length === 0) {
    // Default estimates if no data
    return complexity === 'LOW' ? 3.5 : complexity === 'MEDIUM' ? 7.5 : 12;
  }
  
  const totalWeeks = integrations.reduce(
    (sum, i) => sum + (i.integrationDuration || 0),
    0
  );
  
  return Math.round((totalWeeks / integrations.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Get integration statistics
 */
export function getIntegrationStats() {
  const supported = INTEGRATION_HISTORY.filter(i => i.status === 'SUPPORTED');
  const inProgress = INTEGRATION_HISTORY.filter(i => i.status === 'IN_PROGRESS');
  const evaluation = EVALUATIONS_IN_PROGRESS.length;
  
  const byFamily = supported.reduce((acc, i) => {
    acc[i.family] = (acc[i.family] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const avgTimeByComplexity = {
    LOW: getAverageIntegrationTime('LOW'),
    MEDIUM: getAverageIntegrationTime('MEDIUM'),
    HIGH: getAverageIntegrationTime('HIGH')
  };
  
  return {
    totalSupported: supported.length,
    inProgress: inProgress.length,
    underEvaluation: evaluation,
    byFamily,
    avgTimeByComplexity
  };
}

