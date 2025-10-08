'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Search, Settings, History } from 'lucide-react';

interface NavbarProps {
  onSearchClick: () => void;
  onHistoryClick: () => void;
}

export function Navbar({ onSearchClick, onHistoryClick }: NavbarProps) {
  return (
    <nav className="bg-ledger-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ledger-orange rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-xl font-bold">Chain Integration Assessment</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearchClick}
            className="text-white hover:bg-ledger-gray-800"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onHistoryClick}
            className="text-white hover:bg-ledger-gray-800"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-ledger-gray-800"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
