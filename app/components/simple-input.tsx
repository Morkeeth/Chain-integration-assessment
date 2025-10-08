'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Search, Code, Database, Globe, ArrowRight, CheckCircle, Zap, Terminal, GitBranch } from 'lucide-react';

interface SimpleInputProps {
  onAnalyze: (chainName: string) => void;
  isLoading: boolean;
}

export function SimpleInput({ onAnalyze, isLoading }: SimpleInputProps) {
  const [chainName, setChainName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chainName.trim()) {
      onAnalyze(chainName.trim());
    }
  };

  const handleBoxClick = (chainName: string) => {
    setChainName(chainName);
    onAnalyze(chainName);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-gray-200">
              <Code className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-black mb-2">Chain Integration Analyzer</h1>
              <p className="text-gray-600 text-lg">Internal Ledger Development Tool</p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Analyze blockchain integration complexity with AI-powered assessment, auto-discovered metadata, and generated Ledger integration code.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={chainName}
                onChange={(e) => setChainName(e.target.value)}
                placeholder="Enter blockchain name (e.g., Ethereum, Polygon, Arbitrum, Solana, Cosmos Hub...)"
                className="w-full pl-12 pr-4 h-16 text-lg bg-white border border-gray-300 rounded-xl text-black placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 focus:outline-none transition-all"
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <Button
              type="submit"
              disabled={!chainName.trim() || isLoading}
              className="w-full h-16 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-xl transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Terminal className="h-5 w-5" />
                  <span>Analyze Chain Integration</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Featured Examples */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-black mb-8 text-center">Featured Blockchain Networks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                name: 'Flare', 
                description: 'High complexity integration with custom consensus', 
                complexity: 'HIGH',
                color: 'from-gray-100 to-gray-50',
                borderColor: 'border-gray-200',
                icon: Database
              },
              { 
                name: 'Babylon', 
                description: 'Cosmos-based chain with IBC support', 
                complexity: 'MEDIUM',
                color: 'from-gray-100 to-gray-50',
                borderColor: 'border-gray-200',
                icon: Globe
              },
              { 
                name: 'Fogo', 
                description: 'Custom blockchain with unique features', 
                complexity: 'HIGH',
                color: 'from-gray-100 to-gray-50',
                borderColor: 'border-gray-200',
                icon: Code
              }
            ].map((example) => (
              <button
                key={example.name}
                onClick={() => handleBoxClick(example.name)}
                className={`p-8 rounded-2xl bg-gradient-to-br ${example.color} border ${example.borderColor} hover:scale-105 transition-all duration-300 text-left group cursor-pointer hover:border-black`}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                      <example.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-black">{example.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        example.complexity === 'HIGH' ? 'bg-red-100 text-red-800' :
                        example.complexity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {example.complexity} COMPLEXITY
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <p className="text-sm text-gray-600 mb-4">{example.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <GitBranch className="h-3 w-3" />
                  <span>Click to analyze</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Other Examples */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-black mb-6 text-center">Other Popular Chains</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Ethereum', 'Polygon', 'Solana', 'Cosmos Hub', 'Arbitrum', 'Optimism', 'Base'].map((example) => (
              <button
                key={example}
                onClick={() => handleBoxClick(example)}
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 hover:border-black rounded-xl text-black text-sm font-medium transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-3">Auto-Discovery</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Automatically finds RPC endpoints, chain IDs, block explorers, and official repositories
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-3">AI Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              GPT-4 powered complexity assessment with real-time analysis and recommendations
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Terminal className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-3">Ready Code</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Generated Ledger integration code with all variables, ready for copy-paste
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}