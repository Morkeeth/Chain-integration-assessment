'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Search, Terminal, ArrowRight } from 'lucide-react';

interface MinimalAssessmentFormProps {
  onAnalyze: (chainName: string) => void;
  isLoading: boolean;
}

// Based on https://www.ledger.com/supported-crypto-assets
// ✅ ALREADY SUPPORTED: Bitcoin, Ethereum, Solana, Cardano, Polygon, BNB Chain, Avalanche, 
//    Stellar, Cosmos, Polkadot, Tron, XRP, TON, SUI, Litecoin, Base, Arbitrum, 
//    Optimism, Aptos, zkSync, Sonic, etc.
// 🔥 IMMEDIATE PRIORITY: Berachain, Movement, Hyperliquid
// ⏰ Q3-Q4 2025: Monad

const recentChains = [
  'Berachain 🔥', 'Movement 🔥', 'Hyperliquid 🔥', 'Monad', 'Starknet', 'Base ✅', 'Arbitrum ✅', 'Aptos ✅'
];

export function MinimalAssessmentForm({ onAnalyze, isLoading }: MinimalAssessmentFormProps) {
  const [chainName, setChainName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chainName.trim()) {
      onAnalyze(chainName.trim());
    }
  };

  const handleChainClick = (chain: string) => {
    setChainName(chain);
    setShowSuggestions(false);
    onAnalyze(chain);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Chain Integration Assessment</h2>
          <p className="text-gray-600">
            Enter any blockchain name to get AI-powered integration analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chain Name Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={chainName}
              onChange={(e) => {
                setChainName(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              placeholder="Enter blockchain name (e.g., SUI, Babylon, Hedera...)"
              className="w-full pl-12 pr-4 h-14 text-lg bg-white border border-gray-300 rounded-xl text-black placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none transition-all"
              disabled={isLoading}
              autoFocus
            />
            
            {/* Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {recentChains
                  .filter(chain => chain.toLowerCase().includes(chainName.toLowerCase()))
                  .map((chain) => (
                    <button
                      key={chain}
                      onClick={() => handleChainClick(chain)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-black">{chain}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!chainName.trim() || isLoading}
            className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-xl transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Terminal className="h-5 w-5" />
                <span>Start Analysis</span>
              </div>
            )}
          </Button>
        </form>

        {/* Recent Chains */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-sm text-gray-500">Test with chains:</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded border border-green-200">✅ Supported</span>
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded border border-red-200 font-bold">🔥 IMMEDIATE</span>
              <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded border border-orange-200">Soon</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {recentChains.map((chain) => {
              const isSupported = chain.includes('✅');
              const isImmediate = chain.includes('🔥');
              const cleanName = chain.replace(' ✅', '').replace(' 🔥', '');
              
              let buttonClass = 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700';
              if (isSupported) {
                buttonClass = 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700';
              } else if (isImmediate) {
                buttonClass = 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700 font-bold';
              }
              
              return (
                <button
                  key={chain}
                  onClick={() => handleChainClick(cleanName)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${buttonClass}`}
                  disabled={isLoading}
                >
                  {chain}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Based on <a href="https://www.ledger.com/supported-crypto-assets" target="_blank" rel="noopener" className="underline hover:text-gray-600">Ledger's official list</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
