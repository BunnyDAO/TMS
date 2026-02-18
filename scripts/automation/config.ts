import type { CategoryKey } from './types.js';

// ─── Status Thresholds ──────────────────────────────────────────────

/**
 * Thresholds for AI / dev tools (GitHub + npm signals)
 *
 * Based on ROSS Index 2024 data:
 *   - Top 20 open source projects averaged 66+ stars/day (~462/week)
 *   - GitHub trending page threshold: ~50-200 stars/day
 *   - Ollama peaked at 208 stars/day, LangChain at 430/day during breakout
 */
export const AI_THRESHOLDS = {
  hot: {
    githubStarsWeek: 350,    // ~50/day — catches genuinely fast-growing tools
    npmWoWChange: 100,       // 100% week-over-week download increase
  },
  trending: {
    githubStarsWeek: 150,    // ~21/day — solid growth, not yet breakout
    npmWoWChange: 50,        // 50% WoW increase
  },
  newWindowDays: 30,         // listed within last 30 days
};

/**
 * Thresholds for DeFi / crypto protocols (TVL + volume signals)
 *
 * Based on real protocol data:
 *   - Jito sustained ~8-10% WoW over 10 months ($647M to $3B)
 *   - Ondo hit 15-20% WoW during breakout ($534M to $1B in 3 months)
 *   - Centrifuge did 47%/week during explosive phase
 *   - Jupiter crossed $1B daily volume during its breakout
 */
export const DEFI_THRESHOLDS = {
  hot: {
    tvlWoWChange: 15,        // 15%+ week-over-week TVL growth
    dailyVolume: 50_000_000, // $50M+/day
  },
  trending: {
    tvlWoWChange: 5,         // 5-15% WoW TVL growth
    dailyVolume: 10_000_000, // $10M-50M/day
  },
  newWindowDays: 30,
};

/**
 * Thresholds for new project discovery
 */
export const DISCOVERY_THRESHOLDS = {
  github: {
    minStarsForCandidate: 1000,        // must have at least 1K stars
    minStarsWeekForTrending: 200,      // or 200+ stars this week
  },
  defiLlama: {
    minTvlForCandidate: 10_000_000,    // $10M TVL minimum to be worth listing
    maxAgeForNewDays: 30,              // appeared on DeFi Llama within last 30 days
  },
  coingecko: {
    consecutiveTrendingDays: 2,        // must trend for 2+ days (tracked via state file)
  },
  npm: {
    minWeeklyDownloads: 50_000,        // 50K downloads/week minimum
  },
  rss: {
    minMentionsForSignal: 3,           // mentioned in 3+ sources within 7 days
  },
};

// ─── API Endpoints ──────────────────────────────────────────────────

export const APIS = {
  github: {
    base: 'https://api.github.com',
    searchRepos: '/search/repositories',
    repo: '/repos',
    // Unofficial trending — uses GitHub search as proxy
    // Sort by stars, filter by recently created or recently active
  },
  defiLlama: {
    base: 'https://api.llama.fi',
    protocols: '/protocols',
    protocol: '/protocol', // /{slug}
    tvl: '/tvl',           // /{protocol}
    dexOverview: '/overview/dexs',
  },
  coingecko: {
    base: 'https://api.coingecko.com/api/v3',
    trending: '/search/trending',
    markets: '/coins/markets',
    coinList: '/coins/list',
  },
  npm: {
    downloads: 'https://api.npmjs.org/downloads',
    // /point/last-week/{package}
    // /range/last-week/{package}
  },
};

// ─── RSS Feed Sources ───────────────────────────────────────────────

export const RSS_FEEDS: { url: string; name: string; categories: CategoryKey[] }[] = [
  // AI
  { url: 'https://openai.com/news/rss.xml', name: 'OpenAI Blog', categories: ['ai'] },
  { url: 'https://blog.google/technology/ai/rss/', name: 'Google AI Blog', categories: ['ai'] },
  { url: 'https://huggingface.co/blog/feed.xml', name: 'HuggingFace Blog', categories: ['ai'] },

  // Crypto general
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml', name: 'CoinDesk', categories: ['bitcoin', 'ethereum', 'solana', 'rwa', 'infra'] },
  { url: 'https://cointelegraph.com/rss', name: 'Cointelegraph', categories: ['bitcoin', 'ethereum', 'solana', 'rwa', 'infra'] },
  { url: 'https://thedefiant.io/feed/', name: 'The Defiant', categories: ['ethereum', 'solana', 'rwa', 'infra'] },
  { url: 'https://decrypt.co/feed', name: 'Decrypt', categories: ['bitcoin', 'ethereum', 'solana', 'rwa', 'infra'] },

  // Bitcoin specific
  { url: 'https://cointelegraph.com/rss/tag/bitcoin', name: 'Cointelegraph BTC', categories: ['bitcoin'] },

  // Ethereum specific
  { url: 'https://cointelegraph.com/rss/tag/ethereum', name: 'Cointelegraph ETH', categories: ['ethereum'] },
];

// ─── Category → Source Mapping ──────────────────────────────────────

/**
 * Maps our site categories to the DeFi Llama chain names
 * so we know which protocols belong where.
 */
export const CATEGORY_CHAIN_MAP: Record<string, CategoryKey> = {
  'Ethereum': 'ethereum',
  'Solana': 'solana',
  'Bitcoin': 'bitcoin',
  'Arbitrum': 'ethereum',
  'Optimism': 'ethereum',
  'Base': 'ethereum',
  'zkSync Era': 'ethereum',
  'Polygon': 'ethereum',
  'Multi-Chain': 'infra',
};

/**
 * DeFi Llama category → our subcategory mapping
 */
export const DEFILLAMA_CATEGORY_MAP: Record<string, { category: CategoryKey; subcategory: string }> = {
  'Dexes': { category: 'ethereum', subcategory: 'defi-dex' },
  'Lending': { category: 'ethereum', subcategory: 'defi-lending' },
  'Liquid Staking': { category: 'ethereum', subcategory: 'staking' },
  'Bridge': { category: 'infra', subcategory: 'bridges' },
  'Oracle': { category: 'infra', subcategory: 'oracles' },
  'RWA': { category: 'rwa', subcategory: 'treasuries' },
  'CDP': { category: 'ethereum', subcategory: 'stablecoins' },
  'Yield': { category: 'ethereum', subcategory: 'defi-lending' },
};

/**
 * GitHub topics/keywords → our category mapping for discovery
 */
export const GITHUB_TOPIC_MAP: Record<string, CategoryKey> = {
  'llm': 'ai',
  'large-language-model': 'ai',
  'ai': 'ai',
  'machine-learning': 'ai',
  'generative-ai': 'ai',
  'stable-diffusion': 'ai',
  'text-to-image': 'ai',
  'text-to-video': 'ai',
  'ai-agent': 'ai',
  'coding-assistant': 'ai',
  'bitcoin': 'bitcoin',
  'lightning-network': 'bitcoin',
  'ethereum': 'ethereum',
  'solidity': 'ethereum',
  'defi': 'ethereum',
  'solana': 'solana',
  'rust-solana': 'solana',
  'anchor-framework': 'solana',
  'rwa': 'rwa',
  'tokenization': 'rwa',
  'blockchain': 'infra',
  'cross-chain': 'infra',
  'oracle': 'infra',
};

// ─── Tracked Repos for Existing Listings ────────────────────────────

/**
 * Maps listing slugs to their GitHub owner/repo for star tracking.
 * This gets populated at runtime by scanning existing listings.
 */
export function extractGitHubRepo(githubUrl: string): string | null {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch {}
  return null;
}

/**
 * Maps listing slugs to their npm package name for download tracking.
 * Only relevant for AI/dev tool listings.
 */
export const SLUG_TO_NPM: Record<string, string> = {
  'langchain': 'langchain',
  'n8n': 'n8n',
  'claude-code': '@anthropic-ai/claude-code',
  'dify': 'dify',
};

// ─── Output Config ──────────────────────────────────────────────────

export const OUTPUT = {
  /** State file tracking previous metrics for delta computation */
  stateFile: 'scripts/automation/state.json',
  /** Label for discovery issues */
  discoveryIssueLabel: 'discovery',
  /** Label for update PRs */
  updatePrLabel: 'content-update',
  /** Max candidates to include in a single discovery issue */
  maxCandidatesPerIssue: 15,
};
