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
  source: DiscoverySource;
  url: string;
  description: string;
  category: CategoryKey;
  subcategory?: string;
  metrics: ProjectMetrics;
  relevanceScore: number; // 0-100, computed by AI analysis
  reasoning: string; // why this candidate is worth listing
  autoAdd?: boolean; // Claude decides: true = auto-generate listing, false = human review
}

export type DiscoverySource =
  | 'github-trending'
  | 'defillama'
  | 'coingecko'
  | 'rss'
  | 'npm'
  | 'hackernews'
  | 'huggingface'
  | 'reddit'
  | 'geckoterminal';

/** A candidate that Claude flagged for auto-addition (score 80+, enough info) */
export interface AutoAddCandidate extends DiscoveryCandidate {
  autoAdd: true;
  suggestedSubcategory: string;
  suggestedTags: string[];
  suggestedPricing: Pricing;
}

/** A candidate enriched with README + website metadata for listing generation */
export interface EnrichedCandidate extends AutoAddCandidate {
  readme?: string; // first 3000 chars of GitHub README
  websiteMeta?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

/** A complete generated listing ready to write as .md */
export interface GeneratedListing {
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
  dateAdded: string; // YYYY-MM-DD
  featured: boolean;
  bodyContent: string; // markdown body below frontmatter
}

/** Output of the generator — file path + content */
export interface GeneratedFile {
  filePath: string; // relative path e.g. src/content/listings/ai/my-tool.md
  content: string; // full .md file content (frontmatter + body)
  candidate: AutoAddCandidate; // original candidate for reference
}

/** Stale listing detected by the content updater */
export interface StaleDetection {
  listing: ExistingListing;
  reasons: StaleReason[];
  currentContent: string; // full file content
  context: {
    latestRelease?: string;
    tvlChange?: number;
    daysSinceUpdate: number;
  };
}

export type StaleReason = 'recent-release' | 'tvl-shift' | 'age';

/** A content rewrite produced by Claude for a stale listing */
export interface ContentRewrite {
  slug: string;
  filePath: string;
  newContent: string; // full rewritten .md file
  changesSummary: string; // what was updated
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
