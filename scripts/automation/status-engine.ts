import { AI_THRESHOLDS, DEFI_THRESHOLDS } from './config.js';
import type { Status, CategoryKey, ProjectMetrics } from './types.js';

/**
 * Compute the status label for a project based on its metrics and category.
 *
 * Priority: new > hot > trending > stable
 * "new" overrides everything if within the window.
 * "hot" requires meeting at least one "hot" threshold.
 * "trending" requires meeting at least one "trending" threshold.
 * "stable" is the default.
 */
export function computeStatus(
  category: CategoryKey,
  metrics: ProjectMetrics,
  dateAdded?: string,
): { status: Status; reason: string } {
  // Check "new" first — within the configured window
  const windowDays = isDefiCategory(category)
    ? DEFI_THRESHOLDS.newWindowDays
    : AI_THRESHOLDS.newWindowDays;

  if (dateAdded) {
    const addedDate = new Date(dateAdded).getTime();
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    if (addedDate >= cutoff) {
      return { status: 'new', reason: `Added within last ${windowDays} days` };
    }
  }

  if (metrics.daysSinceFirstSeen !== undefined && metrics.daysSinceFirstSeen <= windowDays) {
    return { status: 'new', reason: `First seen ${metrics.daysSinceFirstSeen} days ago` };
  }

  // Category-specific evaluation
  if (isDefiCategory(category)) {
    return evaluateDefi(metrics);
  } else {
    return evaluateAiDevTool(metrics);
  }
}

function isDefiCategory(category: CategoryKey): boolean {
  return ['bitcoin', 'ethereum', 'solana', 'rwa', 'infra'].includes(category);
}

/**
 * Evaluate status for AI / dev tool projects.
 * Uses GitHub stars/week and npm download velocity.
 */
function evaluateAiDevTool(m: ProjectMetrics): { status: Status; reason: string } {
  const reasons: string[] = [];
  let hotSignals = 0;
  let trendingSignals = 0;

  // GitHub star velocity
  if (m.githubStarsWeek !== undefined) {
    if (m.githubStarsWeek >= AI_THRESHOLDS.hot.githubStarsWeek) {
      hotSignals++;
      reasons.push(`${m.githubStarsWeek} GitHub stars this week (hot threshold: ${AI_THRESHOLDS.hot.githubStarsWeek})`);
    } else if (m.githubStarsWeek >= AI_THRESHOLDS.trending.githubStarsWeek) {
      trendingSignals++;
      reasons.push(`${m.githubStarsWeek} GitHub stars this week (trending threshold: ${AI_THRESHOLDS.trending.githubStarsWeek})`);
    }
  }

  // npm download velocity
  if (m.npmDownloadsWoWChange !== undefined) {
    if (m.npmDownloadsWoWChange >= AI_THRESHOLDS.hot.npmWoWChange) {
      hotSignals++;
      reasons.push(`${m.npmDownloadsWoWChange.toFixed(0)}% npm WoW increase (hot threshold: ${AI_THRESHOLDS.hot.npmWoWChange}%)`);
    } else if (m.npmDownloadsWoWChange >= AI_THRESHOLDS.trending.npmWoWChange) {
      trendingSignals++;
      reasons.push(`${m.npmDownloadsWoWChange.toFixed(0)}% npm WoW increase (trending threshold: ${AI_THRESHOLDS.trending.npmWoWChange}%)`);
    }
  }

  // News mentions as a bonus signal (doesn't promote on its own, but reinforces)
  if (m.newsmentionCount !== undefined && m.newsmentionCount >= 3) {
    trendingSignals++;
    reasons.push(`${m.newsmentionCount} news mentions in last 7 days`);
  }

  // Determine final status
  if (hotSignals >= 1) {
    return { status: 'hot', reason: reasons.join('; ') };
  }
  if (trendingSignals >= 1) {
    return { status: 'trending', reason: reasons.join('; ') };
  }
  return { status: 'stable', reason: 'No signals above thresholds' };
}

/**
 * Evaluate status for DeFi / crypto protocols.
 * Uses TVL growth, daily volume, and social signals.
 */
function evaluateDefi(m: ProjectMetrics): { status: Status; reason: string } {
  const reasons: string[] = [];
  let hotSignals = 0;
  let trendingSignals = 0;

  // TVL week-over-week growth
  if (m.tvlWoWChange !== undefined) {
    if (m.tvlWoWChange >= DEFI_THRESHOLDS.hot.tvlWoWChange) {
      hotSignals++;
      reasons.push(`${m.tvlWoWChange.toFixed(1)}% TVL WoW growth (hot threshold: ${DEFI_THRESHOLDS.hot.tvlWoWChange}%)`);
    } else if (m.tvlWoWChange >= DEFI_THRESHOLDS.trending.tvlWoWChange) {
      trendingSignals++;
      reasons.push(`${m.tvlWoWChange.toFixed(1)}% TVL WoW growth (trending threshold: ${DEFI_THRESHOLDS.trending.tvlWoWChange}%)`);
    }
  }

  // Daily volume
  if (m.dailyVolume !== undefined) {
    if (m.dailyVolume >= DEFI_THRESHOLDS.hot.dailyVolume) {
      hotSignals++;
      reasons.push(`$${(m.dailyVolume / 1_000_000).toFixed(1)}M daily volume (hot threshold: $${DEFI_THRESHOLDS.hot.dailyVolume / 1_000_000}M)`);
    } else if (m.dailyVolume >= DEFI_THRESHOLDS.trending.dailyVolume) {
      trendingSignals++;
      reasons.push(`$${(m.dailyVolume / 1_000_000).toFixed(1)}M daily volume (trending threshold: $${DEFI_THRESHOLDS.trending.dailyVolume / 1_000_000}M)`);
    }
  }

  // CoinGecko trending
  if (m.coingeckoTrending) {
    trendingSignals++;
    reasons.push(`Trending on CoinGecko (#${m.coingeckoTrendingRank ?? '?'})`);
  }

  // News mentions
  if (m.newsmentionCount !== undefined && m.newsmentionCount >= 3) {
    trendingSignals++;
    reasons.push(`${m.newsmentionCount} news mentions in last 7 days`);
  }

  // GitHub star growth (for open-source protocols)
  if (m.githubStarsWeek !== undefined && m.githubStarsWeek >= AI_THRESHOLDS.trending.githubStarsWeek) {
    trendingSignals++;
    reasons.push(`${m.githubStarsWeek} GitHub stars this week`);
  }

  if (hotSignals >= 1) {
    return { status: 'hot', reason: reasons.join('; ') };
  }
  if (trendingSignals >= 1) {
    return { status: 'trending', reason: reasons.join('; ') };
  }
  return { status: 'stable', reason: 'No signals above thresholds' };
}

/**
 * Compute TVL week-over-week change from current and previous values.
 */
export function computeTvlWoW(current: number, prevWeek: number): number {
  if (prevWeek <= 0) return 0;
  return ((current - prevWeek) / prevWeek) * 100;
}

/**
 * Compute GitHub star week-over-week delta from current and previous counts.
 */
export function computeStarDelta(current: number, prevWeek: number): number {
  return current - prevWeek;
}
