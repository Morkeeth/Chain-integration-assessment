'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Layers, 
  Bitcoin, 
  Hash, 
  Plus, 
  Download, 
  History,
  X,
  Command
} from 'lucide-react';

interface CommandPaletteProps {
  onChainSelect: (chain: string) => void;
  onNewAssessment: () => void;
  onSearchHistory: () => void;
  onExportReport: () => void;
}

export function CommandPalette({ 
  onChainSelect, 
  onNewAssessment, 
  onSearchHistory, 
  onExportReport 
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const recentChains = [
    { name: 'SUI', description: 'Move-based blockchain', icon: Layers, category: 'Recent Chains' },
    { name: 'Babylon', description: 'Bitcoin staking protocol', icon: Bitcoin, category: 'Recent Chains' },
    { name: 'Hedera', description: 'Hashgraph consensus', icon: Hash, category: 'Recent Chains' },
    { name: 'Base', description: 'Coinbase L2', icon: Layers, category: 'Recent Chains' },
    { name: 'Arbitrum', description: 'L2 rollup', icon: Layers, category: 'Recent Chains' },
    { name: 'Celestia', description: 'Modular blockchain', icon: Layers, category: 'Recent Chains' },
    { name: 'Sei', description: 'Parallelized EVM', icon: Layers, category: 'Recent Chains' },
    { name: 'Aptos', description: 'Move-based blockchain', icon: Layers, category: 'Recent Chains' }
  ];

  const actions = [
    { name: 'New Assessment', description: 'Start a new chain analysis', icon: Plus, action: onNewAssessment },
    { name: 'Search History', description: 'View previous assessments', icon: History, action: onSearchHistory },
    { name: 'Export Report', description: 'Download assessment report', icon: Download, action: onExportReport }
  ];

  const filteredChains = recentChains.filter(chain => 
    chain.name.toLowerCase().includes(query.toLowerCase()) ||
    chain.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter(action =>
    action.name.toLowerCase().includes(query.toLowerCase()) ||
    action.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleChainSelect = (chainName: string) => {
    onChainSelect(chainName);
    setOpen(false);
    setQuery('');
  };

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chains, assessments, or actions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-400"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {/* Recent Chains */}
                {filteredChains.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recent Chains
                    </div>
                    {filteredChains.map((chain, index) => {
                      const Icon = chain.icon;
                      return (
                        <button
                          key={chain.name}
                          onClick={() => handleChainSelect(chain.name)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-violet-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-black">{chain.name}</div>
                            <div className="text-sm text-gray-500">{chain.description}</div>
                          </div>
                          <div className="text-xs text-gray-400">Press Enter</div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Actions */}
                {filteredActions.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </div>
                    {filteredActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.name}
                          onClick={() => handleAction(action.action)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-black">{action.name}</div>
                            <div className="text-sm text-gray-500">{action.description}</div>
                          </div>
                          <div className="text-xs text-gray-400">Press Enter</div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* No results */}
                {filteredChains.length === 0 && filteredActions.length === 0 && query && (
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No results found for "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                    <span>to open</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>↑↓</span>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>↵</span>
                    <span>to select</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  ESC to close
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
