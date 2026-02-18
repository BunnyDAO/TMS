import { APIS } from '../config.js';
import type { GitHubTrendingRepo } from '../types.js';

const headers: Record<string, string> = {
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'toomuch-sh-automation',
};

// Add auth token if available (raises rate limit from 60 to 5000 req/hr)
if (process.env.GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function githubFetch(path: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`${APIS.github.base}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Find trending repos by searching for recently created repos with high star counts.
 * GitHub has no official trending API, so we use search as a proxy.
 */
export async function fetchTrendingRepos(options?: {
  language?: string;
  createdAfter?: string; // ISO date, e.g. "2026-02-10"
  minStars?: number;
}): Promise<GitHubTrendingRepo[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const createdAfter = options?.createdAfter || sevenDaysAgo;
  const minStars = options?.minStars ?? 100;

  let q = `created:>${createdAfter} stars:>=${minStars}`;
  if (options?.language) q += ` language:${options.language}`;

  const data = await githubFetch(APIS.github.searchRepos, {
    q,
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  });

  return (data.items || []).map((repo: any) => ({
    name: repo.full_name,
    description: repo.description || '',
    url: repo.html_url,
    stars: repo.stargazers_count,
    starsToday: 0, // can't get daily delta from search, computed via state file
    language: repo.language || '',
    forks: repo.forks_count,
  }));
}

/**
 * Also search for repos that aren't new but are growing fast.
 * These are older repos with recent high activity.
 */
export async function fetchFastGrowingRepos(options?: {
  topic?: string;
  minStars?: number;
}): Promise<GitHubTrendingRepo[]> {
  const minStars = options?.minStars ?? 500;
  const pushedAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  let q = `pushed:>${pushedAfter} stars:>=${minStars}`;
  if (options?.topic) q += ` topic:${options.topic}`;

  const data = await githubFetch(APIS.github.searchRepos, {
    q,
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  });

  return (data.items || []).map((repo: any) => ({
    name: repo.full_name,
    description: repo.description || '',
    url: repo.html_url,
    stars: repo.stargazers_count,
    starsToday: 0,
    language: repo.language || '',
    forks: repo.forks_count,
  }));
}

/**
 * Get star count for a specific repo.
 * Used to track growth of existing listings.
 */
export async function getRepoStars(ownerRepo: string): Promise<{
  stars: number;
  lastRelease?: string;
  description: string;
  topics: string[];
}> {
  const data = await githubFetch(`${APIS.github.repo}/${ownerRepo}`);
  return {
    stars: data.stargazers_count,
    description: data.description || '',
    topics: data.topics || [],
  };
}

/**
 * Get the latest release date for a repo.
 */
export async function getLatestRelease(ownerRepo: string): Promise<string | null> {
  try {
    const data = await githubFetch(`${APIS.github.repo}/${ownerRepo}/releases/latest`);
    return data.published_at || data.created_at || null;
  } catch {
    return null;
  }
}

/**
 * Batch fetch star counts for multiple repos.
 * Respects rate limits by processing sequentially with small delays.
 */
export async function batchGetRepoStars(repos: string[]): Promise<Map<string, number>> {
  const results = new Map<string, number>();
  for (const repo of repos) {
    try {
      const data = await getRepoStars(repo);
      results.set(repo, data.stars);
      // Small delay to be respectful of rate limits
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.warn(`Failed to fetch stars for ${repo}:`, err);
    }
  }
  return results;
}
