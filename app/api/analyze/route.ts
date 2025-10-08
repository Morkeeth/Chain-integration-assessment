import { NextRequest, NextResponse } from 'next/server';
import { openai, ASSESSMENT_MODEL, MAX_TOKENS, TEMPERATURE } from '@/app/lib/openai';
import { searchChains, getChainByName } from '@/app/lib/chain-database';
import { GitHubIntegrationService } from '@/app/lib/github-integration';

export async function POST(request: NextRequest) {
  try {
    const { chainName } = await request.json();
    
    if (!chainName) {
      return NextResponse.json(
        { error: 'Chain name is required' },
        { status: 400 }
      );
    }

    // Step 1: Try to find chain in database
    let discoveredMetadata = getChainByName(chainName);
    
    // Step 2: If not found, search for similar chains
    if (!discoveredMetadata) {
      const searchResults = searchChains(chainName);
      if (searchResults.length > 0) {
        discoveredMetadata = searchResults[0];
      }
    }

    // Step 3: If still not found, create basic metadata
    if (!discoveredMetadata) {
      discoveredMetadata = {
        name: chainName,
        ticker: chainName.substring(0, 3).toUpperCase(),
        rpcUrl: `https://${chainName.toLowerCase()}.rpc.com`,
        iconUrl: `https://cryptologos.cc/logos/${chainName.toLowerCase()}-logo.png`,
        chainId: 'unknown',
        explorerUrl: `https://explorer.${chainName.toLowerCase()}.com`,
        githubRepo: '',
        chainType: 'Custom',
        isTestnet: false,
      };
    }

    // Step 4: Build enhanced prompt with discovered metadata
    const enhancedPrompt = `You are an expert blockchain integration specialist at Ledger. Analyze the integration complexity for ${chainName}.

DISCOVERED METADATA:
- Name: ${discoveredMetadata.name}
- Ticker: ${discoveredMetadata.ticker}
- RPC URL: ${discoveredMetadata.rpcUrl}
- Chain ID: ${discoveredMetadata.chainId}
- Explorer: ${discoveredMetadata.explorerUrl}
- Type: ${discoveredMetadata.chainType}
- GitHub: ${discoveredMetadata.githubRepo || 'Not found'}

LEDGER INTEGRATION REQUIREMENTS:
- Hardware wallet support for secure key management
- Native app integration with Ledger Live
- Transaction signing and verification
- Multi-signature support
- Token standard compliance
- Network stability and reliability
- Developer documentation quality
- Community support and maintenance

Use web search to get the latest information about this blockchain, including recent updates, security issues, community activity, and technical developments.

Provide a comprehensive assessment in the following JSON format:
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

    // Step 5: Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: ASSESSMENT_MODEL,
            messages: [
              {
                role: 'system',
                content: 'You are an expert blockchain integration specialist at Ledger. Provide detailed, actionable assessments for blockchain integration complexity. Use web search to get the latest information about the blockchain.'
              },
              {
                role: 'user',
                content: enhancedPrompt
              }
            ],
            temperature: TEMPERATURE,
            max_tokens: MAX_TOKENS,
            stream: true,
            tools: [
              {
                type: "web_search"
              }
            ]
          });

          let fullResponse = '';
          let step = 1;

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              
              // Send step updates
              if (step <= 4) {
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                  type: 'step', 
                  step: step,
                  message: step === 1 ? 'Querying documentation...' : 
                          step === 2 ? 'Activating web search...' :
                          step === 3 ? 'Finalizing complexity analysis...' :
                          'Generating integration code...'
                })}\n\n`));
                step++;
              }
              
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
                type: 'content', 
                content 
              })}\n\n`));
            }
          }

          // Step 6: Generate code
          const githubService = new GitHubIntegrationService();
          const generatedCode = await githubService.createChainIntegration(
            discoveredMetadata,
            JSON.parse(fullResponse),
            'dummy-token' // In real implementation, this would be a valid GitHub token
          );

          // Send final result
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
            type: 'result',
            analysis: JSON.parse(fullResponse),
            discoveredMetadata,
            generatedCode: {
              currencyConfig: generatedCode.files[0]?.content || '',
              coinImplementation: generatedCode.files[1]?.content || '',
              testFile: generatedCode.files[2]?.content || '',
              readme: generatedCode.files[3]?.content || '',
            }
          })}\n\n`));
          
          controller.close();
        } catch (error) {
          console.error('Analysis API error:', error);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: 'Failed to generate analysis' 
          })}\n\n`));
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
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
