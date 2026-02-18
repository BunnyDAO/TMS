import { APIS, GECKO_TERMINAL_NETWORKS } from '../config.js';
import type { DiscoveryCandidate, CategoryKey } from '../types.js';

async function geckoTerminalFetch(path: string): Promise<any> {
  const url = `${APIS.geckoTerminal.base}${path}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'toomuch-sh-automation',
    },
  });

  if (!res.ok) {
    throw new Error(`GeckoTerminal API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

interface GeckoPool {
  id: string;
  attributes: {
    name: string;
    address: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    fdv_usd: string;
    market_cap_usd: string | null;
    reserve_in_usd: string;
    pool_created_at: string;
    volume_usd: {
      h24: string;
    };
    price_change_percentage: {
      h24: string;
    };
  };
  relationships?: {
    dex?: { data?: { id?: string } };
    base_token?: { data?: { id?: string } };
  };
}

/**
 * Fetch trending + new pools from GeckoTerminal across configured networks.
 * ~5 API calls per run (trending + new for each network, with some parallelism).
 */
export async function fetchGeckoTerminalItems(): Promise<DiscoveryCandidate[]> {
  const candidates: DiscoveryCandidate[] = [];

  for (const network of GECKO_TERMINAL_NETWORKS) {
    try {
      const trendingPath = APIS.geckoTerminal.trendingPools.replace('{network}', network.id);
      const newPath = APIS.geckoTerminal.newPools.replace('{network}', network.id);

      const [trendingData, newData] = await Promise.all([
        geckoTerminalFetch(trendingPath).catch(() => ({ data: [] })),
        geckoTerminalFetch(newPath).catch(() => ({ data: [] })),
      ]);

      const trendingPools: GeckoPool[] = trendingData.data || [];
      const newPools: GeckoPool[] = newData.data || [];

      // Process trending pools — these are high-volume, active pools
      for (const pool of trendingPools.slice(0, 10)) {
        const info = parsePool(pool, network.id, network.category);
        if (!info) continue;
        // Only include pools with significant volume
        if (info.volume24h < 100_000) continue;
        candidates.push(info.candidate);
      }

      // Process new pools — recently created with early traction
      for (const pool of newPools.slice(0, 5)) {
        const info = parsePool(pool, network.id, network.category);
        if (!info) continue;
        // New pools need some minimum liquidity to be interesting
        if (info.liquidity < 50_000) continue;
        candidates.push(info.candidate);
      }

      // Rate limit between networks
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.warn(`  GeckoTerminal ${network.id} fetch failed:`, err);
    }
  }

  return candidates;
}

function parsePool(
  pool: GeckoPool,
  networkId: string,
  category: CategoryKey,
): { candidate: DiscoveryCandidate; volume24h: number; liquidity: number } | null {
  const attrs = pool.attributes;
  if (!attrs?.name) return null;

  const volume24h = parseFloat(attrs.volume_usd?.h24 || '0');
  const liquidity = parseFloat(attrs.reserve_in_usd || '0');
  const fdv = parseFloat(attrs.fdv_usd || '0');
  const priceChange24h = parseFloat(attrs.price_change_percentage?.h24 || '0');

  // Extract the base token name (first part of pool name, e.g. "SOL / USDC" → "SOL")
  const poolName = attrs.name;
  const dexId = pool.relationships?.dex?.data?.id || '';
  const dexName = dexId.split('_').pop() || 'Unknown DEX';

  const candidate: DiscoveryCandidate = {
    name: poolName,
    source: 'geckoterminal',
    url: `https://www.geckoterminal.com/${networkId}/pools/${attrs.address}`,
    description: `${poolName} on ${dexName} (${networkId}). 24h volume: $${formatNumber(volume24h)}, liquidity: $${formatNumber(liquidity)}${fdv > 0 ? `, FDV: $${formatNumber(fdv)}` : ''}. 24h price change: ${priceChange24h > 0 ? '+' : ''}${priceChange24h.toFixed(1)}%`,
    category,
    subcategory: 'defi-dex',
    metrics: {
      dailyVolume: volume24h,
      tvlCurrent: liquidity,
    },
    relevanceScore: 0,
    reasoning: '',
  };

  return { candidate, volume24h, liquidity };
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
