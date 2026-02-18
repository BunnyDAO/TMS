import { APIS } from '../config.js';
import type { DefiLlamaProtocol } from '../types.js';

async function llamaFetch(path: string): Promise<any> {
  const url = `${APIS.defiLlama.base}${path}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'toomuch-sh-automation' },
  });
  if (!res.ok) {
    throw new Error(`DeFi Llama API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * Fetch all protocols from DeFi Llama.
 * Returns basic data including TVL, chain, category, and listing timestamp.
 */
export async function fetchAllProtocols(): Promise<DefiLlamaProtocol[]> {
  const data = await llamaFetch(APIS.defiLlama.protocols);
  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    url: p.url || '',
    description: p.description || '',
    chain: p.chain || '',
    chains: p.chains || [],
    tvl: p.tvl || 0,
    change_1d: p.change_1d ?? null,
    change_7d: p.change_7d ?? null,
    category: p.category || '',
    listedAt: p.listedAt || 0,
    github: p.github || undefined,
  }));
}

/**
 * Find protocols that were recently added to DeFi Llama.
 * "Recent" = added within the last N days.
 */
export async function fetchNewProtocols(maxAgeDays: number = 30): Promise<DefiLlamaProtocol[]> {
  const protocols = await fetchAllProtocols();
  const cutoff = Date.now() / 1000 - maxAgeDays * 24 * 60 * 60;

  return protocols.filter(p =>
    p.listedAt > cutoff && p.tvl > 0
  ).sort((a, b) => b.tvl - a.tvl);
}

/**
 * Find protocols with the highest TVL growth in the last 7 days.
 * Uses the change_7d field from the protocols endpoint.
 */
export async function fetchFastGrowingProtocols(minTvl: number = 1_000_000): Promise<DefiLlamaProtocol[]> {
  const protocols = await fetchAllProtocols();

  return protocols
    .filter(p => p.tvl >= minTvl && p.change_7d !== null && p.change_7d > 5)
    .sort((a, b) => (b.change_7d ?? 0) - (a.change_7d ?? 0));
}

/**
 * Get detailed TVL history for a specific protocol.
 * Returns daily TVL data points.
 */
export async function fetchProtocolTvlHistory(slug: string): Promise<{
  date: number; // unix timestamp
  tvl: number;
}[]> {
  const data = await llamaFetch(`${APIS.defiLlama.protocol}/${slug}`);
  return (data.tvl || []).map((point: any) => ({
    date: point.date,
    tvl: point.totalLiquidityUSD || 0,
  }));
}

/**
 * Get current TVL for a protocol by slug.
 */
export async function fetchProtocolTvl(slug: string): Promise<number> {
  const data = await llamaFetch(`${APIS.defiLlama.tvl}/${slug}`);
  return typeof data === 'number' ? data : 0;
}

/**
 * Fetch DEX volume overview (all chains).
 * Returns protocols with their 24h volume.
 */
export async function fetchDexVolumes(): Promise<{
  name: string;
  totalVolume24h: number;
  change_1d: number | null;
  change_7d: number | null;
}[]> {
  const data = await llamaFetch(APIS.defiLlama.dexOverview);
  return (data.protocols || []).map((p: any) => ({
    name: p.name,
    totalVolume24h: p.total24h || 0,
    change_1d: p.change_1d ?? null,
    change_7d: p.change_7d ?? null,
  }));
}
