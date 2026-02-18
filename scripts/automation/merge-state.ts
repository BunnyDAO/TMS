#!/usr/bin/env tsx
/**
 * Merge State — Combines state deltas from parallel workflow jobs.
 *
 * In the 3-job workflow structure:
 *   - scout-and-generate writes state-delta-scout.json
 *   - update-content writes state-delta-updater.json
 *   - commit-state (this script) merges both into state.json
 *
 * Usage:
 *   npx tsx scripts/automation/merge-state.ts [delta1.json] [delta2.json] ...
 */
import { existsSync, readFileSync } from 'fs';
import { loadState, saveState, mergeStateDelta } from './state.js';
import type { AutomationState } from './state.js';

function main() {
  const deltaFiles = process.argv.slice(2);

  if (deltaFiles.length === 0) {
    // Default delta file names
    deltaFiles.push(
      'scripts/automation/state-delta-scout.json',
      'scripts/automation/state-delta-updater.json',
    );
  }

  console.log('🔀 Merging state deltas...');

  let state = loadState();
  let merged = 0;

  for (const deltaFile of deltaFiles) {
    if (!existsSync(deltaFile)) {
      console.log(`  Skipping ${deltaFile} (not found)`);
      continue;
    }

    try {
      const raw = readFileSync(deltaFile, 'utf-8');
      const delta: Partial<AutomationState> = JSON.parse(raw);
      state = mergeStateDelta(state, delta);
      merged++;
      console.log(`  ✓ Merged ${deltaFile}`);
    } catch (err) {
      console.warn(`  ✗ Failed to merge ${deltaFile}:`, err);
    }
  }

  if (merged === 0) {
    console.log('  No deltas to merge.');
    return;
  }

  saveState(state);
  console.log(`\n✅ Merged ${merged} delta(s) into state.json`);
}

main();
