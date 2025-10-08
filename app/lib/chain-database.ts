import { ChainMetadata } from '@/app/types/assessment';

export const knownChains: ChainMetadata[] = [
  // EVM Chains
  {
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
  {
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
  {
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
  {
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
  {
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
  {
    name: 'BSC',
    ticker: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    iconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    chainId: '56',
    explorerUrl: 'https://bscscan.com',
    githubRepo: 'https://github.com/bnb-chain/bsc',
    chainType: 'EVM',
    isTestnet: false,
  },
  {
    name: 'Avalanche',
    ticker: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    iconUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    chainId: '43114',
    explorerUrl: 'https://snowtrace.io',
    githubRepo: 'https://github.com/ava-labs/avalanchego',
    chainType: 'EVM',
    isTestnet: false,
  },

  // Cosmos Chains
  {
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
  {
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
  {
    name: 'Juno',
    ticker: 'JUNO',
    rpcUrl: 'https://rpc-juno.itastakers.com',
    iconUrl: 'https://cryptologos.cc/logos/juno-network-juno-logo.png',
    chainId: 'juno-1',
    explorerUrl: 'https://www.mintscan.io/juno',
    githubRepo: 'https://github.com/CosmosContracts/juno',
    chainType: 'Cosmos',
    isTestnet: false,
  },

  // Solana
  {
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

  // Bitcoin
  {
    name: 'Bitcoin',
    ticker: 'BTC',
    rpcUrl: 'https://blockstream.info/api',
    iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    chainId: 'bitcoin',
    explorerUrl: 'https://blockstream.info',
    githubRepo: 'https://github.com/bitcoin/bitcoin',
    chainType: 'Bitcoin',
    isTestnet: false,
  },

  // Testnets
  {
    name: 'Ethereum Sepolia',
    ticker: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    chainId: '11155111',
    explorerUrl: 'https://sepolia.etherscan.io',
    githubRepo: 'https://github.com/ethereum/go-ethereum',
    chainType: 'EVM',
    isTestnet: true,
  },
  {
    name: 'Polygon Mumbai',
    ticker: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    iconUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    chainId: '80001',
    explorerUrl: 'https://mumbai.polygonscan.com',
    githubRepo: 'https://github.com/maticnetwork/bor',
    chainType: 'EVM',
    isTestnet: true,
  },
];

export function searchChains(query: string, chainType?: string): ChainMetadata[] {
  let results = knownChains;
  
  if (query) {
    results = results.filter(chain => 
      chain.name.toLowerCase().includes(query.toLowerCase()) ||
      chain.ticker.toLowerCase().includes(query.toLowerCase()) ||
      chain.chainId.includes(query)
    );
  }
  
  if (chainType) {
    results = results.filter(chain => chain.chainType === chainType);
  }
  
  return results;
}

export function getChainByTicker(ticker: string): ChainMetadata | undefined {
  return knownChains.find(chain => chain.ticker.toLowerCase() === ticker.toLowerCase());
}

export function getChainByName(name: string): ChainMetadata | undefined {
  return knownChains.find(chain => chain.name.toLowerCase() === name.toLowerCase());
}
