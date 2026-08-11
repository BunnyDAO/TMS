import { fetchAllProtocols } from './defillama.ts';
import { fetchTrendingCoins } from './coingecko.ts';

interface DiscoveryReportCandidate {
  name: string;
  url: string;
}

interface DiscoveryReport {
  candidates: DiscoveryReportCandidate[];
  categories: string[];
  noise: string[];
}

async function filterNoise(candidates: DiscoveryReportCandidate[], categories: string[], noise: string[]): Promise<DiscoveryReportCandidate[]> {
  // Filter out meme tokens, generic GitHub repos, and CoinGecko trending coins that are L1 assets
  return candidates.filter(candidate => {
    // Check if the candidate is a meme token
    if (noise.includes(candidate.name)) {
      return false;
    }
    // Check if the candidate is a generic GitHub repo
    if (noise.includes(candidate.url)) {
      return false;
    }
    // Check if the candidate is a CoinGecko trending coin that is an L1 asset
    const trendingCoins = await fetchTrendingCoins();
    const coin = trendingCoins.find(coin => coin.name === candidate.name);
    if (coin && coin.category === 'coins') {
      return false;
    }
    return true;
  });
}

async function processDiscoveryReport(candidates: DiscoveryReportCandidate[], categories: string[], noise: string[]): Promise<DiscoveryReport> {
  const filteredCandidates = await filterNoise(candidates, categories, noise);
  return {
    candidates: filteredCandidates,
    categories,
    noise,
  };
}

export async function fetchDiscoveryReport(): Promise<DiscoveryReport> {
  const protocols = await fetchAllProtocols();
  const trendingCoins = await fetchTrendingCoins();
  const candidates = protocols.map(protocol => ({
    name: protocol.name,
    url: protocol.url,
  }));
  const categories = ['DeFi', 'RWA', 'Solana Ecosystem'];
  const noise = ['Meme Token 1', 'Meme Token 2', 'https://generic-github-repo.com'];
  return await processDiscoveryReport(candidates, categories, noise);
}