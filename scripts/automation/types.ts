/** Category keys matching the site's content schema */
export type CategoryKey = 'ai' | 'bitcoin' | 'ethereum' | 'solana' | 'rwa' | 'infra';

export type Status = 'hot' | 'trending' | 'new' | 'stable';
export type Pricing = 'free' | 'freemium' | 'paid' | 'open-source';

/** Metrics collected for a project from various sources */
export interface ProjectMetrics {
  // GitHub metrics
  githubStarsTotal?: number;
  githubStarsWeek?: number;
  githubStarsDay?: number;
  githubLastRelease?: string; // ISO date
  githubCreatedAt?: string;

  // npm/PyPI metrics
  npmDownloadsWeek?: number;
  npmDownloadsPrevWeek?: number;
  npmDownloadsWoWChange?: number; // percentage

  // DeFi metrics
  tvlCurrent?: number;
  tvlPrevWeek?: number;
  tvlWoWChange?: number; // percentage
  dailyVolume?: number;
  dailyFees?: number;

  // Social / news metrics
  coingeckoTrending?: boolean;
  coingeckoTrendingRank?: number;
  newsmentionCount?: number; // mentions in RSS feeds in last 7 days

  // Meta
  firstSeenDate?: string; // when we first discovered this project
  daysSinceFirstSeen?: number;
}

/** An existing listing from the site's content */
export interface ExistingListing {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: CategoryKey;
  subcategory: string;
  tags: string[];
  website?: string;
  github?: string;
  docs?: string;
  pricing: Pricing;
  status: Status;
  dateAdded: string;
  featured: boolean;
  filePath: string; // relative path to the markdown file
}

/** A discovered candidate for a new listing */
export interface DiscoveryCandidate {
  name: string;
  source: 'github-trending' | 'defillama' | 'coingecko' | 'rss' | 'npm';
  url: string;
  description: string;
  category: CategoryKey;
  subcategory?: string;
  metrics: ProjectMetrics;
  relevanceScore: number; // 0-100, computed by AI analysis
  reasoning: string; // why this candidate is worth listing
}

/** A suggested update to an existing listing */
export interface ListingUpdate {
  slug: string;
  filePath: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
    reason: string;
  }[];
  newStatus?: Status;
  statusReason?: string;
}

/** GitHub trending repo from the unofficial API or search */
export interface GitHubTrendingRepo {
  name: string; // owner/repo
  description: string;
  url: string;
  stars: number;
  starsToday: number;
  language: string;
  forks: number;
}

/** DeFi Llama protocol data */
export interface DefiLlamaProtocol {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  chain: string;
  chains: string[];
  tvl: number;
  change_1d: number | null;
  change_7d: number | null;
  category: string;
  listedAt: number; // unix timestamp
  github?: string[];
}

/** CoinGecko trending coin */
export interface CoinGeckoTrendingCoin {
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number;
  thumb: string;
  score: number; // position in trending (0 = top)
}

/** RSS feed item */
export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string; // which feed it came from
}

/** Result of the daily scout run */
export interface ScoutResult {
  date: string;
  candidates: DiscoveryCandidate[];
  updates: ListingUpdate[];
  summary: string; // AI-generated summary of findings
}
