import { APIS } from '../config.js';
import type { CoinGeckoTrendingCoin } from '../types.js';

async function geckoFetch(path: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`${APIS.coingecko.base}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const headers: Record<string, string> = {
    'User-Agent': 'toomuch-sh-automation',
    'Accept': 'application/json',
  };

  // Use pro API if key is available
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`CoinGecko API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * Fetch trending coins from CoinGecko.
 * Returns top 7 trending coins by search volume in last 24h.
 * Free tier: cached every 10 minutes.
 */
export async function fetchTrendingCoins(): Promise<CoinGeckoTrendingCoin[]> {
  const data = await geckoFetch(APIS.coingecko.trending);

  return (data.coins || []).map((item: any, index: number) => ({
    id: item.item.id,
    name: item.item.name,
    symbol: item.item.symbol,
    marketCapRank: item.item.market_cap_rank || 0,
    thumb: item.item.thumb || '',
    score: index,
  }));
}

/**
 * Fetch market data for specific coins.
 * Useful for getting price/volume data for coins we're already tracking.
 */
export async function fetchCoinMarkets(options?: {
  category?: string;
  ids?: string[];
  perPage?: number;
}): Promise<{
  id: string;
  name: string;
  symbol: string;
  marketCap: number;
  totalVolume: number;
  priceChangePercent24h: number;
  priceChangePercent7d: number;
}[]> {
  const params: Record<string, string> = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(options?.perPage || 100),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h,7d',
  };

  if (options?.category) params.category = options.category;
  if (options?.ids) params.ids = options.ids.join(',');

  const data = await geckoFetch(APIS.coingecko.markets, params);

  return (data || []).map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    marketCap: coin.market_cap || 0,
    totalVolume: coin.total_volume || 0,
    priceChangePercent24h: coin.price_change_percentage_24h || 0,
    priceChangePercent7d: coin.price_change_percentage_7d_in_currency || 0,
  }));
}

/**
 * Fetch trending categories from CoinGecko.
 */
export async function fetchTrendingCategories(): Promise<{
  id: string;
  name: string;
  marketCap: number;
  marketCapChange24h: number;
}[]> {
  const data = await geckoFetch(APIS.coingecko.trending);

  return (data.categories || []).map((cat: any) => ({
    id: cat.id || '',
    name: cat.name || '',
    marketCap: cat.data?.market_cap || 0,
    marketCapChange24h: cat.data?.market_cap_change_percentage_24h?.usd || 0,
  }));
}
