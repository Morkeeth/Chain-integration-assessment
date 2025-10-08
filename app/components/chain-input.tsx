'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, Zap, Database, Code } from 'lucide-react';

interface ChainInputProps {
  onAnalyze: (chainName: string) => void;
  isLoading: boolean;
}

export function ChainInput({ onAnalyze, isLoading }: ChainInputProps) {
  const [chainName, setChainName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chainName.trim()) {
      onAnalyze(chainName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ledger-black via-ledger-gray-900 to-ledger-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-ledger-orange rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Chain Integration Analyzer</h1>
          </div>
          <p className="text-xl text-ledger-gray-300 max-w-2xl mx-auto">
            Enter any blockchain network name and get instant Ledger integration analysis, 
            auto-discovered metadata, and ready-to-use code.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ledger-gray-400" />
              <Input
                value={chainName}
                onChange={(e) => setChainName(e.target.value)}
                placeholder="Enter blockchain name (e.g., Ethereum, Polygon, Arbitrum, Solana, Cosmos Hub...)"
                className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-ledger-gray-400 focus:border-ledger-orange focus:ring-ledger-orange/20"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!chainName.trim() || isLoading}
              className="w-full h-14 text-lg font-semibold bg-ledger-orange hover:bg-ledger-orange/90 text-white rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Chain...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  Analyze Chain Integration
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <Database className="h-8 w-8 text-ledger-orange mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Auto-Discovery</h3>
            <p className="text-ledger-gray-300 text-sm">
              Automatically finds RPC endpoints, chain IDs, block explorers, and official repositories
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <Zap className="h-8 w-8 text-ledger-green mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
            <p className="text-ledger-gray-300 text-sm">
              GPT-5 powered complexity assessment with real-time web search for latest data
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <Code className="h-8 w-8 text-ledger-yellow mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Ready Code</h3>
            <p className="text-ledger-gray-300 text-sm">
              Generated Ledger integration code with all variables, ready for copy-paste
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
