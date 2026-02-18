import { APIS } from '../config.js';

/**
 * Fetch weekly download count for an npm package.
 */
export async function fetchNpmDownloads(packageName: string): Promise<{
  downloads: number;
  start: string;
  end: string;
} | null> {
  try {
    const url = `${APIS.npm.downloads}/point/last-week/${encodeURIComponent(packageName)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'toomuch-sh-automation' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      downloads: data.downloads || 0,
      start: data.start || '',
      end: data.end || '',
    };
  } catch {
    return null;
  }
}

/**
 * Fetch daily download breakdown for computing week-over-week changes.
 * Gets last 14 days so we can compare this week vs previous week.
 */
export async function fetchNpmDownloadRange(packageName: string): Promise<{
  thisWeek: number;
  prevWeek: number;
  wowChange: number; // percentage
} | null> {
  try {
    const end = new Date();
    const start = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const url = `${APIS.npm.downloads}/range/${startStr}:${endStr}/${encodeURIComponent(packageName)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'toomuch-sh-automation' },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const days = data.downloads || [];

    // Split into two weeks
    const midpoint = Math.floor(days.length / 2);
    const prevWeek = days.slice(0, midpoint).reduce((sum: number, d: any) => sum + d.downloads, 0);
    const thisWeek = days.slice(midpoint).reduce((sum: number, d: any) => sum + d.downloads, 0);

    const wowChange = prevWeek > 0 ? ((thisWeek - prevWeek) / prevWeek) * 100 : 0;

    return { thisWeek, prevWeek, wowChange };
  } catch {
    return null;
  }
}

/**
 * Batch fetch npm download data for multiple packages.
 */
export async function batchFetchNpmDownloads(
  packages: Record<string, string> // slug -> npm package name
): Promise<Map<string, { thisWeek: number; prevWeek: number; wowChange: number }>> {
  const results = new Map();
  for (const [slug, pkgName] of Object.entries(packages)) {
    const data = await fetchNpmDownloadRange(pkgName);
    if (data) {
      results.set(slug, data);
    }
    // Small delay to be polite
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
}
