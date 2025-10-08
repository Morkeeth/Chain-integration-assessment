'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Search, Terminal, ArrowRight } from 'lucide-react';

interface MinimalAssessmentFormProps {
  onAnalyze: (chainName: string) => void;
  isLoading: boolean;
}

const recentChains = [
  'SUI', 'Babylon', 'Hedera', 'Base', 'Arbitrum', 'Celestia', 'Sei', 'Aptos'
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
          <p className="text-sm text-gray-500 mb-4 text-center">Recent integrations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {recentChains.map((chain) => (
              <button
                key={chain}
                onClick={() => handleChainClick(chain)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-black text-sm font-medium transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
