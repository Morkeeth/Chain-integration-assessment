'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

const recentIntegrations = [
  {
    name: "SUI",
    date: "2024 Q3",
    complexity: "MEDIUM",
    type: "Move-based",
    time: "10 days",
    icon: "🌊",
    gradient: "from-blue-400 to-cyan-400",
    features: ["Object-centric model", "Move smart contracts", "Narwhal consensus"]
  },
  {
    name: "Babylon",
    date: "2024 Q3",
    complexity: "HIGH",
    type: "Bitcoin Protocol",
    time: "20+ days",
    icon: "🏛️",
    gradient: "from-orange-400 to-amber-400",
    features: ["BTC staking", "Timestamp protocol", "Bitcoin security"]
  },
  {
    name: "Hedera",
    date: "2024 Q2",
    complexity: "MEDIUM-HIGH",
    type: "Hashgraph",
    time: "15 days",
    icon: "🔷",
    gradient: "from-purple-400 to-indigo-400",
    features: ["Hashgraph consensus", "Native tokens", "Smart contracts 2.0"]
  },
  {
    name: "Base",
    date: "2024 Q2",
    complexity: "LOW",
    type: "L2 EVM",
    time: "3 days",
    icon: "🔵",
    gradient: "from-blue-500 to-blue-600",
    features: ["Coinbase L2", "OP Stack", "EVM compatible"]
  },
  {
    name: "Arbitrum",
    date: "2024 Q2",
    complexity: "LOW",
    type: "L2 Rollup",
    time: "5 days",
    icon: "🔷",
    gradient: "from-indigo-400 to-purple-400",
    features: ["Optimistic rollup", "EVM compatible", "Low fees"]
  },
  {
    name: "Celestia",
    date: "2024 Q1",
    complexity: "MEDIUM",
    type: "Modular",
    time: "12 days",
    icon: "⭐",
    gradient: "from-yellow-400 to-orange-400",
    features: ["Data availability", "Sovereign rollups", "Light nodes"]
  },
  {
    name: "Sei",
    date: "2024 Q1",
    complexity: "LOW-MEDIUM",
    type: "Parallelized EVM",
    time: "8 days",
    icon: "⚡",
    gradient: "from-green-400 to-teal-400",
    features: ["Parallel execution", "EVM compatible", "High throughput"]
  },
  {
    name: "Aptos",
    date: "2024 Q1",
    complexity: "MEDIUM",
    type: "Move-based",
    time: "14 days",
    icon: "🦎",
    gradient: "from-emerald-400 to-green-400",
    features: ["Move VM", "Parallel execution", "Block-STM"]
  }
];

export function IntegrationsShowcase() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Recent Integrations</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Successfully integrated 8 major blockchain networks this year with a 98% success rate
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentIntegrations.map((chain, index) => (
          <motion.div
            key={chain.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer group"
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${chain.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{chain.icon}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  chain.complexity === 'LOW' && 'bg-green-100 text-green-700'
                } ${
                  chain.complexity === 'MEDIUM' && 'bg-yellow-100 text-yellow-700'
                } ${
                  chain.complexity === 'HIGH' && 'bg-red-100 text-red-700'
                } ${
                  chain.complexity === 'MEDIUM-HIGH' && 'bg-orange-100 text-orange-700'
                } ${
                  chain.complexity === 'LOW-MEDIUM' && 'bg-blue-100 text-blue-700'
                }`}>
                  {chain.complexity}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{chain.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{chain.type}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {chain.time}
                </span>
                <span>{chain.date}</span>
              </div>
              
              <div className="space-y-1">
                {chain.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">Click to analyze</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
