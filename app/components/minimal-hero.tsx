'use client';

import { motion } from 'framer-motion';
import { Code, CheckCircle, TrendingUp } from 'lucide-react';

export function MinimalHero() {
  return (
    <div className="text-center mb-16">
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
