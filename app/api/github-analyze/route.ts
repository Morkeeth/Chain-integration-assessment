import { NextRequest, NextResponse } from 'next/server';
import { githubAnalyzer } from '@/app/lib/github-analyzer';

/**
 * GitHub Analysis API
 * 
 * Scrapes Ledger Live repository to extract:
 * - All chain families
 * - Integration timelines
 * - Common patterns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'all';
    
    switch (action) {
      case 'families':
        // Get all chain families
        const families = await githubAnalyzer.getAllChainFamilies();
        return NextResponse.json({
          success: true,
          count: families.length,
          families: families.map(f => ({
            name: f.name,
            family: f.family,
            commitCount: f.commitCount,
            prCount: f.prCount,
            files: f.files.length
          }))
        });
        
      case 'timeline':
        // Get timeline for specific chain
        const chainName = searchParams.get('chain');
        if (!chainName) {
          return NextResponse.json(
            { error: 'Chain name required for timeline' },
            { status: 400 }
          );
        }
        
        const timeline = await githubAnalyzer.getIntegrationTimeline(chainName);
        if (!timeline) {
          return NextResponse.json(
            { error: `No timeline found for ${chainName}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          timeline
        });
        
      case 'patterns':
        // Analyze all integrations and extract patterns
        const analysis = await githubAnalyzer.analyzeAllIntegrations();
        return NextResponse.json({
          success: true,
          ...analysis
        });
        
      case 'all':
      default:
        // Get everything
        const allFamilies = await githubAnalyzer.getAllChainFamilies();
        const allAnalysis = await githubAnalyzer.analyzeAllIntegrations();
        
        return NextResponse.json({
          success: true,
          families: allFamilies,
          patterns: allAnalysis.patterns,
          summary: {
            totalFamilies: allFamilies.length,
            avgCommits: allAnalysis.patterns.avgCommits,
            avgPRs: allAnalysis.patterns.avgPRs,
            commonFiles: allAnalysis.patterns.commonFiles
          }
        });
    }
  } catch (error) {
    console.error('GitHub analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'GitHub analysis failed: ' + errorMessage },
      { status: 500 }
    );
  }
}

