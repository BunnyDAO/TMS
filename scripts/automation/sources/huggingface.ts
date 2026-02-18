import { APIS } from '../config.js';
import type { DiscoveryCandidate } from '../types.js';

const HF_BASE = APIS.huggingFace.base;

interface HFModel {
  id: string; // e.g. "meta-llama/Llama-3-70B"
  modelId: string;
  author?: string;
  downloads: number;
  likes: number;
  tags: string[];
  pipeline_tag?: string;
  lastModified?: string;
}

interface HFSpace {
  id: string; // e.g. "stabilityai/stable-diffusion-3"
  author?: string;
  likes: number;
  title?: string;
  short_description?: string;
  tags: string[];
  runtime?: { stage?: string };
  lastModified?: string;
}

async function hfFetch(path: string): Promise<any> {
  const res = await fetch(`${HF_BASE}${path}`, {
    headers: {
      'User-Agent': 'toomuch-sh-automation',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`HuggingFace API error ${res.status}: ${await res.text()}`);
  return res.json();
}

/**
 * Fetch trending models + spaces from HuggingFace Hub.
 * 2 API calls per run, no auth needed.
 */
export async function fetchHuggingFaceItems(): Promise<DiscoveryCandidate[]> {
  const [models, spaces] = await Promise.all([
    hfFetch(APIS.huggingFace.trendingModels).catch(() => [] as HFModel[]),
    hfFetch(APIS.huggingFace.trendingSpaces).catch(() => [] as HFSpace[]),
  ]);

  const candidates: DiscoveryCandidate[] = [];

  // Process trending models
  for (const model of (models as HFModel[])) {
    if (model.likes < 100) continue; // skip low-engagement

    const name = model.modelId || model.id;
    const author = model.author || name.split('/')[0];

    candidates.push({
      name: name.includes('/') ? name.split('/')[1] : name,
      source: 'huggingface',
      url: `https://huggingface.co/${model.id}`,
      description: `${name} by ${author} — ${model.pipeline_tag || 'AI model'}. ${model.downloads?.toLocaleString() || '?'} downloads, ${model.likes} likes on HuggingFace.`,
      category: 'ai',
      subcategory: pipelineToSubcategory(model.pipeline_tag),
      metrics: {
        npmDownloadsWeek: model.downloads, // repurpose as a popularity signal
      },
      relevanceScore: 0,
      reasoning: '',
    });
  }

  // Process trending spaces (interactive demos/apps)
  for (const space of (spaces as HFSpace[])) {
    if (space.likes < 50) continue;

    const name = space.id;
    const displayName = space.title || (name.includes('/') ? name.split('/')[1] : name);

    candidates.push({
      name: displayName,
      source: 'huggingface',
      url: `https://huggingface.co/spaces/${space.id}`,
      description: space.short_description || `${displayName} — trending AI space on HuggingFace. ${space.likes} likes.`,
      category: 'ai',
      subcategory: inferSpaceSubcategory(space.tags),
      metrics: {},
      relevanceScore: 0,
      reasoning: '',
    });
  }

  return candidates;
}

function pipelineToSubcategory(pipeline?: string): string {
  if (!pipeline) return 'models';
  const map: Record<string, string> = {
    'text-generation': 'llms',
    'text2text-generation': 'llms',
    'text-to-image': 'image-generation',
    'image-to-text': 'vision',
    'text-to-video': 'video-generation',
    'text-to-audio': 'audio',
    'text-to-speech': 'audio',
    'automatic-speech-recognition': 'audio',
    'feature-extraction': 'embeddings',
    'sentence-similarity': 'embeddings',
    'image-classification': 'vision',
    'object-detection': 'vision',
    'token-classification': 'nlp',
    'question-answering': 'nlp',
    'summarization': 'nlp',
    'translation': 'nlp',
    'fill-mask': 'nlp',
    'zero-shot-classification': 'nlp',
  };
  return map[pipeline] || 'models';
}

function inferSpaceSubcategory(tags: string[]): string {
  const tagStr = tags.join(' ').toLowerCase();
  if (tagStr.includes('image') || tagStr.includes('diffusion')) return 'image-generation';
  if (tagStr.includes('chat') || tagStr.includes('llm')) return 'llms';
  if (tagStr.includes('video')) return 'video-generation';
  if (tagStr.includes('audio') || tagStr.includes('speech')) return 'audio';
  if (tagStr.includes('code') || tagStr.includes('coding')) return 'coding';
  return 'ai-tools';
}
