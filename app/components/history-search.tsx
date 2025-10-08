'use client';

import { useState } from 'react';
import { HistoricalAssessment, SearchFilters } from '@/app/types/assessment';
import { searchHistoricalAssessments } from '@/app/lib/knowledge-base';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { getComplexityColor, formatDate } from '@/app/lib/utils';
import { Search, X, ExternalLink } from 'lucide-react';

interface HistorySearchProps {
  onClose: () => void;
  onSelectAssessment: (assessment: HistoricalAssessment) => void;
}

export function HistorySearch({ onClose, onSelectAssessment }: HistorySearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<HistoricalAssessment[]>([]);

  const handleSearch = () => {
    const searchResults = searchHistoricalAssessments(query, filters);
    setResults(searchResults);
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
    setResults([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-ledger-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ledger-black">Search Historical Assessments</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by chain name, type, or content..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
            
            <div className="flex gap-4">
              <Select
                value={filters.chainType || ''}
                onChange={(e) => setFilters({ ...filters, chainType: e.target.value as any || undefined })}
              >
                <option value="">All Chain Types</option>
                <option value="EVM">EVM</option>
                <option value="Cosmos">Cosmos</option>
                <option value="Custom">Custom</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Solana">Solana</option>
                <option value="Other">Other</option>
              </Select>
              
              <Select
                value={filters.complexity || ''}
                onChange={(e) => setFilters({ ...filters, complexity: e.target.value as any || undefined })}
              >
                <option value="">All Complexity Levels</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </Select>
              
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          {results.length === 0 ? (
            <div className="text-center py-8 text-ledger-gray-500">
              {query || Object.keys(filters).length > 0 
                ? 'No assessments found matching your criteria'
                : 'Enter a search query to find historical assessments'
              }
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((assessment) => (
                <div
                  key={assessment.id}
                  className="border border-ledger-gray-200 rounded-lg p-4 hover:bg-ledger-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectAssessment(assessment)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-ledger-black">
                      {assessment.chainName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={assessment.complexity === 'LOW' ? 'success' : assessment.complexity === 'MEDIUM' ? 'warning' : 'destructive'}
                      >
                        {assessment.complexity}
                      </Badge>
                      <span className="text-sm text-ledger-gray-500">
                        {formatDate(assessment.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-ledger-gray-600">
                      Type: {assessment.chainType}
                    </span>
                    <span className="text-sm text-ledger-gray-600">
                      Timeframe: {assessment.result.estimatedTimeframe}
                    </span>
                    <span className="text-sm text-ledger-gray-600">
                      Confidence: {assessment.result.confidence}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-ledger-gray-700 line-clamp-2">
                    {assessment.result.technicalReasoning}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAssessment(assessment);
                      }}
                      className="text-ledger-orange hover:text-ledger-orange/80"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
