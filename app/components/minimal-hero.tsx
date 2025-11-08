'use client';

import { motion } from 'framer-motion';
import { Code, CheckCircle, TrendingUp, Sparkles, Zap } from 'lucide-react';

interface FeaturedChain {
  name: string;
  reason: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  emoji: string;
  isSupported: boolean;
}

// Based on https://www.ledger.com/supported-crypto-assets
// ALREADY SUPPORTED: Bitcoin, Ethereum, Tether, XRP, Solana, Cardano, Dogecoin, Tron, Polkadot, 
// Polygon, BNB Chain, Avalanche, Stellar, Bitcoin Cash, TON, SUI, Chainlink, Litecoin, Cosmos,
// Base, Arbitrum, Optimism, zkSync, Aptos, Sonic, etc.
// 
// HIGH-PRIORITY NOT YET SUPPORTED:

const featuredChains: FeaturedChain[] = [
  // IMMEDIATE PRIORITY - Already live with massive adoption
  { name: 'Berachain', reason: 'Live mainnet, massive TVL, EVM-compatible - IMMEDIATE', complexity: 'LOW', emoji: '🐻', isSupported: false },
  { name: 'Movement', reason: 'Live beta, unique Move-EVM bridge - IMMEDIATE', complexity: 'MEDIUM', emoji: '⚡', isSupported: false },
  { name: 'Hyperliquid', reason: 'Major DEX with high usage - IMMEDIATE', complexity: 'MEDIUM', emoji: '💧', isSupported: false },
  
  // Q3-Q4 2025 - High potential
  { name: 'Monad', reason: '$244M funded, 240+ projects waiting - Q3-Q4 2025', complexity: 'LOW', emoji: '🌊', isSupported: false },
  
  // Other opportunities
  { name: 'Starknet', reason: 'Leading ZK-rollup with Cairo VM', complexity: 'MEDIUM', emoji: '🔷', isSupported: false },
  { name: 'Bittensor', reason: 'Decentralized AI network', complexity: 'MEDIUM', emoji: '🧠', isSupported: false },
];

export function MinimalHero() {
  // Rotate featured chain (changes daily based on date)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const featuredChain = featuredChains[dayOfYear % featuredChains.length];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'LOW': return 'from-green-100 to-emerald-100 text-green-700';
      case 'MEDIUM': return 'from-yellow-100 to-orange-100 text-orange-700';
      case 'HIGH': return 'from-red-100 to-pink-100 text-red-700';
      default: return 'from-purple-100 to-pink-100 text-purple-700';
    }
  };

  return (
    <div className="text-center mb-16">
      {/* Featured Chain Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 inline-block"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-white rounded-2xl px-6 py-4 border-2 border-black shadow-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
              <div className="text-left">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  🔥 Integration Opportunity of the Day
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">
                    NOT YET SUPPORTED
                  </span>
                </div>
                <div className="text-lg font-bold text-black">
                  {featuredChain.emoji} {featuredChain.name}
                  <span className={`ml-2 text-xs font-normal px-2 py-1 bg-gradient-to-r ${getComplexityColor(featuredChain.complexity)} rounded-full`}>
                    {featuredChain.complexity}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {featuredChain.reason}
                </div>
              </div>
              <Zap className="h-6 w-6 text-yellow-500 ml-2 animate-bounce" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 mb-4"
      >
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
          <Code className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black">Chain Integration Assessor</h1>
          <p className="text-gray-600">Rule-based early sales assessment tool</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-blue-900 text-sm mb-1">Sales-First Approach</div>
              <div className="text-blue-700 text-xs">Get instant, deterministic complexity assessment for sales conversations. No AI guesswork - pure rules.</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">Instant Assessment</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">Business Metrics</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-gray-700">Clear Next Steps</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Code className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">Optional Deep Dive</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
