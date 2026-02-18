import { APIS, HN_KEYWORDS } from '../config.js';
import type { DiscoveryCandidate, CategoryKey } from '../types.js';

const HN_BASE = APIS.hackerNews.base;

async function hnFetch(path: string): Promise<any> {
  const res = await fetch(`${HN_BASE}${path}`);
  if (!res.ok) throw new Error(`HN API error ${res.status}`);
  return res.json();
}

interface HNItem {
  id: number;
  title: string;
  url?: string;
  text?: string;
  score: number;
  by: string;
  type: string;
  time: number;
}

/**
 * Fetch Show HN posts + top stories, filter by AI/crypto keywords.
 * ~60 API calls per run (fetch IDs + individual items).
 */
export async function fetchHackerNewsItems(): Promise<DiscoveryCandidate[]> {
  const [showIds, topIds] = await Promise.all([
    hnFetch(APIS.hackerNews.showStories) as Promise<number[]>,
    hnFetch(APIS.hackerNews.topStories) as Promise<number[]>,
  ]);

  // Take top 30 Show HN + top 30 stories
  const idsToFetch = [
    ...showIds.slice(0, 30),
    ...topIds.slice(0, 30),
  ];

  // Dedupe IDs
  const uniqueIds = [...new Set(idsToFetch)];

  // Fetch items in batches of 10
  const items: HNItem[] = [];
  for (let i = 0; i < uniqueIds.length; i += 10) {
    const batch = uniqueIds.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(id => hnFetch(`${APIS.hackerNews.item}/${id}.json`).catch(() => null))
    );
    items.push(...batchResults.filter(Boolean));
  }

  // Filter by keywords
  const candidates: DiscoveryCandidate[] = [];

  for (const item of items) {
    if (!item.title || !item.url) continue;
    if (item.score < 50) continue; // skip low-engagement posts

    const text = `${item.title} ${item.text || ''}`.toLowerCase();
    const matchedKeyword = HN_KEYWORDS.find(kw => text.includes(kw));
    if (!matchedKeyword) continue;

    const category = inferCategoryFromKeyword(matchedKeyword);

    candidates.push({
      name: extractToolName(item.title),
      source: 'hackernews',
      url: item.url,
      description: item.title,
      category,
      metrics: {
        newsmentionCount: 1,
      },
      relevanceScore: 0,
      reasoning: '',
    });
  }

  return candidates;
}

function inferCategoryFromKeyword(keyword: string): CategoryKey {
  const aiKeywords = [
    'llm', 'gpt', 'claude', 'ai', 'machine learning', 'deep learning',
    'stable diffusion', 'midjourney', 'copilot', 'hugging face', 'ollama',
    'langchain', 'vector database', 'rag', 'fine-tuning', 'transformer',
    'open source ai', 'local llm', 'ai agent',
  ];
  if (aiKeywords.includes(keyword)) return 'ai';

  const btcKeywords = ['bitcoin'];
  if (btcKeywords.includes(keyword)) return 'bitcoin';

  const ethKeywords = ['ethereum', 'rollup', 'zk', 'layer 2', 'l2'];
  if (ethKeywords.includes(keyword)) return 'ethereum';

  const solKeywords = ['solana'];
  if (solKeywords.includes(keyword)) return 'solana';

  const rwaKeywords = ['rwa', 'tokenization'];
  if (rwaKeywords.includes(keyword)) return 'rwa';

  return 'infra';
}

/**
 * Extract a likely tool/project name from a HN title.
 * e.g. "Show HN: MyTool – an AI assistant" → "MyTool"
 */
function extractToolName(title: string): string {
  // Strip "Show HN: " prefix
  let cleaned = title.replace(/^Show HN:\s*/i, '');
  // Take text before common delimiters
  const delimiters = [' – ', ' - ', ' — ', ': ', ' | '];
  for (const d of delimiters) {
    const idx = cleaned.indexOf(d);
    if (idx > 0 && idx < 40) {
      cleaned = cleaned.slice(0, idx);
      break;
    }
  }
  return cleaned.trim();
}
