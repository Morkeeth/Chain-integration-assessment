// Analysis history and caching service using localStorage

export interface AnalysisHistoryEntry {
  id: string;
  chainName: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedTimeframe: string;
  timestamp: number;
  tvl?: number;
  tvlFormatted?: string;
  protocols?: number;
  chainRank?: number;
  fullAnalysis: any; // Store complete analysis result
}

export class AnalysisHistoryService {
  private static readonly STORAGE_KEY = 'chain_analysis_history';
  private static readonly MAX_HISTORY = 50; // Keep last 50 analyses
  private static readonly CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

  /**
   * Save analysis to history
   */
  static saveAnalysis(chainName: string, result: any): void {
    try {
      const history = this.getHistory();
      
      const entry: AnalysisHistoryEntry = {
        id: `${chainName.toLowerCase()}-${Date.now()}`,
        chainName,
        complexity: result.analysis?.complexity || result.complexity || 'MEDIUM',
        estimatedTimeframe: result.analysis?.estimatedTimeframe || result.estimatedTimeframe || 'Unknown',
        timestamp: Date.now(),
        tvl: result.discoveredMetadata?.tvl,
        tvlFormatted: result.discoveredMetadata?.tvlFormatted,
        protocols: result.discoveredMetadata?.protocols,
        chainRank: result.discoveredMetadata?.chainRank,
        fullAnalysis: result,
      };
      
      // Add to beginning of array
      history.unshift(entry);
      
      // Keep only MAX_HISTORY items
      if (history.length > this.MAX_HISTORY) {
        history.splice(this.MAX_HISTORY);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save analysis history:', error);
    }
  }

  /**
   * Get all history
   */
  static getHistory(): AnalysisHistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      return [];
    }
  }

  /**
   * Get cached analysis for a chain (if recent enough)
   */
  static getCachedAnalysis(chainName: string): AnalysisHistoryEntry | null {
    try {
      const history = this.getHistory();
      const normalizedName = chainName.toLowerCase();
      
      const cached = history.find(entry => 
        entry.chainName.toLowerCase() === normalizedName &&
        Date.now() - entry.timestamp < this.CACHE_DURATION
      );
      
      return cached || null;
    } catch (error) {
      console.error('Failed to get cached analysis:', error);
      return null;
    }
  }

  /**
   * Get recent analyses (last N)
   */
  static getRecentAnalyses(limit: number = 10): AnalysisHistoryEntry[] {
    const history = this.getHistory();
    return history.slice(0, limit);
  }

  /**
   * Get analyses by complexity
   */
  static getByComplexity(complexity: 'LOW' | 'MEDIUM' | 'HIGH'): AnalysisHistoryEntry[] {
    const history = this.getHistory();
    return history.filter(entry => entry.complexity === complexity);
  }

  /**
   * Search history by chain name
   */
  static searchHistory(query: string): AnalysisHistoryEntry[] {
    const history = this.getHistory();
    const normalizedQuery = query.toLowerCase();
    
    return history.filter(entry =>
      entry.chainName.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Clear all history
   */
  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  /**
   * Delete specific analysis
   */
  static deleteAnalysis(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(entry => entry.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  }

  /**
   * Get statistics
   */
  static getStatistics(): {
    total: number;
    low: number;
    medium: number;
    high: number;
    avgTimeframe: string;
    mostAnalyzed: string[];
  } {
    const history = this.getHistory();
    
    const stats = {
      total: history.length,
      low: history.filter(e => e.complexity === 'LOW').length,
      medium: history.filter(e => e.complexity === 'MEDIUM').length,
      high: history.filter(e => e.complexity === 'HIGH').length,
      avgTimeframe: 'N/A',
      mostAnalyzed: [] as string[],
    };
    
    // Find most analyzed chains
    const chainCounts = new Map<string, number>();
    history.forEach(entry => {
      const count = chainCounts.get(entry.chainName) || 0;
      chainCounts.set(entry.chainName, count + 1);
    });
    
    stats.mostAnalyzed = Array.from(chainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([chain]) => chain);
    
    return stats;
  }

  /**
   * Export history as JSON
   */
  static exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  /**
   * Import history from JSON
   */
  static importHistory(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
        localStorage.setItem(this.STORAGE_KEY, jsonString);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }
}

