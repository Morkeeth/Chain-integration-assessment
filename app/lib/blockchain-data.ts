// Real blockchain data sources and APIs
import { DeFiLlamaService, ChainStats } from './defilama-api';
import { ChainListService } from './chainlist-api';

export interface BlockchainInfo {
  name: string;
  ticker: string;
  rpcUrl: string;
  iconUrl: string;
  chainId: string;
  explorerUrl: string;
  githubRepo: string;
  chainType: string;
  isTestnet: boolean;
  marketCap?: number;
  price?: number;
  lastUpdated?: string;
  // Real-time data from APIs
  tvl?: number;
  tvlFormatted?: string;
  protocols?: number;
  change24h?: number;
  chainRank?: number;
  totalChains?: number;
}

export class BlockchainDataService {
  private static readonly KNOWN_CHAINS: Record<string, BlockchainInfo> = {
    'ethereum': {
      name: 'Ethereum',
      ticker: 'ETH',
      rpcUrl: 'https://eth.llamarpc.com',
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      chainId: '1',
      explorerUrl: 'https://etherscan.io',
      githubRepo: 'https://github.com/ethereum/go-ethereum',
      chainType: 'EVM',
      isTestnet: false,
    },
    'polygon': {
      name: 'Polygon',
      ticker: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      iconUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      chainId: '137',
      explorerUrl: 'https://polygonscan.com',
      githubRepo: 'https://github.com/maticnetwork/bor',
      chainType: 'EVM',
      isTestnet: false,
    },
    'arbitrum': {
      name: 'Arbitrum',
      ticker: 'ETH',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      iconUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
      chainId: '42161',
      explorerUrl: 'https://arbiscan.io',
      githubRepo: 'https://github.com/OffchainLabs/arbitrum',
      chainType: 'EVM',
      isTestnet: false,
    },
    'optimism': {
      name: 'Optimism',
      ticker: 'ETH',
      rpcUrl: 'https://mainnet.optimism.io',
      iconUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
      chainId: '10',
      explorerUrl: 'https://optimistic.etherscan.io',
      githubRepo: 'https://github.com/ethereum-optimism/optimism',
      chainType: 'EVM',
      isTestnet: false,
    },
    'base': {
      name: 'Base',
      ticker: 'ETH',
      rpcUrl: 'https://mainnet.base.org',
      iconUrl: 'https://cryptologos.cc/logos/base-base-logo.png',
      chainId: '8453',
      explorerUrl: 'https://basescan.org',
      githubRepo: 'https://github.com/base-org',
      chainType: 'EVM',
      isTestnet: false,
    },
    'solana': {
      name: 'Solana',
      ticker: 'SOL',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      chainId: 'mainnet-beta',
      explorerUrl: 'https://explorer.solana.com',
      githubRepo: 'https://github.com/solana-labs/solana',
      chainType: 'Solana',
      isTestnet: false,
    },
    'cosmos hub': {
      name: 'Cosmos Hub',
      ticker: 'ATOM',
      rpcUrl: 'https://rpc-cosmoshub.blockapsis.com',
      iconUrl: 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
      chainId: 'cosmoshub-4',
      explorerUrl: 'https://www.mintscan.io/cosmos',
      githubRepo: 'https://github.com/cosmos/cosmos-sdk',
      chainType: 'Cosmos',
      isTestnet: false,
    },
    'osmosis': {
      name: 'Osmosis',
      ticker: 'OSMO',
      rpcUrl: 'https://rpc.osmosis.zone',
      iconUrl: 'https://cryptologos.cc/logos/osmosis-osmo-logo.png',
      chainId: 'osmosis-1',
      explorerUrl: 'https://www.mintscan.io/osmosis',
      githubRepo: 'https://github.com/osmosis-labs/osmosis',
      chainType: 'Cosmos',
      isTestnet: false,
    },
    'flare': {
      name: 'Flare',
      ticker: 'FLR',
      rpcUrl: 'https://flare-api.flare.network/ext/C/rpc',
      iconUrl: 'https://cryptologos.cc/logos/flare-flr-logo.png',
      chainId: '14',
      explorerUrl: 'https://flare-explorer.flare.network',
      githubRepo: 'https://github.com/flare-foundation',
      chainType: 'EVM',
      isTestnet: false,
    },
    'babylon': {
      name: 'Babylon',
      ticker: 'BBN',
      rpcUrl: 'https://rpc.babylonchain.io',
      iconUrl: 'https://cryptologos.cc/logos/babylon-bbn-logo.png',
      chainId: 'bbn-1',
      explorerUrl: 'https://explorer.babylonchain.io',
      githubRepo: 'https://github.com/babylonchain',
      chainType: 'Cosmos',
      isTestnet: false,
    },
    'berachain': {
      name: 'Berachain',
      ticker: 'BERA',
      rpcUrl: 'https://rpc.berachain.com',
      iconUrl: 'https://cryptologos.cc/logos/berachain-logo.png',
      chainId: '80084',
      explorerUrl: 'https://bartio.beratrail.io',
      githubRepo: 'https://github.com/berachain',
      chainType: 'EVM',
      isTestnet: false,
    },
    'movement': {
      name: 'Movement',
      ticker: 'MOVE',
      rpcUrl: 'https://mevm.devnet.imola.movementlabs.xyz',
      iconUrl: 'https://cryptologos.cc/logos/movement-logo.png',
      chainId: '30732',
      explorerUrl: 'https://explorer.devnet.imola.movementlabs.xyz',
      githubRepo: 'https://github.com/movementlabsxyz',
      chainType: 'Move-EVM',
      isTestnet: false,
    },
    'monad': {
      name: 'Monad',
      ticker: 'MON',
      rpcUrl: 'To be announced at mainnet',
      iconUrl: 'https://cryptologos.cc/logos/monad-logo.png',
      chainId: 'TBA',
      explorerUrl: 'To be announced at mainnet',
      githubRepo: 'https://github.com/monad-labs',
      chainType: 'EVM',
      isTestnet: false,
    },
    'hyperliquid': {
      name: 'Hyperliquid',
      ticker: 'HYPE',
      rpcUrl: 'https://api.hyperliquid.xyz',
      iconUrl: 'https://cryptologos.cc/logos/hyperliquid-logo.png',
      chainId: 'hyperliquid-1',
      explorerUrl: 'https://app.hyperliquid.xyz',
      githubRepo: 'https://github.com/hyperliquid-dex',
      chainType: 'Custom L1',
      isTestnet: false,
    },
    'starknet': {
      name: 'Starknet',
      ticker: 'STRK',
      rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
      iconUrl: 'https://cryptologos.cc/logos/starknet-logo.png',
      chainId: 'SN_MAIN',
      explorerUrl: 'https://starkscan.co',
      githubRepo: 'https://github.com/starkware-libs',
      chainType: 'Cairo/ZK',
      isTestnet: false,
    },
    'bittensor': {
      name: 'Bittensor',
      ticker: 'TAO',
      rpcUrl: 'wss://entrypoint-finney.opentensor.ai:9944',
      iconUrl: 'https://cryptologos.cc/logos/bittensor-logo.png',
      chainId: 'bittensor-1',
      explorerUrl: 'https://taostats.io',
      githubRepo: 'https://github.com/opentensor/bittensor',
      chainType: 'Substrate',
      isTestnet: false,
    }
  };

  static async getChainInfo(chainName: string): Promise<BlockchainInfo> {
    const normalizedName = chainName.toLowerCase();
    let baseInfo = this.KNOWN_CHAINS[normalizedName];
    
    // Try to find by partial match if not found
    if (!baseInfo) {
      for (const [key, value] of Object.entries(this.KNOWN_CHAINS)) {
        if (key.includes(normalizedName) || normalizedName.includes(key)) {
          baseInfo = value;
          break;
        }
      }
    }

    // Try to fetch real data from ChainList
    let chainListData;
    try {
      chainListData = await ChainListService.getChainInfo(chainName);
    } catch (error) {
      console.error('ChainList API error:', error);
    }

    // Try to fetch TVL data from DeFiLlama
    let defiLlamaData: ChainStats | null = null;
    let chainRank: { rank: number; total: number } | null = null;
    try {
      defiLlamaData = await DeFiLlamaService.getChainData(chainName);
      chainRank = await DeFiLlamaService.getChainRank(chainName);
    } catch (error) {
      console.error('DeFiLlama API error:', error);
    }

    // Merge data with priority: ChainList > KNOWN_CHAINS > defaults
    const result: BlockchainInfo = {
      name: chainListData?.name || baseInfo?.name || chainName,
      ticker: chainListData?.symbol || baseInfo?.ticker || 'TBD',
      rpcUrl: chainListData?.rpcUrls[0] || baseInfo?.rpcUrl || 'To be discovered',
      iconUrl: baseInfo?.iconUrl || '',
      chainId: chainListData?.chainId?.toString() || baseInfo?.chainId || 'To be discovered',
      explorerUrl: chainListData?.explorers[0]?.url || baseInfo?.explorerUrl || 'To be discovered',
      githubRepo: baseInfo?.githubRepo || 'To be discovered',
      chainType: chainListData?.isEVM ? 'EVM' : (baseInfo?.chainType || 'To be analyzed'),
      isTestnet: baseInfo?.isTestnet || false,
      // Real-time data
      tvl: defiLlamaData?.tvl,
      tvlFormatted: defiLlamaData?.tvl ? DeFiLlamaService.formatTVL(defiLlamaData.tvl) : undefined,
      protocols: defiLlamaData?.protocols,
      change24h: defiLlamaData?.change24h,
      chainRank: chainRank?.rank,
      totalChains: chainRank?.total,
    };

    return result;
  }

  static async getMarketData(ticker: string): Promise<{ price?: number; marketCap?: number }> {
    try {
      // In a real implementation, you would call CoinGecko API or similar
      // For now, return mock data
      const mockPrices: Record<string, { price: number; marketCap: number }> = {
        'ETH': { price: 2500, marketCap: 300000000000 },
        'MATIC': { price: 0.8, marketCap: 8000000000 },
        'SOL': { price: 100, marketCap: 45000000000 },
        'ATOM': { price: 8, marketCap: 3000000000 },
        'FLR': { price: 0.02, marketCap: 200000000 },
        'BBN': { price: 0.5, marketCap: 50000000 },
        'FOGO': { price: 0.1, marketCap: 10000000 },
      };

      return mockPrices[ticker] || {};
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return {};
    }
  }

  static async getNetworkStatus(rpcUrl: string): Promise<{ status: 'online' | 'offline' | 'unknown'; latency?: number }> {
    try {
      const start = Date.now();
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      
      if (response.ok) {
        const latency = Date.now() - start;
        return { status: 'online', latency };
      } else {
        return { status: 'offline' };
      }
    } catch (error) {
      return { status: 'unknown' };
    }
  }

  static async getDocumentationQuality(chainName: string): Promise<'Excellent' | 'Good' | 'Fair' | 'Poor'> {
    // In a real implementation, you would analyze documentation
    const excellentChains = ['ethereum', 'bitcoin', 'polygon', 'arbitrum'];
    const goodChains = ['solana', 'cosmos hub', 'osmosis'];
    const fairChains = ['optimism', 'base'];
    
    const normalized = chainName.toLowerCase();
    
    if (excellentChains.some(chain => normalized.includes(chain))) {
      return 'Excellent';
    } else if (goodChains.some(chain => normalized.includes(chain))) {
      return 'Good';
    } else if (fairChains.some(chain => normalized.includes(chain))) {
      return 'Fair';
    } else {
      return 'Poor';
    }
  }
}
