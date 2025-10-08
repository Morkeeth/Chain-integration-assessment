export type ChainType = 'EVM' | 'Cosmos' | 'Custom' | 'Bitcoin' | 'Solana' | 'Other';

export type ComplexityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AssessmentFormData = {
  chainName: string;
  chainType: ChainType;
  frameworkDetails: string;
  sdkAvailability: string;
  documentationQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
  nodeRpcStatus: 'Stable' | 'Unstable' | 'Unknown';
  signingAlgorithm: string;
  tokenStandards: string[];
  rawQuestionnaireData: string;
  documentationLinks: string[];
  additionalNotes?: string;
  // Chain metadata for integration
  rpcUrl: string;
  ticker: string;
  iconUrl?: string;
  chainId?: string;
  explorerUrl?: string;
  githubRepo?: string;
};

export type AssessmentResult = {
  complexity: ComplexityLevel;
  estimatedTimeframe: string;
  technicalReasoning: string;
  actionChecklist: string[];
  redFlags: string[];
  recommendations: string[];
  confidence: number; // 0-100
  timestamp: string;
};

export type HistoricalAssessment = {
  id: string;
  chainName: string;
  chainType: ChainType;
  complexity: ComplexityLevel;
  timestamp: string;
  result: AssessmentResult;
};

export type SearchFilters = {
  chainType?: ChainType;
  complexity?: ComplexityLevel;
  dateRange?: {
    start: string;
    end: string;
  };
};

export type ChainMetadata = {
  name: string;
  ticker: string;
  rpcUrl: string;
  iconUrl: string;
  chainId: string;
  explorerUrl: string;
  githubRepo?: string;
  chainType: ChainType;
  isTestnet: boolean;
};

export type GitHubIntegration = {
  repoUrl: string;
  branchName: string;
  commitMessage: string;
  files: {
    path: string;
    content: string;
  }[];
};
