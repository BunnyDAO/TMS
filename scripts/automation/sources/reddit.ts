import { APIS, REDDIT_SUBREDDITS } from '../config.js';
import type { DiscoveryCandidate, CategoryKey } from '../types.js';

let accessToken: string | null = null;

/**
 * Authenticate with Reddit using OAuth client_credentials flow.
 * Requires REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET env vars.
 */
async function authenticate(): Promise<string> {
  if (accessToken) return accessToken;

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required');
  }

  const res = await fetch(APIS.reddit.authUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'toomuch-sh-automation/1.0',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`Reddit auth failed ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  accessToken = data.access_token;
  return accessToken!;
}

async function redditFetch(path: string): Promise<any> {
  const token = await authenticate();
  const res = await fetch(`${APIS.reddit.base}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'toomuch-sh-automation/1.0',
    },
  });

  if (!res.ok) {
    throw new Error(`Reddit API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

interface RedditPost {
  title: string;
  url: string;
  selftext: string;
  score: number;
  num_comments: number;
  permalink: string;
  subreddit: string;
  created_utc: number;
  link_flair_text?: string;
}

/**
 * Fetch hot + top/week posts from configured subreddits.
 * ~13 API calls per run (1 auth + 2 per subreddit).
 */
export async function fetchRedditItems(): Promise<DiscoveryCandidate[]> {
  const candidates: DiscoveryCandidate[] = [];

  for (const sub of REDDIT_SUBREDDITS) {
    try {
      const [hotData, topData] = await Promise.all([
        redditFetch(`/r/${sub.name}/hot.json?limit=25`),
        redditFetch(`/r/${sub.name}/top.json?t=week&limit=25`),
      ]);

      const hotPosts = extractPosts(hotData);
      const topPosts = extractPosts(topData);

      // Dedupe
      const seen = new Set<string>();
      const allPosts = [...hotPosts, ...topPosts].filter(p => {
        if (seen.has(p.permalink)) return false;
        seen.add(p.permalink);
        return true;
      });

      for (const post of allPosts) {
        // Skip low-engagement posts
        if (post.score < 100) continue;

        // Skip self-posts without external links (discussions only)
        const externalUrl = post.url && !post.url.includes('reddit.com') ? post.url : null;

        // Try to extract a tool/project name and URL
        const toolInfo = extractToolInfo(post);
        if (!toolInfo) continue;

        const category = sub.categories[0]; // primary category for this subreddit

        candidates.push({
          name: toolInfo.name,
          source: 'reddit',
          url: toolInfo.url || externalUrl || `https://reddit.com${post.permalink}`,
          description: `${post.title} (r/${post.subreddit}, ${post.score} upvotes, ${post.num_comments} comments)`,
          category,
          metrics: {
            newsmentionCount: 1,
          },
          relevanceScore: 0,
          reasoning: '',
        });
      }

      // Rate limit between subreddits
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.warn(`  Reddit r/${sub.name} fetch failed:`, err);
    }
  }

  return candidates;
}

function extractPosts(data: any): RedditPost[] {
  return (data?.data?.children || [])
    .filter((child: any) => child.kind === 't3')
    .map((child: any) => child.data as RedditPost);
}

/**
 * Try to extract a tool/project name from a Reddit post.
 * Returns null if it doesn't look like a tool announcement.
 */
function extractToolInfo(post: RedditPost): { name: string; url?: string } | null {
  const title = post.title;

  // Patterns that suggest a tool/project announcement
  const patterns = [
    // "[Project] MyTool - description"
    /\[(?:Project|Tool|Release|Launch|Show|New|Open.?Source)\]\s*:?\s*(.+?)(?:\s*[-–—:|]|$)/i,
    // "Introducing MyTool" or "Announcing MyTool"
    /(?:Introducing|Announcing|Released?|Launched?|Built|Created|Made)\s+(.+?)(?:\s*[-–—:|,]|$)/i,
    // "MyTool v1.0" or "MyTool 2.0 released"
    /^(.+?)\s+v?\d+\.\d+/i,
    // External URL with a descriptive title
    /^(.+?)(?:\s*[-–—:|])/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      const name = match[1].trim().slice(0, 60);
      // Skip if it's just a generic phrase
      if (name.length < 2 || name.split(' ').length > 6) continue;
      const url = post.url && !post.url.includes('reddit.com') ? post.url : undefined;
      return { name, url };
    }
  }

  // If post has an external URL, use the domain as a fallback name
  if (post.url && !post.url.includes('reddit.com')) {
    try {
      const hostname = new URL(post.url).hostname.replace('www.', '');
      return { name: hostname, url: post.url };
    } catch {}
  }

  return null;
}
