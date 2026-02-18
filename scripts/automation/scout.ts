#!/usr/bin/env tsx
/**
 * Scout — Daily discovery pipeline for toomuch.sh
 *
 * Fetches data from GitHub, DeFi Llama, CoinGecko, npm, and RSS feeds.
 * Compares against existing listings.
 * Uses Claude to analyze and filter candidates.
 * Outputs a GitHub Issue with discovery candidates.
 *
 * Usage:
 *   npx tsx scripts/automation/scout.ts
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY — for Claude analysis
 *   GITHUB_TOKEN     — for GitHub API (optional but recommended)
 */
import Anthropic from '@anthropic-ai/sdk';

import { fetchTrendingRepos, fetchFastGrowingRepos } from './sources/github.js';
import { fetchNewProtocols, fetchFastGrowingProtocols } from './sources/defillama.js';
import { fetchTrendingCoins } from './sources/coingecko.js';
import { fetchAllFeeds, findTrendingMentions } from './sources/rss.js';
import { loadExistingListings, getExistingProjectNames, isAlreadyListed } from './listings.js';
import { loadState, saveState } from './state.js';
import {
  DISCOVERY_THRESHOLDS,
  GITHUB_TOPIC_MAP,
  CATEGORY_CHAIN_MAP,
  DEFILLAMA_CATEGORY_MAP,
  OUTPUT,
} from './config.js';
import type { DiscoveryCandidate, CategoryKey, ScoutResult } from './types.js';

async function main() {
  console.log('🔍 Scout: starting daily discovery run...\n');

  const state = loadState();
  const existingListings = loadExistingListings();
  const existingNames = getExistingProjectNames(existingListings);

  console.log(`Loaded ${existingListings.length} existing listings`);

  const candidates: DiscoveryCandidate[] = [];

  // ── 1. GitHub Trending & Fast-Growing Repos ────────────────────

  console.log('\n📦 Fetching GitHub trending repos...');
  try {
    const [trending, fastGrowing] = await Promise.all([
      fetchTrendingRepos({ minStars: DISCOVERY_THRESHOLDS.github.minStarsForCandidate }),
      fetchFastGrowingRepos({ minStars: DISCOVERY_THRESHOLDS.github.minStarsForCandidate }),
    ]);

    const allRepos = [...trending, ...fastGrowing];
    const seen = new Set<string>();

    for (const repo of allRepos) {
      if (seen.has(repo.name)) continue;
      seen.add(repo.name);

      if (isAlreadyListed(existingListings, repo.name.split('/')[1], undefined, repo.url)) {
        continue;
      }

      // Try to infer category from description/language
      const category = inferCategoryFromGitHub(repo.description, repo.language);
      if (!category) continue; // not relevant to our site

      candidates.push({
        name: repo.name.split('/')[1] || repo.name,
        source: 'github-trending',
        url: repo.url,
        description: repo.description,
        category,
        metrics: {
          githubStarsTotal: repo.stars,
          githubStarsDay: repo.starsToday,
        },
        relevanceScore: 0,
        reasoning: '',
      });
    }
    console.log(`  Found ${candidates.length} GitHub candidates (not already listed)`);
  } catch (err) {
    console.warn('  GitHub fetch failed:', err);
  }

  // ── 2. DeFi Llama — New & Fast-Growing Protocols ───────────────

  console.log('\n📊 Fetching DeFi Llama data...');
  try {
    const [newProtocols, growingProtocols] = await Promise.all([
      fetchNewProtocols(DISCOVERY_THRESHOLDS.defiLlama.maxAgeForNewDays),
      fetchFastGrowingProtocols(DISCOVERY_THRESHOLDS.defiLlama.minTvlForCandidate),
    ]);

    // Track new protocol slugs for delta detection
    const currentSlugs = [...newProtocols, ...growingProtocols].map(p => p.slug);
    const newToUs = currentSlugs.filter(s => !state.knownProtocolSlugs.includes(s));

    const allProtocols = [...newProtocols, ...growingProtocols];
    const seenSlugs = new Set<string>();

    for (const protocol of allProtocols) {
      if (seenSlugs.has(protocol.slug)) continue;
      seenSlugs.add(protocol.slug);

      if (isAlreadyListed(existingListings, protocol.name, protocol.url)) {
        continue;
      }

      if (protocol.tvl < DISCOVERY_THRESHOLDS.defiLlama.minTvlForCandidate) {
        continue;
      }

      const mapped = mapDefiLlamaToCategory(protocol);
      if (!mapped) continue;

      candidates.push({
        name: protocol.name,
        source: 'defillama',
        url: protocol.url || `https://defillama.com/protocol/${protocol.slug}`,
        description: protocol.description,
        category: mapped.category,
        subcategory: mapped.subcategory,
        metrics: {
          tvlCurrent: protocol.tvl,
          tvlWoWChange: protocol.change_7d ?? undefined,
        },
        relevanceScore: 0,
        reasoning: '',
      });
    }

    // Update state with known slugs
    state.knownProtocolSlugs = [...new Set([...state.knownProtocolSlugs, ...currentSlugs])];

    console.log(`  Found ${candidates.filter(c => c.source === 'defillama').length} DeFi Llama candidates`);
    if (newToUs.length > 0) {
      console.log(`  ${newToUs.length} protocols are new to us`);
    }
  } catch (err) {
    console.warn('  DeFi Llama fetch failed:', err);
  }

  // ── 3. CoinGecko Trending ──────────────────────────────────────

  console.log('\n🪙 Fetching CoinGecko trending...');
  try {
    const trending = await fetchTrendingCoins();

    // Update trending streak
    const currentTrendingIds = new Set(trending.map(c => c.id));
    for (const [id, streak] of Object.entries(state.coingeckoTrendingStreak)) {
      if (!currentTrendingIds.has(id)) {
        state.coingeckoTrendingStreak[id] = 0; // reset streak
      }
    }
    for (const coin of trending) {
      state.coingeckoTrendingStreak[coin.id] = (state.coingeckoTrendingStreak[coin.id] || 0) + 1;
    }

    // Only flag coins with multi-day trending streaks
    for (const coin of trending) {
      const streak = state.coingeckoTrendingStreak[coin.id] || 1;
      if (streak < DISCOVERY_THRESHOLDS.coingecko.consecutiveTrendingDays) continue;

      if (isAlreadyListed(existingListings, coin.name)) continue;

      candidates.push({
        name: coin.name,
        source: 'coingecko',
        url: `https://www.coingecko.com/en/coins/${coin.id}`,
        description: `${coin.name} (${coin.symbol.toUpperCase()}) — trending on CoinGecko for ${streak} consecutive days. Market cap rank: #${coin.marketCapRank || '?'}`,
        category: 'infra', // will be refined by Claude
        metrics: {
          coingeckoTrending: true,
          coingeckoTrendingRank: coin.score,
        },
        relevanceScore: 0,
        reasoning: '',
      });
    }

    console.log(`  ${trending.length} coins trending, ${candidates.filter(c => c.source === 'coingecko').length} are new candidates`);
  } catch (err) {
    console.warn('  CoinGecko fetch failed:', err);
  }

  // ── 4. RSS Feeds — News Mentions ───────────────────────────────

  console.log('\n📰 Fetching RSS feeds...');
  try {
    const rssItems = await fetchAllFeeds(7);
    console.log(`  ${rssItems.length} RSS items from last 7 days`);

    // Find which existing tools are getting lots of mentions
    const trendingMentions = findTrendingMentions(rssItems, existingNames);
    if (trendingMentions.length > 0) {
      console.log(`  Trending existing tools: ${trendingMentions.slice(0, 5).map(m => `${m.name} (${m.count})`).join(', ')}`);
    }

    // Note: New discovery from RSS is handled by Claude analysis below
    // We pass the RSS items to Claude for it to identify new tools mentioned in the news
  } catch (err) {
    console.warn('  RSS fetch failed:', err);
  }

  // ── 5. Claude Analysis ─────────────────────────────────────────

  if (candidates.length === 0) {
    console.log('\n✅ No new candidates found. Nothing to report.');
    saveState(state);
    return;
  }

  console.log(`\n🤖 Sending ${candidates.length} candidates to Claude for analysis...`);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('\n⚠️  ANTHROPIC_API_KEY not set. Skipping AI analysis — outputting raw candidates.\n');
    outputRawCandidates(candidates);
    saveState(state);
    return;
  }

  try {
    const analyzed = await analyzeWithClaude(apiKey, candidates, existingListings);
    console.log(`\n📝 Claude identified ${analyzed.candidates.length} worthy candidates\n`);

    if (analyzed.candidates.length > 0) {
      console.log('='.repeat(60));
      console.log('DISCOVERY REPORT');
      console.log('='.repeat(60));
      console.log(analyzed.summary);
      console.log('\n--- Candidates ---\n');

      for (const c of analyzed.candidates) {
        console.log(`[${c.relevanceScore}/100] ${c.name} (${c.category})`);
        console.log(`  Source: ${c.source}`);
        console.log(`  URL: ${c.url}`);
        console.log(`  Reasoning: ${c.reasoning}`);
        console.log();
      }

      // Output as GitHub Issue body (for the Action to pick up)
      const issueBody = formatIssueBody(analyzed);
      const outputPath = 'scripts/automation/discovery-output.md';
      const { writeFileSync } = await import('fs');
      writeFileSync(outputPath, issueBody);
      console.log(`\n📄 Issue body written to ${outputPath}`);
    }
  } catch (err) {
    console.error('Claude analysis failed:', err);
    outputRawCandidates(candidates);
  }

  saveState(state);
  console.log('\n✅ Scout run complete.');
}

// ─── Helpers ──────────────────────────────────────────────────────

function inferCategoryFromGitHub(description: string, language: string): CategoryKey | null {
  const text = `${description} ${language}`.toLowerCase();

  for (const [keyword, category] of Object.entries(GITHUB_TOPIC_MAP)) {
    if (text.includes(keyword)) return category;
  }
  return null;
}

function mapDefiLlamaToCategory(protocol: { chain: string; chains: string[]; category: string }): { category: CategoryKey; subcategory: string } | null {
  // Try category mapping first
  const catMap = DEFILLAMA_CATEGORY_MAP[protocol.category];
  if (catMap) return catMap;

  // Try chain mapping
  const chainCat = CATEGORY_CHAIN_MAP[protocol.chain];
  if (chainCat) return { category: chainCat, subcategory: 'defi' };

  // Check chains array
  for (const chain of protocol.chains) {
    const cat = CATEGORY_CHAIN_MAP[chain];
    if (cat) return { category: cat, subcategory: 'defi' };
  }

  return null;
}

async function analyzeWithClaude(
  apiKey: string,
  candidates: DiscoveryCandidate[],
  existing: { name: string; category: string }[],
): Promise<ScoutResult> {
  const client = new Anthropic({ apiKey });

  const prompt = `You are the content curator for toomuch.sh, a directory of tools across AI, crypto, and RWA ecosystems.

I have ${candidates.length} discovery candidates from automated sources. Analyze each and:
1. Score relevance 0-100 (how valuable is this for our audience?)
2. Filter out noise, spam, duplicates, and things that don't fit our categories
3. Assign the correct category: ai, bitcoin, ethereum, solana, rwa, or infra
4. Write a brief reasoning for each keeper
5. Write a summary of today's findings

Our existing listings (${existing.length} tools): ${existing.map(l => l.name).join(', ')}

Our categories and what belongs in each:
- ai: LLMs, coding tools, image/video/audio generation, agents, local AI, hardware
- bitcoin: wallets, Lightning, L2s, Bitcoin DeFi, ordinals, payments
- ethereum: L2 rollups, DeFi (lending, DEXs), staking, wallets, dev tools, governance
- solana: DEXs, DeFi, liquid staking, wallets, NFTs, meme/token launch, dev tools
- rwa: tokenized treasuries, private credit, real estate, commodities
- infra: bridges, oracles, analytics, AI x crypto crossover tokens

Candidates:
${JSON.stringify(candidates.map(c => ({
  name: c.name,
  source: c.source,
  url: c.url,
  description: c.description,
  category: c.category,
  metrics: c.metrics,
})), null, 2)}

Respond with valid JSON only (no markdown code fences), using this schema:
{
  "summary": "2-3 sentence summary of today's findings",
  "candidates": [
    {
      "name": "Project Name",
      "source": "github-trending",
      "url": "https://...",
      "description": "what it does",
      "category": "ai",
      "subcategory": "coding",
      "relevanceScore": 85,
      "reasoning": "why this belongs on toomuch.sh"
    }
  ]
}

Only include candidates scoring 60+ relevance. Be selective — quality over quantity.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    // Extract JSON from response — Claude may include extra text before/after
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      date: new Date().toISOString().split('T')[0],
      candidates: (parsed.candidates || []).map((c: any) => ({
        ...c,
        metrics: candidates.find(orig => orig.name === c.name)?.metrics || {},
      })),
      updates: [],
      summary: parsed.summary || '',
    };
  } catch (err) {
    console.error('Failed to parse Claude response:', text.slice(0, 500));
    throw err;
  }
}

function formatIssueBody(result: ScoutResult): string {
  const lines = [
    `## Discovery Report — ${result.date}`,
    '',
    result.summary,
    '',
    '---',
    '',
  ];

  // Group by category
  const byCategory = new Map<string, typeof result.candidates>();
  for (const c of result.candidates) {
    const list = byCategory.get(c.category) || [];
    list.push(c);
    byCategory.set(c.category, list);
  }

  for (const [category, candidates] of byCategory) {
    lines.push(`### ${category.toUpperCase()}`);
    lines.push('');

    for (const c of candidates) {
      lines.push(`- **[${c.name}](${c.url})** (score: ${c.relevanceScore}/100)`);
      lines.push(`  ${c.description}`);
      lines.push(`  _Source: ${c.source} | ${c.reasoning}_`);
      if (c.metrics.githubStarsTotal) lines.push(`  Stars: ${c.metrics.githubStarsTotal.toLocaleString()}`);
      if (c.metrics.tvlCurrent) lines.push(`  TVL: $${(c.metrics.tvlCurrent / 1_000_000).toFixed(1)}M`);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('_Generated automatically by the toomuch.sh content scout_');

  return lines.join('\n');
}

function outputRawCandidates(candidates: DiscoveryCandidate[]): void {
  console.log('\n--- Raw Candidates (unfiltered) ---\n');
  for (const c of candidates.slice(0, OUTPUT.maxCandidatesPerIssue)) {
    console.log(`${c.name} (${c.source}, ${c.category})`);
    console.log(`  ${c.url}`);
    console.log(`  ${c.description.slice(0, 100)}`);
    console.log();
  }
}

// ─── Run ──────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Scout failed:', err);
  process.exit(1);
});
