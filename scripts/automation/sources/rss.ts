import { XMLParser } from 'fast-xml-parser';
import { RSS_FEEDS } from '../config.js';
import type { RSSItem, CategoryKey } from '../types.js';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

/**
 * Fetch and parse a single RSS feed.
 */
async function fetchFeed(url: string, sourceName: string): Promise<RSSItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'toomuch-sh-automation' },
      signal: AbortSignal.timeout(10000), // 10s timeout per feed
    });
    if (!res.ok) {
      console.warn(`RSS fetch failed for ${sourceName}: ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const parsed = parser.parse(xml);

    // Handle both RSS 2.0 and Atom feed formats
    let items: any[] = [];

    if (parsed.rss?.channel?.item) {
      items = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];
    } else if (parsed.feed?.entry) {
      items = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];
    }

    return items.map((item: any) => ({
      title: item.title || item['media:title'] || '',
      link: item.link?.['@_href'] || item.link || item.guid || '',
      pubDate: item.pubDate || item.published || item.updated || '',
      description: stripHtml(item.description || item.summary || item.content || ''),
      source: sourceName,
    }));
  } catch (err) {
    console.warn(`RSS error for ${sourceName}:`, err);
    return [];
  }
}

/**
 * Strip HTML tags from a string (basic implementation).
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500); // cap at 500 chars
}

/**
 * Fetch all configured RSS feeds and return items from the last N days.
 */
export async function fetchAllFeeds(maxAgeDays: number = 7): Promise<RSSItem[]> {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

  const feedPromises = RSS_FEEDS.map(feed =>
    fetchFeed(feed.url, feed.name)
  );

  const results = await Promise.allSettled(feedPromises);
  const allItems: RSSItem[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  // Filter to recent items only
  return allItems.filter(item => {
    if (!item.pubDate) return true; // include items without dates
    const itemDate = new Date(item.pubDate).getTime();
    return !isNaN(itemDate) ? itemDate >= cutoff : true;
  });
}

/**
 * Fetch RSS feeds filtered by category.
 */
export async function fetchFeedsByCategory(
  category: CategoryKey,
  maxAgeDays: number = 7
): Promise<RSSItem[]> {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const relevantFeeds = RSS_FEEDS.filter(f => f.categories.includes(category));

  const feedPromises = relevantFeeds.map(feed =>
    fetchFeed(feed.url, feed.name)
  );

  const results = await Promise.allSettled(feedPromises);
  const allItems: RSSItem[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  return allItems.filter(item => {
    if (!item.pubDate) return true;
    const itemDate = new Date(item.pubDate).getTime();
    return !isNaN(itemDate) ? itemDate >= cutoff : true;
  });
}

/**
 * Count how many times a term is mentioned across recent RSS items.
 * Useful for gauging buzz around a specific tool/protocol.
 */
export function countMentions(items: RSSItem[], term: string): number {
  const lowerTerm = term.toLowerCase();
  return items.filter(item =>
    item.title.toLowerCase().includes(lowerTerm) ||
    item.description.toLowerCase().includes(lowerTerm)
  ).length;
}

/**
 * Find the most mentioned terms in recent RSS items.
 * Cross-references against a list of known project names.
 */
export function findTrendingMentions(
  items: RSSItem[],
  knownNames: string[]
): { name: string; count: number }[] {
  const counts = knownNames.map(name => ({
    name,
    count: countMentions(items, name),
  }));

  return counts
    .filter(c => c.count >= 2) // at least 2 mentions
    .sort((a, b) => b.count - a.count);
}
