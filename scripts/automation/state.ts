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
}

const DEFAULT_STATE: AutomationState = {
  lastRun: '',
  githubStars: {},
  protocolTvl: {},
  coingeckoTrendingStreak: {},
  knownProtocolSlugs: [],
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
