'use client';

import { motion } from 'framer-motion';
import { Code, CheckCircle, TrendingUp, Sparkles, Zap } from 'lucide-react';

interface FeaturedChain {
  name: string;
  reason: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  emoji: string;
}

const featuredChains: FeaturedChain[] = [
  { name: 'Sonic', reason: 'New EVM L2 with high performance - quick win!', complexity: 'LOW', emoji: '⚡' },
  { name: 'Aptos', reason: 'Move-based chain with growing ecosystem', complexity: 'MEDIUM', emoji: '🚀' },
  { name: 'Starknet', reason: 'Leading ZK-rollup with strong adoption', complexity: 'MEDIUM', emoji: '🔷' },
  { name: 'Monad', reason: 'Upcoming high-performance EVM chain', complexity: 'LOW', emoji: '🌊' },
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
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  🔥 Integration Opportunity of the Day
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
        className="flex items-center justify-center gap-4 mb-8"
      >
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
          <Code className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black">Chain Integration Assessment</h1>
          <p className="text-gray-600">AI-powered blockchain integration analysis</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-8 text-sm text-gray-600"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>8 chains integrated</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span>98% success rate</span>
        </div>
      </motion.div>
    </div>
  );
}
