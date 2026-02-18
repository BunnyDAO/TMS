import { readFileSync, writeFileSync, existsSync } from 'fs';
import { OUTPUT } from './config.js';

/**
 * State persisted between runs for computing deltas.
 * Tracks previous star counts, TVL values, CoinGecko trending streaks, etc.
 */
export interface AutomationState {
  lastRun: string; // ISO date
  githubStars: Record<string, number>; // ownerRepo -> star count
  protocolTvl: Record<string, number>; // slug -> TVL
  coingeckoTrendingStreak: Record<string, number>; // coin id -> consecutive trending days
  knownProtocolSlugs: string[]; // DeFi Llama slugs we've seen before
  /** ISO date of last content freshness review per listing slug */
  lastContentReview: Record<string, string>;
  /** Last known GitHub release version per ownerRepo */
  githubReleaseVersions: Record<string, string>;
  /** Slugs auto-added in previous runs (to avoid re-adding) */
  autoAddedSlugs: string[];
}

const DEFAULT_STATE: AutomationState = {
  lastRun: '',
  githubStars: {},
  protocolTvl: {},
  coingeckoTrendingStreak: {},
  knownProtocolSlugs: [],
  lastContentReview: {},
  githubReleaseVersions: {},
  autoAddedSlugs: [],
};

export function loadState(): AutomationState {
  const path = OUTPUT.stateFile;
  if (!existsSync(path)) return { ...DEFAULT_STATE };
  try {
    const raw = readFileSync(path, 'utf-8');
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: AutomationState): void {
  state.lastRun = new Date().toISOString();
  writeFileSync(OUTPUT.stateFile, JSON.stringify(state, null, 2));
}

/**
 * Save a partial state delta (for parallel workflow jobs).
 * Each job writes its own delta; merge-state.ts combines them later.
 */
export function saveStateDelta(deltaPath: string, delta: Partial<AutomationState>): void {
  writeFileSync(deltaPath, JSON.stringify(delta, null, 2));
}

/**
 * Merge a delta into the base state (additive for objects/arrays).
 */
export function mergeStateDelta(base: AutomationState, delta: Partial<AutomationState>): AutomationState {
  return {
    ...base,
    lastRun: delta.lastRun || base.lastRun,
    githubStars: { ...base.githubStars, ...delta.githubStars },
    protocolTvl: { ...base.protocolTvl, ...delta.protocolTvl },
    coingeckoTrendingStreak: { ...base.coingeckoTrendingStreak, ...delta.coingeckoTrendingStreak },
    knownProtocolSlugs: [...new Set([...base.knownProtocolSlugs, ...(delta.knownProtocolSlugs || [])])],
    lastContentReview: { ...base.lastContentReview, ...delta.lastContentReview },
    githubReleaseVersions: { ...base.githubReleaseVersions, ...delta.githubReleaseVersions },
    autoAddedSlugs: [...new Set([...base.autoAddedSlugs, ...(delta.autoAddedSlugs || [])])],
  };
}
