/**
 * GITHUB REPOSITORY ANALYZER
 * 
 * Scrapes Ledger Live public repository to extract:
 * - All chain families (integrations)
 * - Actual integration timelines
 * - Common patterns and blockers
 * - Code structure analysis
 * 
 * Repository: https://github.com/LedgerHQ/ledger-live
 */

export interface ChainFamilyInfo {
  name: string;
  path: string;
  family: string;
  firstCommit?: string;
  lastCommit?: string;
  commitCount?: number;
  prCount?: number;
  files: string[];
  estimatedWeeks?: number;
}

export interface IntegrationTimeline {
  chainName: string;
  firstCommit: string;
  releaseDate?: string;
  weeksToRelease?: number;
  commits: number;
  prs: number;
}

export class GitHubAnalyzer {
  private readonly REPO_OWNER = 'LedgerHQ';
  private readonly REPO_NAME = 'ledger-live';
  private readonly BASE_URL = `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}`;
  private readonly FAMILIES_PATH = 'libs/ledger-live-common/src/families';
  
  /**
   * Get GitHub token from environment
   */
  private getAuthHeaders(): HeadersInit {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn('GITHUB_TOKEN not set - API rate limits will apply');
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
  }
  
  /**
   * Fetch all chain families from repository
   */
  async getAllChainFamilies(): Promise<ChainFamilyInfo[]> {
    try {
      const url = `${this.BASE_URL}/contents/${this.FAMILIES_PATH}`;
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const contents = await response.json() as Array<{
        name: string;
        type: string;
        path: string;
      }>;
      
      const families: ChainFamilyInfo[] = [];
      
      for (const item of contents) {
        if (item.type === 'dir' && !item.name.startsWith('.')) {
          const familyInfo = await this.analyzeFamily(item.name);
          if (familyInfo) {
            families.push(familyInfo);
          }
        }
      }
      
      return families;
    } catch (error) {
      console.error('Error fetching chain families:', error);
      return [];
    }
  }
  
  /**
   * Analyze a specific chain family
   */
  async analyzeFamily(familyName: string): Promise<ChainFamilyInfo | null> {
    try {
      const path = `${this.FAMILIES_PATH}/${familyName}`;
      
      // Get directory contents
      const contentsUrl = `${this.BASE_URL}/contents/${path}`;
      const contentsResponse = await fetch(contentsUrl, {
        headers: this.getAuthHeaders()
      });
      
      if (!contentsResponse.ok) {
        return null;
      }
      
      const contents = await contentsResponse.json() as Array<{
        name: string;
        type: string;
        path: string;
      }>;
      
      const files = contents
        .filter(item => item.type === 'file')
        .map(item => item.name);
      
      // Get commit history
      const commitsUrl = `${this.BASE_URL}/commits?path=${path}&per_page=1`;
      const commitsResponse = await fetch(commitsUrl, {
        headers: this.getAuthHeaders()
      });
      
      let firstCommit: string | undefined;
      let lastCommit: string | undefined;
      let commitCount = 0;
      
      if (commitsResponse.ok) {
        const commits = await commitsResponse.json() as Array<{
          sha: string;
          commit: {
            author: { date: string };
            message: string;
          };
        }>;
        
        if (commits.length > 0) {
          lastCommit = commits[0].commit.author.date;
          commitCount = commits.length;
          
          // Get first commit (need to paginate or use different endpoint)
          // For now, estimate based on last commit
        }
      }
      
      // Get PRs related to this family
      const prsUrl = `${this.BASE_URL}/pulls?state=all&per_page=100`;
      const prsResponse = await fetch(prsUrl, {
        headers: this.getAuthHeaders()
      });
      
      let prCount = 0;
      if (prsResponse.ok) {
        const prs = await prsResponse.json() as Array<{
          title: string;
          body: string;
          created_at: string;
        }>;
        
        prCount = prs.filter(pr => 
          pr.title.toLowerCase().includes(familyName.toLowerCase()) ||
          pr.body.toLowerCase().includes(familyName.toLowerCase())
        ).length;
      }
      
      return {
        name: familyName,
        path,
        family: familyName,
        firstCommit,
        lastCommit,
        commitCount,
        prCount,
        files
      };
    } catch (error) {
      console.error(`Error analyzing family ${familyName}:`, error);
      return null;
    }
  }
  
  /**
   * Get integration timeline for a chain
   */
  async getIntegrationTimeline(chainName: string): Promise<IntegrationTimeline | null> {
    try {
      // Find family by chain name
      const families = await this.getAllChainFamilies();
      const family = families.find(f => 
        f.name.toLowerCase().includes(chainName.toLowerCase()) ||
        chainName.toLowerCase().includes(f.name.toLowerCase())
      );
      
      if (!family) {
        return null;
      }
      
      // Get first commit
      const commitsUrl = `${this.BASE_URL}/commits?path=${family.path}&per_page=100`;
      const commitsResponse = await fetch(commitsUrl, {
        headers: this.getAuthHeaders()
      });
      
      if (!commitsResponse.ok) {
        return null;
      }
      
      const commits = await commitsResponse.json() as Array<{
        sha: string;
        commit: {
          author: { date: string };
          message: string;
        };
      }>;
      
      if (commits.length === 0) {
        return null;
      }
      
      const firstCommit = commits[commits.length - 1].commit.author.date;
      const lastCommit = commits[0].commit.author.date;
      
      // Calculate weeks
      const firstDate = new Date(firstCommit);
      const lastDate = new Date(lastCommit);
      const weeksToRelease = Math.ceil(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      
      // Get PRs
      const prsUrl = `${this.BASE_URL}/pulls?state=all&per_page=100`;
      const prsResponse = await fetch(prsUrl, {
        headers: this.getAuthHeaders()
      });
      
      let prCount = 0;
      if (prsResponse.ok) {
        const prs = await prsResponse.json() as Array<{
          title: string;
          body: string;
        }>;
        
        prCount = prs.filter(pr => 
          pr.title.toLowerCase().includes(chainName.toLowerCase()) ||
          pr.body.toLowerCase().includes(chainName.toLowerCase())
        ).length;
      }
      
      return {
        chainName,
        firstCommit,
        releaseDate: lastCommit,
        weeksToRelease,
        commits: commits.length,
        prs: prCount
      };
    } catch (error) {
      console.error(`Error getting timeline for ${chainName}:`, error);
      return null;
    }
  }
  
  /**
   * Analyze all integrations and extract patterns
   */
  async analyzeAllIntegrations(): Promise<{
    families: ChainFamilyInfo[];
    patterns: {
      avgWeeksByFamily: Record<string, number>;
      commonFiles: string[];
      avgCommits: number;
      avgPRs: number;
    };
  }> {
    const families = await this.getAllChainFamilies();
    
    // Calculate averages
    const avgWeeksByFamily: Record<string, number> = {};
    const familyGroups: Record<string, ChainFamilyInfo[]> = {};
    
    families.forEach(family => {
      if (!familyGroups[family.family]) {
        familyGroups[family.family] = [];
      }
      familyGroups[family.family].push(family);
    });
    
    // Calculate averages (simplified - would need actual timeline data)
    Object.keys(familyGroups).forEach(family => {
      const group = familyGroups[family];
      avgWeeksByFamily[family] = group.length; // Placeholder
    });
    
    // Common files across families
    const allFiles = families.flatMap(f => f.files);
    const fileCounts: Record<string, number> = {};
    allFiles.forEach(file => {
      fileCounts[file] = (fileCounts[file] || 0) + 1;
    });
    
    const commonFiles = Object.entries(fileCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([file]) => file);
    
    const avgCommits = families.reduce((sum, f) => sum + (f.commitCount || 0), 0) / families.length;
    const avgPRs = families.reduce((sum, f) => sum + (f.prCount || 0), 0) / families.length;
    
    return {
      families,
      patterns: {
        avgWeeksByFamily,
        commonFiles,
        avgCommits: Math.round(avgCommits),
        avgPRs: Math.round(avgPRs)
      }
    };
  }
}

/**
 * Singleton instance
 */
export const githubAnalyzer = new GitHubAnalyzer();

