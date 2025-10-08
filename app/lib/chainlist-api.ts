// ChainList API integration for verified chain data

export interface ChainListData {
  name: string;
  chain: string;
  icon?: string;
  rpc: string[];
  faucets: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  slip44?: number;
  ens?: { registry: string };
  explorers?: Array<{
    name: string;
    url: string;
    standard: string;
    icon?: string;
  }>;
}

export class ChainListService {
  private static readonly BASE_URL = 'https://chainid.network/chains.json';
  private static cache: ChainListData[] | null = null;
  private static cacheTime: number = 0;
  private static readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  /**
   * Get all chains from ChainList
   */
  static async getAllChains(): Promise<ChainListData[]> {
    try {
      // Use cache if available and fresh
      if (this.cache && Date.now() - this.cacheTime < this.CACHE_DURATION) {
        return this.cache;
      }

      const response = await fetch(this.BASE_URL);
      if (!response.ok) {
        throw new Error(`ChainList API error: ${response.status}`);
      }
      
      const chains: ChainListData[] = await response.json();
      this.cache = chains;
      this.cacheTime = Date.now();
      
      return chains;
    } catch (error) {
      console.error('Failed to fetch chains from ChainList:', error);
      return [];
    }
  }

  /**
   * Find chain by name or chain ID
   */
  static async findChain(identifier: string | number): Promise<ChainListData | null> {
    try {
      const chains = await this.getAllChains();
      
      if (typeof identifier === 'number') {
        return chains.find(c => c.chainId === identifier) || null;
      }
      
      const normalizedName = identifier.toLowerCase();
      
      // Try exact match first
      let chain = chains.find(c => 
        c.name.toLowerCase() === normalizedName ||
        c.chain.toLowerCase() === normalizedName ||
        c.shortName.toLowerCase() === normalizedName
      );
      
      // Try partial match if no exact match
      if (!chain) {
        chain = chains.find(c => 
          c.name.toLowerCase().includes(normalizedName) ||
          c.chain.toLowerCase().includes(normalizedName) ||
          normalizedName.includes(c.name.toLowerCase())
        );
      }
      
      return chain || null;
    } catch (error) {
      console.error(`Failed to find chain ${identifier}:`, error);
      return null;
    }
  }

  /**
   * Get verified RPC endpoints for a chain
   */
  static async getRPCEndpoints(chainName: string): Promise<string[]> {
    const chain = await this.findChain(chainName);
    if (!chain) {
      return [];
    }
    
    // Filter out localhost and template URLs
    return chain.rpc.filter(rpc => 
      !rpc.includes('localhost') &&
      !rpc.includes('127.0.0.1') &&
      !rpc.includes('${') // Template strings
    );
  }

  /**
   * Get block explorers for a chain
   */
  static async getExplorers(chainName: string): Promise<Array<{ name: string; url: string }>> {
    const chain = await this.findChain(chainName);
    if (!chain || !chain.explorers) {
      return [];
    }
    
    return chain.explorers.map(e => ({
      name: e.name,
      url: e.url
    }));
  }

  /**
   * Get native currency info
   */
  static async getNativeCurrency(chainName: string): Promise<{ name: string; symbol: string; decimals: number } | null> {
    const chain = await this.findChain(chainName);
    return chain?.nativeCurrency || null;
  }

  /**
   * Check if chain is EVM compatible
   */
  static async isEVMCompatible(chainName: string): Promise<boolean> {
    const chain = await this.findChain(chainName);
    if (!chain) {
      return false;
    }
    
    // If it has a chainId and uses standard Ethereum RPC, it's likely EVM
    return chain.chainId !== undefined && 
           chain.rpc.some(rpc => rpc.includes('http') || rpc.includes('wss'));
  }

  /**
   * Get comprehensive chain info
   */
  static async getChainInfo(chainName: string): Promise<{
    chainId: number | string;
    name: string;
    symbol: string;
    rpcUrls: string[];
    explorers: Array<{ name: string; url: string }>;
    isEVM: boolean;
    infoUrl: string;
  } | null> {
    const chain = await this.findChain(chainName);
    if (!chain) {
      return null;
    }
    
    const rpcUrls = await this.getRPCEndpoints(chainName);
    const explorers = await this.getExplorers(chainName);
    const isEVM = await this.isEVMCompatible(chainName);
    
    return {
      chainId: chain.chainId,
      name: chain.name,
      symbol: chain.nativeCurrency.symbol,
      rpcUrls,
      explorers,
      isEVM,
      infoUrl: chain.infoURL
    };
  }
}

