// DeFiLlama API integration for real blockchain metrics

export interface ChainTVL {
  name: string;
  tvl: number;
  tokenSymbol: string;
  cmcId?: string;
  gecko_id?: string;
  chainId?: number;
}

export interface ProtocolData {
  id: string;
  name: string;
  chains: string[];
  tvl: number;
  change_1h?: number;
  change_1d?: number;
  change_7d?: number;
}

export interface ChainStats {
  tvl: number;
  protocols: number;
  change24h: number;
  volume24h?: number;
  dominance?: number;
}

export class DeFiLlamaService {
  private static readonly BASE_URL = 'https://api.llama.fi';
  
  /**
   * Get TVL data for all chains
   */
  static async getAllChainsTVL(): Promise<ChainTVL[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/v2/chains`);
      if (!response.ok) {
        throw new Error(`DeFiLlama API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch chains TVL:', error);
      return [];
    }
  }

  /**
   * Get specific chain data by name
   */
  static async getChainData(chainName: string): Promise<ChainStats | null> {
    try {
      const chains = await this.getAllChainsTVL();
      const normalizedName = chainName.toLowerCase();
      
      const chain = chains.find(c => 
        c.name.toLowerCase() === normalizedName ||
        c.name.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(c.name.toLowerCase())
      );
      
      if (!chain) {
        return null;
      }

      // Get historical data for 24h change
      const historicalResponse = await fetch(`${this.BASE_URL}/v2/historicalChainTvl/${chain.name}`);
      let change24h = 0;
      
      if (historicalResponse.ok) {
        const historical = await historicalResponse.json();
        if (historical.length >= 2) {
          const current = historical[historical.length - 1].tvl;
          const yesterday = historical[historical.length - 2].tvl;
          change24h = ((current - yesterday) / yesterday) * 100;
        }
      }

      // Get protocols count
      const protocolsResponse = await fetch(`${this.BASE_URL}/protocols`);
      let protocolsCount = 0;
      
      if (protocolsResponse.ok) {
        const protocols: ProtocolData[] = await protocolsResponse.json();
        protocolsCount = protocols.filter(p => 
          p.chains.some(c => c.toLowerCase() === chain.name.toLowerCase())
        ).length;
      }

      return {
        tvl: chain.tvl,
        protocols: protocolsCount,
        change24h: parseFloat(change24h.toFixed(2)),
        dominance: 0 // Could calculate from total TVL
      };
    } catch (error) {
      console.error(`Failed to fetch data for ${chainName}:`, error);
      return null;
    }
  }

  /**
   * Get top protocols on a specific chain
   */
  static async getChainProtocols(chainName: string, limit: number = 10): Promise<ProtocolData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/protocols`);
      if (!response.ok) {
        throw new Error(`DeFiLlama API error: ${response.status}`);
      }
      
      const protocols: ProtocolData[] = await response.json();
      const normalizedName = chainName.toLowerCase();
      
      return protocols
        .filter(p => p.chains.some(c => c.toLowerCase().includes(normalizedName)))
        .sort((a, b) => b.tvl - a.tvl)
        .slice(0, limit);
    } catch (error) {
      console.error(`Failed to fetch protocols for ${chainName}:`, error);
      return [];
    }
  }

  /**
   * Format TVL for display
   */
  static formatTVL(tvl: number): string {
    if (tvl >= 1_000_000_000) {
      return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
    } else if (tvl >= 1_000_000) {
      return `$${(tvl / 1_000_000).toFixed(2)}M`;
    } else if (tvl >= 1_000) {
      return `$${(tvl / 1_000).toFixed(2)}K`;
    } else {
      return `$${tvl.toFixed(2)}`;
    }
  }

  /**
   * Get chain rank by TVL
   */
  static async getChainRank(chainName: string): Promise<{ rank: number; total: number } | null> {
    try {
      const chains = await this.getAllChainsTVL();
      const sorted = chains.sort((a, b) => b.tvl - a.tvl);
      const normalizedName = chainName.toLowerCase();
      
      const index = sorted.findIndex(c => 
        c.name.toLowerCase() === normalizedName ||
        c.name.toLowerCase().includes(normalizedName)
      );
      
      if (index === -1) {
        return null;
      }
      
      return {
        rank: index + 1,
        total: chains.length
      };
    } catch (error) {
      console.error('Failed to get chain rank:', error);
      return null;
    }
  }
}

