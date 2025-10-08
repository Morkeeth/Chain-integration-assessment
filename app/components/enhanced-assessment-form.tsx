'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { 
  Search, 
  Sparkle, 
  Layers, 
  Terminal, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Database,
  Globe,
  Code
} from 'lucide-react';

interface EnhancedAssessmentFormProps {
  onAnalyze: (chainName: string) => void;
  isLoading: boolean;
}

const chainTypes = [
  { value: 'evm', label: 'EVM', icon: '⟠', description: 'Ethereum Virtual Machine' },
  { value: 'cosmos', label: 'Cosmos', icon: '⚛️', description: 'Cosmos SDK' },
  { value: 'move', label: 'Move', icon: '🌊', description: 'Move VM' },
  { value: 'custom', label: 'Custom', icon: '⚡', description: 'Custom consensus' }
];

const recentChains = [
  'SUI', 'Babylon', 'Hedera', 'Base', 'Arbitrum', 'Celestia', 'Sei', 'Aptos'
];

export function EnhancedAssessmentForm({ onAnalyze, isLoading }: EnhancedAssessmentFormProps) {
  const [chainName, setChainName] = useState('');
  const [selectedType, setSelectedType] = useState('evm');
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

  const getComplexityPrediction = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ethereum') || lowerName.includes('base') || lowerName.includes('arbitrum')) return 'LOW';
    if (lowerName.includes('sui') || lowerName.includes('aptos') || lowerName.includes('celestia')) return 'MEDIUM';
    if (lowerName.includes('babylon') || lowerName.includes('hedera')) return 'HIGH';
    return 'MEDIUM';
  };

  const predictedComplexity = getComplexityPrediction(chainName);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <Sparkle className="w-6 h-6 text-violet-500" />
            Chain Assessment
          </h3>
          
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
                className="w-full pl-12 pr-4 h-16 text-lg bg-white border border-gray-300 rounded-xl text-black placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all"
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
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="font-medium">{chain}</span>
                        <span className="text-sm text-gray-500">
                          {getComplexityPrediction(chain)} complexity
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Chain Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chain Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {chainTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedType === type.value
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium text-black">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity Prediction */}
            {chainName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span className="font-medium text-black">Predicted Complexity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    predictedComplexity === 'LOW' ? 'bg-green-100 text-green-700' :
                    predictedComplexity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {predictedComplexity}
                  </span>
                  <span className="text-sm text-gray-600">
                    Based on similar integrations
                  </span>
                </div>
              </motion.div>
            )}
            
            <Button
              type="submit"
              disabled={!chainName.trim() || isLoading}
              className="w-full h-16 text-lg font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all"
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
        </div>
      </motion.div>

      {/* Live Preview Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-8"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
            <Code className="h-5 w-5 text-violet-500" />
            Live Preview
          </h3>
          
          {chainName ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-black mb-2">Chain Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{chainName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{chainTypes.find(t => t.value === selectedType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted Complexity:</span>
                    <span className={`font-medium ${
                      predictedComplexity === 'LOW' ? 'text-green-600' :
                      predictedComplexity === 'MEDIUM' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {predictedComplexity}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-violet-50 rounded-xl p-4">
                <h4 className="font-semibold text-violet-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  What You'll Get
                </h4>
                <ul className="space-y-1 text-sm text-violet-700">
                  <li>• AI-powered complexity analysis</li>
                  <li>• Auto-discovered metadata (RPC, explorer, GitHub)</li>
                  <li>• Generated Ledger integration code</li>
                  <li>• Implementation timeline and checklist</li>
                  <li>• Risk assessment and recommendations</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter a blockchain name to see live preview</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
