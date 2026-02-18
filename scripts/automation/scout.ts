#!/usr/bin/env tsx
/**
 * Scout — Daily discovery pipeline for toomuch.sh
 *
 * Fetches data from 9 sources: GitHub, DeFi Llama, CoinGecko, npm, RSS,
 * Hacker News, HuggingFace, Reddit, and GeckoTerminal.
 * Compares against existing listings.
 * Uses Claude to analyze, filter, and decide auto-add candidates.
 * Outputs: GitHub Issue for human review + auto-generated listings via PR.
 *
 * Usage:
 *   npx tsx scripts/automation/scout.ts
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY — for Claude analysis
 *   GITHUB_TOKEN     — for GitHub API (optional but recommended)
 *   REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET — for Reddit (optional)
 */
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

import { fetchTrendingRepos, fetchFastGrowingRepos } from './sources/github.js';
import { fetchNewProtocols, fetchFastGrowingProtocols } from './sources/defillama.js';
import { fetchTrendingCoins } from './sources/coingecko.js';
import { fetchAllFeeds, findTrendingMentions } from './sources/rss.js';
import { fetchHackerNewsItems } from './sources/hackernews.js';
import { fetchHuggingFaceItems } from './sources/huggingface.js';
import { fetchRedditItems } from './sources/reddit.js';
import { fetchGeckoTerminalItems } from './sources/geckoterminal.js';
import { loadExistingListings, getExistingProjectNames, isAlreadyListed } from './listings.js';
import { loadState, saveState } from './state.js';
import { enrichCandidates } from './enrichment.js';
import { generateListings } from './generator.js';
import {
  DISCOVERY_THRESHOLDS,
  GITHUB_TOPIC_MAP,
  CATEGORY_CHAIN_MAP,
  DEFILLAMA_CATEGORY_MAP,
  AUTO_ADD_THRESHOLDS,
  OUTPUT,
} from './config.js';
import type { DiscoveryCandidate, AutoAddCandidate, CategoryKey, ScoutResult } from './types.js';

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
  } catch (err) {
    console.warn('  RSS fetch failed:', err);
  }

  // ── 5. Hacker News — Show HN + Top Stories ─────────────────────

  console.log('\n📰 Fetching Hacker News...');
  try {
    const hnCandidates = await fetchHackerNewsItems();
    const filtered = hnCandidates.filter(c => !isAlreadyListed(existingListings, c.name, undefined, c.url));
    candidates.push(...filtered);
    console.log(`  Found ${filtered.length} HN candidates (${hnCandidates.length} raw)`);
  } catch (err) {
    console.warn('  Hacker News fetch failed:', err);
  }

  // ── 6. HuggingFace — Trending Models & Spaces ─────────────────

  console.log('\n🤗 Fetching HuggingFace trending...');
  try {
    const hfCandidates = await fetchHuggingFaceItems();
    const filtered = hfCandidates.filter(c => !isAlreadyListed(existingListings, c.name, undefined, c.url));
    candidates.push(...filtered);
    console.log(`  Found ${filtered.length} HuggingFace candidates (${hfCandidates.length} raw)`);
  } catch (err) {
    console.warn('  HuggingFace fetch failed:', err);
  }

  // ── 7. Reddit — Hot/Top from 6 Subreddits ─────────────────────

  if (process.env.REDDIT_CLIENT_ID) {
    console.log('\n📱 Fetching Reddit...');
    try {
      const redditCandidates = await fetchRedditItems();
      const filtered = redditCandidates.filter(c => !isAlreadyListed(existingListings, c.name, undefined, c.url));
      candidates.push(...filtered);
      console.log(`  Found ${filtered.length} Reddit candidates (${redditCandidates.length} raw)`);
    } catch (err) {
      console.warn('  Reddit fetch failed:', err);
    }
  } else {
    console.log('\n📱 Skipping Reddit (no REDDIT_CLIENT_ID)');
  }

  // ── 8. GeckoTerminal — Trending/New Pools ──────────────────────

  console.log('\n🦎 Fetching GeckoTerminal...');
  try {
    const geckoItems = await fetchGeckoTerminalItems();
    const filtered = geckoItems.filter(c => !isAlreadyListed(existingListings, c.name, undefined, c.url));
    candidates.push(...filtered);
    console.log(`  Found ${filtered.length} GeckoTerminal candidates (${geckoItems.length} raw)`);
  } catch (err) {
    console.warn('  GeckoTerminal fetch failed:', err);
  }

  // ── 9. Claude Analysis + Auto-Add Decision ─────────────────────

  if (candidates.length === 0) {
    console.log('\n✅ No new candidates found. Nothing to report.');
    saveState(state);
    return;
  }

  // Deduplicate across all sources
  const deduped = deduplicateCandidates(candidates);
  console.log(`\n📊 ${deduped.length} unique candidates after dedup (from ${candidates.length} raw)`);

  console.log(`\n🤖 Sending ${deduped.length} candidates to Claude for analysis...`);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('\n⚠️  ANTHROPIC_API_KEY not set. Skipping AI analysis — outputting raw candidates.\n');
    outputRawCandidates(deduped);
    saveState(state);
    return;
  }

  try {
    const analyzed = await analyzeWithClaude(apiKey, deduped, existingListings);
    console.log(`\n📝 Claude identified ${analyzed.candidates.length} worthy candidates\n`);

    // Split into auto-add (80+) and human-review (60-79)
    const autoAddCandidates = analyzed.candidates.filter(
      (c): c is AutoAddCandidate => c.autoAdd === true
        && c.relevanceScore >= AUTO_ADD_THRESHOLDS.minScoreForAutoAdd
    ).slice(0, AUTO_ADD_THRESHOLDS.maxAutoAddPerRun);

    const humanReviewCandidates = analyzed.candidates.filter(
      c => !c.autoAdd || c.relevanceScore < AUTO_ADD_THRESHOLDS.minScoreForAutoAdd
    );

    console.log(`  🤖 Auto-add: ${autoAddCandidates.length} candidates`);
    console.log(`  👤 Human review: ${humanReviewCandidates.length} candidates`);

    // ── Auto-generate listings for auto-add candidates ──────────
    if (autoAddCandidates.length > 0) {
      console.log('\n🔧 Auto-generating listings...');

      // Enrich candidates with README + website meta
      const enriched = await enrichCandidates(autoAddCandidates);
      console.log(`  Enriched ${enriched.length} candidates`);

      // Generate .md listing files
      const generated = await generateListings(apiKey, enriched, existingListings);
      console.log(`  Generated ${generated.length} listing files`);

      if (generated.length > 0) {
        // Write generated files to disk
        for (const file of generated) {
          writeFileSync(file.filePath, file.content);
          console.log(`  ✓ ${file.filePath}`);
        }

        // Write metadata for the workflow to create a PR
        writeFileSync(
          OUTPUT.generatedListingsOutput,
          JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            files: generated.map(f => ({
              path: f.filePath,
              name: f.candidate.name,
              category: f.candidate.category,
              score: f.candidate.relevanceScore,
            })),
          }, null, 2)
        );
        console.log(`\n📄 Generated listings manifest written to ${OUTPUT.generatedListingsOutput}`);

        // Track auto-added slugs in state
        for (const file of generated) {
          const slug = file.filePath.split('/').pop()?.replace('.md', '') || '';
          if (slug && !state.autoAddedSlugs.includes(slug)) {
            state.autoAddedSlugs.push(slug);
          }
        }
      }
    }

    // ── Output human-review candidates as GitHub Issue ───────────
    if (humanReviewCandidates.length > 0) {
      const issueResult: ScoutResult = {
        date: analyzed.date,
        candidates: humanReviewCandidates,
        updates: [],
        summary: analyzed.summary,
      };

      console.log('\n='.repeat(60));
      console.log('DISCOVERY REPORT (Human Review)');
      console.log('='.repeat(60));
      console.log(analyzed.summary);
      console.log('\n--- Candidates ---\n');

      for (const c of humanReviewCandidates) {
        console.log(`[${c.relevanceScore}/100] ${c.name} (${c.category})${c.autoAdd ? ' [auto-add blocked: insufficient info]' : ''}`);
        console.log(`  Source: ${c.source}`);
        console.log(`  URL: ${c.url}`);
        console.log(`  Reasoning: ${c.reasoning}`);
        console.log();
      }

      const issueBody = formatIssueBody(issueResult);
      const outputPath = 'scripts/automation/discovery-output.md';
      writeFileSync(outputPath, issueBody);
      console.log(`\n📄 Issue body written to ${outputPath}`);
    }
  } catch (err) {
    console.error('Claude analysis failed:', err);
    outputRawCandidates(deduped);
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
5. Decide whether each candidate should be auto-added or require human review
6. Write a summary of today's findings

AUTO-ADD CRITERIA (set autoAdd: true when ALL conditions are met):
- relevanceScore >= 80
- You can confidently assign a specific subcategory
- There is enough information (description, URL, clear purpose) to write a full listing
- The tool/project is clearly legitimate (not spam, not vaporware)
- You can determine the pricing model (free, freemium, paid, or open-source)
- You can suggest relevant tags (3-8 tags)

If a candidate scores 80+ but you're unsure about category, pricing, or there's not enough info to write a quality listing, set autoAdd: false and it will go to human review.

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
  subcategory: c.subcategory,
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
      "reasoning": "why this belongs on toomuch.sh",
      "autoAdd": true,
      "suggestedSubcategory": "coding",
      "suggestedTags": ["ai", "coding-assistant", "developer-tools"],
      "suggestedPricing": "open-source"
    }
  ]
}

Only include candidates scoring 60+ relevance. Be selective — quality over quantity.
For candidates with autoAdd: false, suggestedSubcategory/suggestedTags/suggestedPricing are optional.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      date: new Date().toISOString().split('T')[0],
      candidates: (parsed.candidates || []).map((c: any) => ({
        ...c,
        metrics: candidates.find(orig => orig.name === c.name)?.metrics || {},
        autoAdd: c.autoAdd ?? false,
        suggestedSubcategory: c.suggestedSubcategory || c.subcategory || '',
        suggestedTags: c.suggestedTags || [],
        suggestedPricing: c.suggestedPricing || 'free',
      })),
      updates: [],
      summary: parsed.summary || '',
    };
  } catch (err) {
    console.error('Failed to parse Claude response:', text.slice(0, 500));
    throw err;
  }
}

function deduplicateCandidates(candidates: DiscoveryCandidate[]): DiscoveryCandidate[] {
  const seen = new Map<string, DiscoveryCandidate>();
  for (const c of candidates) {
    const key = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, c);
    } else {
      // Keep the one with more metrics info
      const existingMetricCount = Object.keys(existing.metrics).length;
      const newMetricCount = Object.keys(c.metrics).length;
      if (newMetricCount > existingMetricCount) {
        seen.set(key, c);
      }
    }
  }
  return [...seen.values()];
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
