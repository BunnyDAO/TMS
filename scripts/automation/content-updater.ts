/**
 * Content Updater — Detects stale listings and batch-updates content via Claude.
 *
 * Stale criteria:
 * - GitHub repo had a release in the last 7 days
 * - TVL changed by 50%+
 * - Listing is 90+ days old and never updated
 *
 * Stale listings get batched to Claude (5-10 per call) for targeted rewrites.
 */
import { readFileSync, writeFileSync } from 'fs';
import Anthropic from '@anthropic-ai/sdk';

import { getLatestRelease } from './sources/github.js';
import { extractGitHubRepo, FRESHNESS_THRESHOLDS } from './config.js';
import { loadState, saveState } from './state.js';
import type { ExistingListing, StaleDetection, ContentRewrite, StaleReason } from './types.js';
import type { AutomationState } from './state.js';

/**
 * Detect stale listings and rewrite their content via Claude.
 * Returns rewritten files ready to be committed.
 */
export async function updateStaleContent(
  listings: ExistingListing[],
  state: AutomationState,
): Promise<ContentRewrite[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('  ⚠️  ANTHROPIC_API_KEY not set, skipping content updates');
    return [];
  }

  // ── 1. Detect stale listings ──────────────────────────────────
  const staleDetections = await detectStaleListings(listings, state);

  if (staleDetections.length === 0) {
    console.log('  No stale listings detected');
    return [];
  }

  console.log(`  Found ${staleDetections.length} stale listings:`);
  for (const d of staleDetections) {
    console.log(`    ${d.listing.name}: ${d.reasons.join(', ')}`);
  }

  // ── 2. Batch rewrite via Claude ───────────────────────────────
  const batched = staleDetections.slice(0, FRESHNESS_THRESHOLDS.maxBatchSize);
  const rewrites = await batchRewriteContent(apiKey, batched);

  // ── 3. Update state with review timestamps ────────────────────
  const now = new Date().toISOString();
  for (const detection of staleDetections) {
    state.lastContentReview[detection.listing.slug] = now;
  }

  return rewrites;
}

async function detectStaleListings(
  listings: ExistingListing[],
  state: AutomationState,
): Promise<StaleDetection[]> {
  const detections: StaleDetection[] = [];
  const now = Date.now();

  for (const listing of listings) {
    const reasons: StaleReason[] = [];
    const context: StaleDetection['context'] = {
      daysSinceUpdate: 0,
    };

    // Check listing age
    const lastReview = state.lastContentReview[listing.slug];
    const dateAdded = new Date(listing.dateAdded).getTime();
    const lastReviewTime = lastReview ? new Date(lastReview).getTime() : dateAdded;
    const daysSinceUpdate = Math.floor((now - lastReviewTime) / (1000 * 60 * 60 * 24));
    context.daysSinceUpdate = daysSinceUpdate;

    if (daysSinceUpdate >= FRESHNESS_THRESHOLDS.maxAgeDays) {
      reasons.push('age');
    }

    // Check GitHub releases
    if (listing.github) {
      const repo = extractGitHubRepo(listing.github);
      if (repo) {
        try {
          const releaseDate = await getLatestRelease(repo);
          if (releaseDate) {
            const releaseDaysAgo = Math.floor((now - new Date(releaseDate).getTime()) / (1000 * 60 * 60 * 24));
            if (releaseDaysAgo <= FRESHNESS_THRESHOLDS.releaseWindowDays) {
              reasons.push('recent-release');
              context.latestRelease = releaseDate;
            }

            // Track release version
            state.githubReleaseVersions[repo] = releaseDate;
          }
          await new Promise(r => setTimeout(r, 100)); // rate limit
        } catch {}
      }
    }

    // Check TVL changes
    const currentTvl = state.protocolTvl[listing.slug];
    if (currentTvl !== undefined) {
      const prevTvl = state.protocolTvl[listing.slug];
      if (prevTvl && prevTvl > 0) {
        const change = Math.abs((currentTvl - prevTvl) / prevTvl * 100);
        if (change >= FRESHNESS_THRESHOLDS.tvlChangePercent) {
          reasons.push('tvl-shift');
          context.tvlChange = change;
        }
      }
    }

    if (reasons.length > 0) {
      const currentContent = readFileSync(listing.filePath, 'utf-8');
      detections.push({ listing, reasons, currentContent, context });
    }
  }

  return detections;
}

async function batchRewriteContent(
  apiKey: string,
  detections: StaleDetection[],
): Promise<ContentRewrite[]> {
  const client = new Anthropic({ apiKey });

  const listingsContext = detections.map(d => ({
    name: d.listing.name,
    slug: d.listing.slug,
    category: d.listing.category,
    reasons: d.reasons,
    context: d.context,
    currentContent: d.currentContent,
  }));

  const prompt = `You are updating stale listings for toomuch.sh, a curated directory of tools.

I have ${detections.length} listings that need content updates. For each one, I'll tell you WHY it's stale and provide the current content. Rewrite ONLY the outdated sections.

RULES:
- Keep the YAML frontmatter structure exactly the same (same fields, same format)
- Only update sections that are actually outdated
- For "recent-release": update the Getting Started section if version numbers changed, add note about latest release in Key Features
- For "tvl-shift": update any TVL/volume numbers mentioned in description or body
- For "age": refresh the description and key features to be current, remove any outdated claims
- Keep the same tone and style as the original
- Keep the same slug, category, and subcategory
- Do NOT change dateAdded
- Do NOT invent features or data you're not sure about

Listings to update:
${JSON.stringify(listingsContext, null, 2)}

Respond with valid JSON only (no markdown code fences):
{
  "rewrites": [
    {
      "slug": "tool-slug",
      "newContent": "---\\nname: \\"...full rewritten .md file content...",
      "changesSummary": "Updated description to reflect v2.0 release, refreshed feature list"
    }
  ]
}

If a listing doesn't actually need changes after review, omit it from the rewrites array.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16384,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    const parsed = JSON.parse(jsonMatch[0]);

    return (parsed.rewrites || []).map((r: any) => {
      const detection = detections.find(d => d.listing.slug === r.slug);
      return {
        slug: r.slug,
        filePath: detection?.listing.filePath || '',
        newContent: r.newContent,
        changesSummary: r.changesSummary || '',
      };
    }).filter((r: ContentRewrite) => r.filePath && r.newContent);
  } catch (err) {
    console.error('  Failed to parse content rewrite response:', err);
    return [];
  }
}
