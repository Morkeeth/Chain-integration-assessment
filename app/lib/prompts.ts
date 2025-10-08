import { AssessmentFormData } from '@/app/types/assessment';

export function buildAssessmentPrompt(data: AssessmentFormData): string {
  return `You are an expert blockchain integration specialist at Ledger, analyzing the complexity of integrating a new blockchain into Ledger's ecosystem.

IMPORTANT: If you need current information about this blockchain (recent updates, security issues, community activity, etc.), use web search to get the latest data before providing your assessment.

LEDGER INTEGRATION REQUIREMENTS:
- Hardware wallet support for secure key management
- Native app integration with Ledger Live
- Transaction signing and verification
- Multi-signature support
- Token standard compliance
- Network stability and reliability
- Developer documentation quality
- Community support and maintenance

HISTORICAL ASSESSMENT EXAMPLES:
- Ethereum (EVM): LOW complexity - Well-established, extensive documentation, mature tooling
- Bitcoin: LOW complexity - Native support, simple UTXO model, proven security
- Cosmos (ATOM): MEDIUM complexity - Custom consensus, IBC protocol, moderate documentation
- Solana: MEDIUM complexity - Fast finality, custom VM, growing ecosystem
- Custom chains: HIGH complexity - Unknown security model, limited documentation, untested

COMPLEXITY CRITERIA:
LOW: Established chains with excellent documentation, mature tooling, proven security
MEDIUM: Growing chains with good documentation, some custom features, moderate complexity
HIGH: New/experimental chains, poor documentation, custom consensus, security concerns

ASSESSMENT DATA:
Chain Name: ${data.chainName}
Chain Type: ${data.chainType}
Framework Details: ${data.frameworkDetails}
SDK Availability: ${data.sdkAvailability}
Documentation Quality: ${data.documentationQuality}
Node/RPC Status: ${data.nodeRpcStatus}
Signing Algorithm: ${data.signingAlgorithm}
Token Standards: ${data.tokenStandards.join(', ')}
Raw Questionnaire Data: ${data.rawQuestionnaireData}
Documentation Links: ${data.documentationLinks.join(', ')}

Please provide a comprehensive assessment in the following JSON format:
{
  "complexity": "LOW|MEDIUM|HIGH",
  "estimatedTimeframe": "X weeks/months",
  "technicalReasoning": "Detailed explanation of complexity factors",
  "actionChecklist": ["Specific tasks for integration"],
  "redFlags": ["Potential issues or concerns"],
  "recommendations": ["Suggested next steps"],
  "confidence": 85
}

Focus on:
1. Technical feasibility and complexity
2. Security considerations
3. Development timeline estimates
4. Risk assessment
5. Resource requirements
6. Integration challenges

Be specific and actionable in your recommendations.`;
}
