export type CategoryKey = 'ai' | 'bitcoin' | 'ethereum' | 'solana' | 'rwa' | 'infra';

export interface Category {
  name: string;
  tagline: string;
  color: string;
  icon: string;
  description: string;
  subcategories: Record<string, string>;
}

export const categories: Record<CategoryKey, Category> = {
  ai: {
    name: 'AI',
    tagline: 'The intelligence layer',
    color: 'violet',
    icon: '🤖',
    description: 'Models, coding tools, generators, local AI, agents — everything powering the intelligence revolution.',
    subcategories: {
      'llms': 'Foundation Models & LLMs',
      'coding': 'AI Coding Tools',
      'image': 'Image Generation',
      'video': 'Video Generation',
      'audio': 'Audio & Music',
      'agents': 'Agents & Automation',
      'local': 'Local & Self-Hosted',
      'hardware': 'AI Hardware & GPUs',
      'apps': 'AI Apps & Productivity',
    },
  },
  bitcoin: {
    name: 'Bitcoin',
    tagline: 'The sound money ecosystem',
    color: 'orange',
    icon: '₿',
    description: 'Wallets, Lightning Network, L2s, DeFi, Ordinals, payments, and mining infrastructure.',
    subcategories: {
      'wallets': 'Wallets',
      'lightning': 'Lightning Network',
      'layer2': 'L2s & Sidechains',
      'defi': 'Bitcoin DeFi',
      'ordinals': 'Ordinals & BRC-20',
      'payments': 'Payments & Commerce',
      'mining': 'Mining & Infrastructure',
    },
  },
  ethereum: {
    name: 'Ethereum',
    tagline: 'The world computer',
    color: 'blue',
    icon: '◆',
    description: 'Layer 2 rollups, DeFi protocols, staking, wallets, developer tools, and governance.',
    subcategories: {
      'layer2': 'Layer 2 Rollups',
      'defi-lending': 'Lending & Borrowing',
      'defi-dex': 'DEXs & Trading',
      'staking': 'Staking & Restaking',
      'wallets': 'Wallets',
      'dev-tools': 'Developer Tools',
      'identity': 'Identity & Governance',
      'stablecoins': 'Stablecoins',
    },
  },
  solana: {
    name: 'Solana',
    tagline: 'Speed meets scale',
    color: 'green',
    icon: '◎',
    description: 'The fastest blockchain ecosystem — DEXs, DeFi, NFTs, and the meme coin capital of crypto.',
    subcategories: {
      'dex': 'DEXs & Aggregators',
      'defi': 'DeFi & Lending',
      'staking': 'Liquid Staking',
      'wallets': 'Wallets',
      'nfts': 'NFTs & Marketplaces',
      'meme': 'Meme & Token Launch',
      'dev-tools': 'Developer Tools',
      'blinks': 'Blinks & Actions',
    },
  },
  rwa: {
    name: 'Real World Assets',
    tagline: 'Bringing TradFi on-chain',
    color: 'rose',
    icon: '🏛',
    description: 'Tokenized treasuries, private credit, real estate, and commodities bridging traditional and decentralized finance.',
    subcategories: {
      'treasuries': 'Tokenized Treasuries',
      'credit': 'Private Credit',
      'real-estate': 'Real Estate',
      'commodities': 'Commodities',
      'analytics': 'RWA Analytics',
    },
  },
  infra: {
    name: 'Infrastructure',
    tagline: 'The connective tissue',
    color: 'slate',
    icon: '🔗',
    description: 'Bridges, oracles, analytics dashboards, and the AI x Crypto crossover powering everything.',
    subcategories: {
      'bridges': 'Bridges & Cross-Chain',
      'oracles': 'Oracles & Data Feeds',
      'analytics': 'Analytics & Dashboards',
      'ai-crypto': 'AI x Crypto Tokens',
      'ai-agents': 'On-Chain AI Agents',
    },
  },
};

export const categoryKeys = Object.keys(categories) as CategoryKey[];

export function getCategoryColor(category: CategoryKey): string {
  const colorMap: Record<CategoryKey, string> = {
    ai: 'violet',
    bitcoin: 'orange',
    ethereum: 'blue',
    solana: 'green',
    rwa: 'rose',
    infra: 'slate',
  };
  return colorMap[category];
}
