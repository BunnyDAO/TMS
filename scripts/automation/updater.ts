#!/usr/bin/env tsx
/**
 * Updater — Daily status update pipeline for toomuch.sh
 *
 * Re-evaluates status labels for all existing listings based on live metrics.
 * Checks for factual changes (new model versions, pricing, features).
 * Outputs a summary of recommended changes.
 *
 * Usage:
 *   npx tsx scripts/automation/updater.ts
 *
 * Required env vars:
 *   GITHUB_TOKEN     — for GitHub API (optional but recommended)
 *   ANTHROPIC_API_KEY — for Claude analysis of factual changes
 */
import { readFileSync, writeFileSync } from 'fs';
import Anthropic from '@anthropic-ai/sdk';

import { getRepoStars } from './sources/github.js';
import { fetchAllProtocols, fetchDexVolumes } from './sources/defillama.js';
import { fetchTrendingCoins } from './sources/coingecko.js';
import { batchFetchNpmDownloads } from './sources/npm.js';
import { fetchAllFeeds, countMentions } from './sources/rss.js';
import { loadExistingListings } from './listings.js';
import { loadState, saveState } from './state.js';
import { computeStatus, computeStarDelta, computeTvlWoW } from './status-engine.js';
import { extractGitHubRepo, SLUG_TO_NPM } from './config.js';
import type { ExistingListing, ProjectMetrics, ListingUpdate, Status } from './types.js';

async function main() {
  console.log('🔄 Updater: starting daily status update...\n');

  const state = loadState();
  const listings = loadExistingListings();
  console.log(`Loaded ${listings.length} existing listings`);

  // ── 1. Collect metrics for all listings ────────────────────────

  // Fetch bulk data sources
  console.log('\n📊 Fetching bulk data...');

  const [defiProtocols, dexVolumes, trendingCoins, rssItems] = await Promise.all([
    fetchAllProtocols().catch(err => { console.warn('DeFi Llama failed:', err); return []; }),
    fetchDexVolumes().catch(err => { console.warn('DEX volumes failed:', err); return []; }),
    fetchTrendingCoins().catch(err => { console.warn('CoinGecko trending failed:', err); return []; }),
    fetchAllFeeds(7).catch(err => { console.warn('RSS feeds failed:', err); return []; }),
  ]);

  console.log(`  DeFi Llama: ${defiProtocols.length} protocols`);
  console.log(`  DEX volumes: ${dexVolumes.length} DEXs`);
  console.log(`  CoinGecko: ${trendingCoins.length} trending`);
  console.log(`  RSS: ${rssItems.length} items`);

  // Build lookup maps
  const defiByName = new Map(defiProtocols.map(p => [p.name.toLowerCase(), p]));
  const defiBySlug = new Map(defiProtocols.map(p => [p.slug.toLowerCase(), p]));
  const dexByName = new Map(dexVolumes.map(d => [d.name.toLowerCase(), d]));
  const trendingCoinNames = new Set(trendingCoins.map(c => c.name.toLowerCase()));

  // Fetch npm data for known packages
  console.log('\n📦 Fetching npm stats...');
  const npmData = await batchFetchNpmDownloads(SLUG_TO_NPM);
  console.log(`  Got npm data for ${npmData.size} packages`);

  // ── 2. Evaluate each listing ───────────────────────────────────

  console.log('\n🔍 Evaluating listings...');

  const updates: ListingUpdate[] = [];
  const newStarCounts: Record<string, number> = {};
  const newTvlValues: Record<string, number> = {};

  for (const listing of listings) {
    const metrics: ProjectMetrics = {};

    // GitHub stars
    if (listing.github) {
      const repo = extractGitHubRepo(listing.github);
      if (repo) {
        try {
          const { stars } = await getRepoStars(repo);
          newStarCounts[repo] = stars;

          const prevStars = state.githubStars[repo];
          if (prevStars !== undefined) {
            metrics.githubStarsWeek = computeStarDelta(stars, prevStars);
          }
          metrics.githubStarsTotal = stars;

          // Small delay for rate limiting
          await new Promise(r => setTimeout(r, 100));
        } catch (err) {
          // Don't fail the whole run for one repo
        }
      }
    }

    // DeFi TVL
    const defiMatch = defiByName.get(listing.name.toLowerCase())
      || defiBySlug.get(listing.slug.toLowerCase());
    if (defiMatch) {
      metrics.tvlCurrent = defiMatch.tvl;
      newTvlValues[listing.slug] = defiMatch.tvl;

      const prevTvl = state.protocolTvl[listing.slug];
      if (prevTvl !== undefined && prevTvl > 0) {
        metrics.tvlWoWChange = computeTvlWoW(defiMatch.tvl, prevTvl);
      } else if (defiMatch.change_7d !== null) {
        metrics.tvlWoWChange = defiMatch.change_7d;
      }

      // DEX volume
      const dexMatch = dexByName.get(listing.name.toLowerCase());
      if (dexMatch) {
        metrics.dailyVolume = dexMatch.totalVolume24h;
      }
    }

    // npm downloads
    const npmInfo = npmData.get(listing.slug);
    if (npmInfo) {
      metrics.npmDownloadsWeek = npmInfo.thisWeek;
      metrics.npmDownloadsPrevWeek = npmInfo.prevWeek;
      metrics.npmDownloadsWoWChange = npmInfo.wowChange;
    }

    // CoinGecko trending
    if (trendingCoinNames.has(listing.name.toLowerCase())) {
      metrics.coingeckoTrending = true;
      const coin = trendingCoins.find(c => c.name.toLowerCase() === listing.name.toLowerCase());
      if (coin) metrics.coingeckoTrendingRank = coin.score;
    }

    // RSS mentions
    metrics.newsmentionCount = countMentions(rssItems, listing.name);

    // Compute new status
    const { status: newStatus, reason } = computeStatus(
      listing.category,
      metrics,
      listing.dateAdded,
    );

    if (newStatus !== listing.status) {
      updates.push({
        slug: listing.slug,
        filePath: listing.filePath,
        changes: [],
        newStatus,
        statusReason: reason,
      });
    }
  }

  // ── 3. Update state with new values ────────────────────────────

  state.githubStars = { ...state.githubStars, ...newStarCounts };
  state.protocolTvl = { ...state.protocolTvl, ...newTvlValues };

  // ── 4. Output results ──────────────────────────────────────────

  console.log(`\n📝 ${updates.length} status changes recommended:\n`);

  if (updates.length === 0) {
    console.log('No status changes needed today.');
    saveState(state);
    return;
  }

  // Group by change type
  const promotions = updates.filter(u => statusRank(u.newStatus!) > statusRank(
    listings.find(l => l.slug === u.slug)!.status
  ));
  const demotions = updates.filter(u => statusRank(u.newStatus!) < statusRank(
    listings.find(l => l.slug === u.slug)!.status
  ));

  if (promotions.length > 0) {
    console.log('⬆️  Promotions:');
    for (const u of promotions) {
      const listing = listings.find(l => l.slug === u.slug)!;
      console.log(`  ${listing.name}: ${listing.status} → ${u.newStatus}`);
      console.log(`    Reason: ${u.statusReason}`);
    }
  }

  if (demotions.length > 0) {
    console.log('\n⬇️  Demotions:');
    for (const u of demotions) {
      const listing = listings.find(l => l.slug === u.slug)!;
      console.log(`  ${listing.name}: ${listing.status} → ${u.newStatus}`);
      console.log(`    Reason: ${u.statusReason}`);
    }
  }

  // Write update summary for the GitHub Action to pick up
  const outputPath = 'scripts/automation/update-output.json';
  writeFileSync(outputPath, JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    updates: updates.map(u => ({
      slug: u.slug,
      filePath: u.filePath,
      currentStatus: listings.find(l => l.slug === u.slug)?.status,
      newStatus: u.newStatus,
      reason: u.statusReason,
    })),
  }, null, 2));

  console.log(`\n📄 Update summary written to ${outputPath}`);

  // ── 5. Apply changes to files (when run in CI) ─────────────────

  if (process.env.APPLY_CHANGES === 'true') {
    console.log('\n✏️  Applying status changes to files...');

    for (const update of updates) {
      if (!update.newStatus) continue;

      try {
        let content = readFileSync(update.filePath, 'utf-8');
        const listing = listings.find(l => l.slug === update.slug)!;

        // Replace status in frontmatter
        content = content.replace(
          new RegExp(`status:\\s*["']?${listing.status}["']?`),
          `status: "${update.newStatus}"`
        );

        writeFileSync(update.filePath, content);
        console.log(`  ✓ ${update.slug}: ${listing.status} → ${update.newStatus}`);
      } catch (err) {
        console.error(`  ✗ Failed to update ${update.slug}:`, err);
      }
    }
  }

  saveState(state);
  console.log('\n✅ Updater run complete.');
}

function statusRank(status: Status): number {
  const ranks: Record<Status, number> = { stable: 0, new: 1, trending: 2, hot: 3 };
  return ranks[status] ?? 0;
}

// ─── Run ──────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Updater failed:', err);
  process.exit(1);
});
