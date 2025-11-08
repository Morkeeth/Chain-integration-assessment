/**
 * ENHANCED AI PROMPTS
 * 
 * Injects historical context from past integrations into AI assessments
 * Improves accuracy by learning from past mistakes and successes
 */

import { 
  getIntegrationRecord, 
  getSimilarIntegrations, 
  getLessonsLearned, 
  getCommonBlockers,
  getAverageIntegrationTime,
  IntegrationRecord 
} from './integration-database';
import { RuleBasedAssessment } from './rule-based-assessment';

/**
 * Build enhanced assessment prompt with historical context
 */
export function buildEnhancedAssessmentPrompt(
  chainName: string,
  assessment: RuleBasedAssessment,
  chainData?: {
    tvl?: number;
    rank?: number;
    protocols?: number;
  }
): string {
  // Check if already supported
  const existingRecord = getIntegrationRecord(chainName);
  if (existingRecord?.status === 'SUPPORTED') {
    return buildAlreadySupportedPrompt(chainName, existingRecord);
  }
  
  // Find similar past integrations
  const similarIntegrations = getSimilarIntegrations(
    chainName,
    assessment.chainType as any,
    undefined
  );
  
  // Get lessons learned
  const lessonsLearned = getLessonsLearned(chainName);
  
  // Get common blockers
  const commonBlockers = getCommonBlockers(chainName);
  
  // Get average integration time
  const avgTime = getAverageIntegrationTime(assessment.complexity);
  
  // Build historical context section
  let historicalContext = '';
  
  if (similarIntegrations.length > 0) {
    historicalContext += `\n\n## HISTORICAL CONTEXT FROM PAST INTEGRATIONS:\n\n`;
    
    similarIntegrations.forEach(integration => {
      const timeDiff = integration.integrationDuration && integration.estimatedWeeks
        ? integration.integrationDuration - integration.estimatedWeeks
        : 0;
      
      historicalContext += `### ${integration.chainName} (${integration.family} ${integration.architecture}):\n`;
      historicalContext += `- **Estimated**: ${integration.initialComplexityEstimate} complexity (${integration.estimatedWeeks} weeks)\n`;
      historicalContext += `- **Actual**: ${integration.actualComplexity || integration.initialComplexityEstimate} complexity (${integration.integrationDuration} weeks)\n`;
      
      if (timeDiff > 0) {
        historicalContext += `- ⚠️ **TOOK ${timeDiff} WEEKS LONGER THAN EXPECTED**\n`;
      } else if (timeDiff < 0) {
        historicalContext += `- ✅ **COMPLETED ${Math.abs(timeDiff)} WEEKS EARLIER**\n`;
      } else {
        historicalContext += `- ✅ **ON TIME**\n`;
      }
      
      if (integration.lessonsLearned && integration.lessonsLearned.length > 0) {
        historicalContext += `- **Key Lessons**: ${integration.lessonsLearned.join('; ')}\n`;
      }
      
      if (integration.blockers && integration.blockers.length > 0) {
        historicalContext += `- **Blockers**: ${integration.blockers.join('; ')}\n`;
      }
      
      if (integration.keyChallenges && integration.keyChallenges.length > 0) {
        historicalContext += `- **Challenges**: ${integration.keyChallenges.join('; ')}\n`;
      }
      
      historicalContext += `\n`;
    });
  }
  
  // Add lessons learned summary
  if (lessonsLearned.length > 0) {
    historicalContext += `\n## LESSONS LEARNED FROM SIMILAR INTEGRATIONS:\n`;
    lessonsLearned.forEach(lesson => {
      historicalContext += `- ${lesson}\n`;
    });
    historicalContext += `\n`;
  }
  
  // Add common blockers
  if (commonBlockers.length > 0) {
    historicalContext += `\n## COMMON BLOCKERS TO WATCH FOR:\n`;
    commonBlockers.forEach(blocker => {
      historicalContext += `- ${blocker}\n`;
    });
    historicalContext += `\n`;
  }
  
  // Add average time context
  if (avgTime) {
    historicalContext += `\n## AVERAGE INTEGRATION TIME:\n`;
    historicalContext += `- Similar ${assessment.complexity} complexity integrations average: **${avgTime} weeks**\n`;
    historicalContext += `- Your estimate: **${assessment.estimatedWeeks} weeks**\n`;
    
    if (assessment.estimatedWeeks < avgTime) {
      historicalContext += `- ⚠️ **WARNING**: Your estimate is ${(avgTime - assessment.estimatedWeeks).toFixed(1)} weeks below average. Consider padding.\n`;
    } else if (assessment.estimatedWeeks > avgTime * 1.2) {
      historicalContext += `- ℹ️ **NOTE**: Your estimate is ${(assessment.estimatedWeeks - avgTime).toFixed(1)} weeks above average. May be conservative.\n`;
    }
    historicalContext += `\n`;
  }
  
  // Build the enhanced prompt
  const prompt = `You are a senior blockchain integration specialist at Ledger with 10+ years of experience. Analyze the integration complexity for ${chainName} blockchain.

## CURRENT ASSESSMENT SUMMARY:
- **Complexity**: ${assessment.complexity} (${assessment.complexityScore}/100)
- **Estimated Timeline**: ${assessment.estimatedWeeks} weeks
- **Estimated Cost**: ${assessment.estimatedCost}
- **Market Opportunity**: ${assessment.marketOpportunity}
- **Priority**: ${assessment.recommendedPriority}

## TECHNICAL FACTORS:
${assessment.keyTechnicalFactors.map(f => `- ${f}`).join('\n')}

## BUSINESS OPPORTUNITY:
${assessment.businessOpportunity.map(o => `- ${o}`).join('\n')}

${historicalContext}

## LEDGER INTEGRATION REQUIREMENTS:
- Hardware wallet compatibility and security requirements
- Ledger Live integration complexity
- Transaction signing mechanisms and key management
- Multi-signature and account recovery support
- Token standard compliance (ERC-20, ERC-721, SPL, etc.)
- Network reliability and uptime requirements
- Developer documentation and community support
- Testing and auditing requirements

## ANALYSIS REQUIREMENTS:

1. **Compare with historical data**: How does this compare to similar past integrations?
2. **Identify risks**: Based on past blockers, what could go wrong?
3. **Apply lessons learned**: What patterns from similar integrations apply here?
4. **Validate estimate**: Is the ${assessment.estimatedWeeks}-week estimate realistic given historical data?

## CRITICAL ANALYSIS FOCUS:
- Technical architecture and consensus mechanism
- Security model and attack vectors
- Development ecosystem maturity
- Integration complexity with Ledger hardware
- Timeline and resource requirements (validate against historical data)
- Risk factors and mitigation strategies (learn from past blockers)

Provide a detailed assessment in this exact JSON format:
{
  "complexity": "LOW|MEDIUM|HIGH",
  "estimatedTimeframe": "X weeks/months",
  "technicalReasoning": "Comprehensive analysis that references historical data and lessons learned from similar integrations",
  "actionChecklist": ["Specific, actionable tasks - consider past blockers"],
  "redFlags": ["Critical issues - reference similar past blockers"],
  "recommendations": ["Strategic recommendations - apply lessons learned"],
  "confidence": 85,
  "historicalComparison": "How this compares to similar past integrations",
  "riskFactors": ["Risks based on past blockers and challenges"]
}

Be thorough, specific, and reference historical data in your analysis.`;

  return prompt;
}

/**
 * Build prompt for already-supported chains
 */
function buildAlreadySupportedPrompt(
  chainName: string,
  record: IntegrationRecord
): string {
  return `You are analyzing ${chainName} for Ledger integration.

## IMPORTANT: This chain is already SUPPORTED in Ledger Live!

**Integration Details:**
- Status: ${record.status}
- Launch Date: ${record.launchDate}
- Ledger Live Version: ${record.ledgerLiveVersion || 'N/A'}
- Hardware Support: ${record.hardwareSupport?.join(', ') || 'N/A'}
- Repository: ${record.repositoryUrl || 'N/A'}

**Historical Data:**
- Initial Estimate: ${record.initialComplexityEstimate} complexity (${record.estimatedWeeks} weeks)
- Actual Result: ${record.actualComplexity || record.initialComplexityEstimate} complexity (${record.integrationDuration} weeks)
- Engineers: ${record.engineersAssigned || 'N/A'}
- Cost: $${record.actualCost?.toLocaleString() || record.estimatedCost?.toLocaleString() || 'N/A'}

${record.lessonsLearned && record.lessonsLearned.length > 0 ? `**Lessons Learned:**\n${record.lessonsLearned.map(l => `- ${l}`).join('\n')}\n` : ''}

${record.blockers && record.blockers.length > 0 ? `**Blockers Encountered:**\n${record.blockers.map(b => `- ${b}`).join('\n')}\n` : ''}

**This assessment is for reference only - the chain is already integrated.**`;
}

/**
 * Get historical context summary for similar integrations
 */
export function getHistoricalContextSummary(chainName: string): string {
  const record = getIntegrationRecord(chainName);
  if (record?.status === 'SUPPORTED') {
    return `Already supported since ${record.launchDate}`;
  }
  
  const similar = getSimilarIntegrations(chainName);
  if (similar.length === 0) {
    return 'No similar past integrations found';
  }
  
  const avgTime = similar
    .filter(s => s.integrationDuration)
    .reduce((sum, s) => sum + (s.integrationDuration || 0), 0) / similar.length;
  
  return `${similar.length} similar integrations found. Average time: ${avgTime.toFixed(1)} weeks.`;
}

