'use client';

import { motion } from 'framer-motion';
import { Rocket, TrendingUp, CheckCircle, Zap } from 'lucide-react';

const stats = [
  {
    title: "Latest Integration",
    value: "SUI",
    change: "+2 this week",
    icon: Rocket,
    gradient: "from-blue-500 to-cyan-500",
    description: "Move-based blockchain with object-centric storage"
  },
  {
    title: "Babylon",
    value: "High",
    subtitle: "BTC Staking",
    icon: TrendingUp,
    gradient: "from-orange-500 to-yellow-500",
    description: "Bitcoin staking protocol with timestamp services"
  },
  {
    title: "Hedera",
    value: "Medium",
    subtitle: "Hashgraph",
    icon: CheckCircle,
    gradient: "from-purple-500 to-pink-500",
    description: "aBFT consensus with native tokenization"
  },
  {
    title: "Success Rate",
    value: "98%",
    change: "+5% vs last month",
    icon: Zap,
    gradient: "from-green-500 to-emerald-500",
    description: "Integration success rate across all chains"
  }
];

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10 animate-gradient" />
      
      {/* Glass card with stats */}
      <div className="relative backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-glow">
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-black mb-4"
          >
            Chain Integration Assessment
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            AI-powered blockchain integration analysis with real-time assessment, 
            auto-discovered metadata, and ready-to-use Ledger integration code.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {stat.change && (
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-black">{stat.value}</span>
                    {stat.subtitle && (
                      <span className="text-sm text-gray-500">{stat.subtitle}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
