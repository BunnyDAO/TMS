/**
 * Enrichment — Fetches GitHub README + website metadata for auto-add candidates.
 * Used to give Claude enough context to generate a high-quality listing.
 */
import { APIS } from './config.js';
import type { AutoAddCandidate, EnrichedCandidate } from './types.js';

const GITHUB_HEADERS: Record<string, string> = {
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'toomuch-sh-automation',
};

if (process.env.GITHUB_TOKEN) {
  GITHUB_HEADERS['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

/**
 * Enrich auto-add candidates with README content and website metadata.
 * Each candidate gets its GitHub README (first 3000 chars) and website
 * meta tags (title, description, og:image) so Claude can write a good listing.
 */
export async function enrichCandidates(candidates: AutoAddCandidate[]): Promise<EnrichedCandidate[]> {
  const enriched: EnrichedCandidate[] = [];

  for (const candidate of candidates) {
    let readme: string | undefined;
    let websiteMeta: EnrichedCandidate['websiteMeta'];

    // Fetch GitHub README if URL points to GitHub
    const githubRepo = extractGitHubRepo(candidate.url);
    if (githubRepo) {
      readme = await fetchReadme(githubRepo);
    }

    // Fetch website meta tags
    const websiteUrl = candidate.url.includes('github.com')
      ? undefined // skip, we already have the README
      : candidate.url;
    if (websiteUrl) {
      websiteMeta = await fetchWebsiteMeta(websiteUrl);
    }

    enriched.push({
      ...candidate,
      readme,
      websiteMeta,
    });

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  return enriched;
}

/**
 * Fetch the raw README content from a GitHub repo.
 * Returns first 3000 characters to keep Claude's context manageable.
 */
async function fetchReadme(ownerRepo: string): Promise<string | undefined> {
  try {
    const url = `${APIS.github.base}/repos/${ownerRepo}/readme`;
    const res = await fetch(url, {
      headers: {
        ...GITHUB_HEADERS,
        'Accept': 'application/vnd.github.raw+json',
      },
    });
    if (!res.ok) return undefined;
    const text = await res.text();
    return text.slice(0, 3000);
  } catch {
    return undefined;
  }
}

/**
 * Fetch basic meta tags from a website (title, description, og:image).
 * We only fetch the first 50KB of HTML to avoid downloading huge pages.
 */
async function fetchWebsiteMeta(url: string): Promise<EnrichedCandidate['websiteMeta'] | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'toomuch-sh-automation (bot)',
        'Accept': 'text/html',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) return undefined;

    // Read only first 50KB
    const reader = res.body?.getReader();
    if (!reader) return undefined;

    let html = '';
    const decoder = new TextDecoder();
    while (html.length < 50_000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel();

    return parseMetaTags(html);
  } catch {
    return undefined;
  }
}

function parseMetaTags(html: string): EnrichedCandidate['websiteMeta'] {
  const meta: EnrichedCandidate['websiteMeta'] = {};

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) meta.title = decodeEntities(titleMatch[1].trim());

  // Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  if (descMatch) meta.description = decodeEntities(descMatch[1].trim());

  // OG image
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (ogMatch) meta.ogImage = ogMatch[1].trim();

  // OG description as fallback
  if (!meta.description) {
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
    if (ogDescMatch) meta.description = decodeEntities(ogDescMatch[1].trim());
  }

  return meta;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}

function extractGitHubRepo(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('github.com')) return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch {}
  return null;
}
