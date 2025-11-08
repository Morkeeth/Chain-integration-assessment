import { NextRequest, NextResponse } from 'next/server';
import { assessChainComplexity } from '@/app/lib/rule-based-assessment';
import { BlockchainDataService } from '@/app/lib/blockchain-data';

/**
 * SALES-FOCUSED ASSESSMENT API
 * 
 * Quick, deterministic assessment for sales conversations
 * No AI - pure rule-based logic for consistency
 */
export async function POST(request: NextRequest) {
  try {
    const { chainName } = await request.json();
    
    if (!chainName || chainName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Chain name is required' },
        { status: 400 }
      );
    }

    console.log(`[Sales Assessment] Processing: ${chainName}`);

    // Get real-time blockchain data
    const chainInfo = await BlockchainDataService.getChainInfo(chainName);
    
    // Run deterministic rule-based assessment
    const assessment = assessChainComplexity(
      chainName,
      chainInfo.tvl,
      chainInfo.chainRank,
      chainInfo.protocols,
      true // Assume mainnet live if we have data
    );

    // Enhance with real-time data
    const enhancedAssessment = {
      ...assessment,
      chainData: {
        name: chainName,
        tvl: chainInfo.tvlFormatted || 'Unknown',
        tvlRaw: chainInfo.tvl,
        rank: chainInfo.chainRank,
        protocols: chainInfo.protocols,
        change24h: chainInfo.change24h,
        rpcUrl: chainInfo.rpcUrl,
        chainId: chainInfo.chainId,
        explorerUrl: chainInfo.explorerUrl,
        ticker: chainInfo.ticker
      },
      timestamp: new Date().toISOString(),
      assessmentType: 'SALES_EARLY_STAGE'
    };

    console.log(`[Sales Assessment] Result: ${assessment.complexity} (${assessment.estimatedWeeks} weeks, ${assessment.recommendedPriority})`);

    return NextResponse.json(enhancedAssessment);
  } catch (error) {
    console.error('[Sales Assessment] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Assessment failed: ' + errorMessage },
      { status: 500 }
    );
  }
}

