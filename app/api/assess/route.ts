import { NextRequest, NextResponse } from 'next/server';
import { openai, ASSESSMENT_MODEL, MAX_TOKENS, TEMPERATURE } from '@/app/lib/openai';
import { buildAssessmentPrompt } from '@/app/lib/prompts';
import { buildEnhancedAssessmentPrompt } from '@/app/lib/enhanced-prompts';
import { assessChainComplexity } from '@/app/lib/rule-based-assessment';
import { AssessmentFormData } from '@/app/types/assessment';
import { searchChains, getChainByName } from '@/app/lib/chain-database';
import { GitHubIntegrationService } from '@/app/lib/github-integration';
import { BlockchainDataService } from '@/app/lib/blockchain-data';

export async function POST(request: NextRequest) {
  try {
    const body: AssessmentFormData = await request.json();
    
    // Validate required fields
    if (!body.chainName || !body.chainType) {
      return NextResponse.json(
        { error: 'Chain name and type are required' },
        { status: 400 }
      );
    }

    // Get initial rule-based assessment for context
    const chainInfo = await BlockchainDataService.getChainInfo(body.chainName);
    const initialAssessment = assessChainComplexity(
      body.chainName,
      chainInfo.tvl,
      chainInfo.chainRank,
      chainInfo.protocols,
      true
    );
    
    // Build enhanced prompt with historical context
    const prompt = buildEnhancedAssessmentPrompt(
      body.chainName,
      initialAssessment,
      {
        tvl: chainInfo.tvl,
        rank: chainInfo.chainRank,
        protocols: chainInfo.protocols
      }
    );
    
    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: ASSESSMENT_MODEL,
            messages: [
              {
                role: 'system',
                content: 'You are an expert blockchain integration specialist at Ledger with access to historical integration data. Provide detailed, actionable assessments that reference past integrations and lessons learned. Use web search if you need current information about the blockchain.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: TEMPERATURE,
            max_tokens: MAX_TOKENS,
            stream: true
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          controller.close();
        } catch (error) {
          console.error('OpenAI API error:', error);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: 'Failed to generate assessment' })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Assessment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
