import type { EcosystemNode, EcosystemEdge } from '../components/ecosystem/types';

export const nodes: EcosystemNode[] = [
  // ── AI ──────────────────────────────────────────
  { id: 'claude',          name: 'Claude',           category: 'ai', tier: 'core',     tagline: 'Anthropic\'s frontier AI family' },
  { id: 'chatgpt',         name: 'ChatGPT',          category: 'ai', tier: 'core',     tagline: 'OpenAI\'s flagship conversational AI' },
  { id: 'cursor',          name: 'Cursor',            category: 'ai', tier: 'major',    tagline: 'AI-native code editor' },
  { id: 'claude-code',     name: 'Claude Code',       category: 'ai', tier: 'major',    tagline: 'Anthropic\'s agentic coding CLI' },
  { id: 'github-copilot',  name: 'GitHub Copilot',    category: 'ai', tier: 'major',    tagline: 'AI pair programmer' },
  { id: 'windsurf',        name: 'Windsurf',          category: 'ai', tier: 'standard', tagline: 'AI-powered IDE by Codeium' },
  { id: 'cline',           name: 'Cline',             category: 'ai', tier: 'standard', tagline: 'Autonomous coding agent for VS Code' },
  { id: 'aider',           name: 'Aider',             category: 'ai', tier: 'standard', tagline: 'AI pair programming in the terminal' },
  { id: 'gemini',          name: 'Gemini',            category: 'ai', tier: 'major',    tagline: 'Google\'s multimodal AI' },
  { id: 'deepseek',        name: 'DeepSeek',          category: 'ai', tier: 'major',    tagline: 'Open-source reasoning models' },
  { id: 'grok',            name: 'Grok',              category: 'ai', tier: 'standard', tagline: 'xAI\'s real-time AI' },
  { id: 'mistral',         name: 'Mistral',           category: 'ai', tier: 'standard', tagline: 'European open-weight AI' },
  { id: 'llama',           name: 'Llama',             category: 'ai', tier: 'major',    tagline: 'Meta\'s open-source LLMs' },
  { id: 'qwen',            name: 'Qwen',              category: 'ai', tier: 'standard', tagline: 'Alibaba\'s multilingual models' },
  { id: 'ollama',          name: 'Ollama',            category: 'ai', tier: 'major',    tagline: 'Run LLMs locally' },
  { id: 'lm-studio',       name: 'LM Studio',        category: 'ai', tier: 'standard', tagline: 'Desktop app for local LLMs' },
  { id: 'perplexity',      name: 'Perplexity',        category: 'ai', tier: 'major',    tagline: 'AI-powered search engine' },
  { id: 'midjourney',      name: 'Midjourney',        category: 'ai', tier: 'major',    tagline: 'AI image generation' },
  { id: 'dall-e',          name: 'DALL-E',            category: 'ai', tier: 'standard', tagline: 'OpenAI\'s image generator' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', category: 'ai', tier: 'major',    tagline: 'Open-source image generation' },
  { id: 'runway',          name: 'Runway',            category: 'ai', tier: 'standard', tagline: 'AI video generation' },
  { id: 'elevenlabs',      name: 'ElevenLabs',        category: 'ai', tier: 'standard', tagline: 'AI voice synthesis' },
  { id: 'suno',            name: 'Suno',              category: 'ai', tier: 'standard', tagline: 'AI music generation' },
  { id: 'bolt-new',        name: 'Bolt.new',          category: 'ai', tier: 'standard', tagline: 'AI full-stack app builder' },
  { id: 'v0',              name: 'v0',                category: 'ai', tier: 'standard', tagline: 'Vercel\'s AI UI generator' },
  { id: 'n8n',             name: 'n8n',               category: 'ai', tier: 'standard', tagline: 'Workflow automation platform' },
  { id: 'langchain',       name: 'LangChain',         category: 'ai', tier: 'standard', tagline: 'LLM application framework' },
  { id: 'crewai',          name: 'CrewAI',            category: 'ai', tier: 'standard', tagline: 'Multi-agent orchestration' },
  { id: 'notebooklm',      name: 'NotebookLM',        category: 'ai', tier: 'standard', tagline: 'Google\'s AI research notebook' },
  { id: 'seedance',        name: 'Seedance',          category: 'ai', tier: 'major',    tagline: 'ByteDance\'s AI video generator' },
  { id: 'openclaw',        name: 'OpenClaw',          category: 'ai', tier: 'major',    tagline: 'Open-source AI agent for chat apps' },
  { id: 'lambda-labs',     name: 'Lambda Labs',       category: 'ai', tier: 'minor',    tagline: 'GPU cloud for AI training' },
  { id: 'runpod',          name: 'RunPod',            category: 'ai', tier: 'minor',    tagline: 'Serverless GPU platform' },

  // ── Bitcoin ─────────────────────────────────────
  { id: 'lightning-network', name: 'Lightning Network', category: 'bitcoin', tier: 'core',     tagline: 'Bitcoin\'s payment layer' },
  { id: 'stacks',           name: 'Stacks',            category: 'bitcoin', tier: 'major',    tagline: 'Smart contracts on Bitcoin' },
  { id: 'babylon-labs',     name: 'Babylon Labs',      category: 'bitcoin', tier: 'major',    tagline: 'Bitcoin staking protocol' },
  { id: 'electrum',         name: 'Electrum',          category: 'bitcoin', tier: 'standard', tagline: 'Lightweight Bitcoin wallet' },
  { id: 'xverse',           name: 'Xverse',            category: 'bitcoin', tier: 'standard', tagline: 'Bitcoin web3 wallet' },
  { id: 'unisat',           name: 'UniSat',            category: 'bitcoin', tier: 'standard', tagline: 'Ordinals & BRC-20 wallet' },
  { id: 'breez',            name: 'Breez',             category: 'bitcoin', tier: 'standard', tagline: 'Lightning wallet & SDK' },
  { id: 'btcpay-server',    name: 'BTCPay Server',     category: 'bitcoin', tier: 'standard', tagline: 'Self-hosted payment processor' },
  { id: 'zebedee',          name: 'Zebedee',           category: 'bitcoin', tier: 'minor',    tagline: 'Bitcoin gaming payments' },
  { id: 'phoenix-wallet',   name: 'Phoenix Wallet',    category: 'bitcoin', tier: 'minor',    tagline: 'Non-custodial Lightning wallet' },
  { id: 'magic-eden',       name: 'Magic Eden',        category: 'bitcoin', tier: 'major',    tagline: 'Multi-chain NFT marketplace' },
  { id: 'opensea',           name: 'OpenSea',           category: 'ethereum', tier: 'major',   tagline: 'Largest NFT marketplace' },

  // ── Ethereum ────────────────────────────────────
  { id: 'uniswap',      name: 'Uniswap',        category: 'ethereum', tier: 'core',     tagline: 'Leading decentralized exchange' },
  { id: 'aave',         name: 'Aave',            category: 'ethereum', tier: 'core',     tagline: 'DeFi lending & borrowing' },
  { id: 'lido',         name: 'Lido',            category: 'ethereum', tier: 'core',     tagline: 'Liquid staking protocol' },
  { id: 'metamask',     name: 'MetaMask',        category: 'ethereum', tier: 'core',     tagline: 'The crypto wallet standard' },
  { id: 'arbitrum',     name: 'Arbitrum',         category: 'ethereum', tier: 'major',    tagline: 'Leading Ethereum L2 rollup' },
  { id: 'optimism',     name: 'Optimism',         category: 'ethereum', tier: 'major',    tagline: 'OP Stack L2 rollup' },
  { id: 'base',         name: 'Base',             category: 'ethereum', tier: 'major',    tagline: 'Coinbase\'s L2 chain' },
  { id: 'zksync',       name: 'zkSync',           category: 'ethereum', tier: 'major',    tagline: 'ZK rollup for Ethereum' },
  { id: 'eigenlayer',   name: 'EigenLayer',       category: 'ethereum', tier: 'major',    tagline: 'Restaking protocol' },
  { id: 'maker',        name: 'Maker',            category: 'ethereum', tier: 'major',    tagline: 'DAI stablecoin issuer' },
  { id: 'ens',          name: 'ENS',              category: 'ethereum', tier: 'standard', tagline: 'Ethereum Name Service' },
  { id: 'rainbow',      name: 'Rainbow',          category: 'ethereum', tier: 'minor',    tagline: 'Mobile-first Ethereum wallet' },
  { id: 'hardhat',      name: 'Hardhat',          category: 'ethereum', tier: 'standard', tagline: 'Ethereum development environment' },
  { id: 'foundry',      name: 'Foundry',          category: 'ethereum', tier: 'standard', tagline: 'Blazing-fast Solidity toolkit' },
  { id: 'snapshot',     name: 'Snapshot',          category: 'ethereum', tier: 'standard', tagline: 'Off-chain governance voting' },
  { id: 'usdc',         name: 'USDC',              category: 'ethereum', tier: 'major',    tagline: 'Circle\'s stablecoin' },

  // ── Solana ──────────────────────────────────────
  { id: 'jupiter',      name: 'Jupiter',         category: 'solana', tier: 'core',     tagline: 'Solana\'s trading hub' },
  { id: 'raydium',      name: 'Raydium',         category: 'solana', tier: 'major',    tagline: 'Solana AMM & launchpad' },
  { id: 'orca',         name: 'Orca',            category: 'solana', tier: 'major',    tagline: 'Concentrated liquidity DEX' },
  { id: 'meteora',      name: 'Meteora',         category: 'solana', tier: 'major',    tagline: 'Dynamic liquidity protocols' },
  { id: 'phantom',      name: 'Phantom',         category: 'solana', tier: 'core',     tagline: 'Solana\'s leading wallet' },
  { id: 'backpack',     name: 'Backpack',        category: 'solana', tier: 'standard', tagline: 'xNFT wallet & exchange' },
  { id: 'jito',         name: 'Jito',            category: 'solana', tier: 'major',    tagline: 'MEV-protected staking' },
  { id: 'marinade',     name: 'Marinade',        category: 'solana', tier: 'standard', tagline: 'Solana liquid staking' },
  { id: 'marginfi',     name: 'MarginFi',        category: 'solana', tier: 'major',    tagline: 'Solana lending protocol' },
  { id: 'pump-fun',     name: 'pump.fun',        category: 'solana', tier: 'major',    tagline: 'Meme coin launcher' },
  { id: 'tensor',       name: 'Tensor',          category: 'solana', tier: 'standard', tagline: 'Solana NFT marketplace' },
  { id: 'solana-blinks', name: 'Solana Blinks',  category: 'solana', tier: 'standard', tagline: 'Blockchain links for actions' },
  { id: 'anchor',       name: 'Anchor',          category: 'solana', tier: 'standard', tagline: 'Solana development framework' },

  // ── RWA ─────────────────────────────────────────
  { id: 'ondo',           name: 'Ondo Finance',    category: 'rwa', tier: 'core',     tagline: 'Tokenized US Treasuries' },
  { id: 'blackrock-buidl', name: 'BlackRock BUIDL', category: 'rwa', tier: 'core',     tagline: 'Tokenized money market fund' },
  { id: 'maple',          name: 'Maple Finance',   category: 'rwa', tier: 'major',    tagline: 'Institutional lending' },
  { id: 'centrifuge',     name: 'Centrifuge',      category: 'rwa', tier: 'major',    tagline: 'Real-world asset financing' },
  { id: 'paxos-gold',     name: 'Paxos Gold',      category: 'rwa', tier: 'standard', tagline: 'Tokenized gold' },
  { id: 'wenrwa',         name: 'WenRWA',           category: 'solana', tier: 'core',  tagline: 'Solana-native RWA platform' },

  // ── Infrastructure ──────────────────────────────
  { id: 'chainlink',   name: 'Chainlink',    category: 'infra', tier: 'core',     tagline: 'Decentralized oracle network' },
  { id: 'pyth',        name: 'Pyth Network', category: 'infra', tier: 'major',    tagline: 'High-frequency price oracle' },
  { id: 'wormhole',    name: 'Wormhole',     category: 'infra', tier: 'major',    tagline: 'Cross-chain messaging bridge' },
  { id: 'stargate',    name: 'Stargate',     category: 'infra', tier: 'standard', tagline: 'Omnichain liquidity transport' },
  { id: 'helius',      name: 'Helius',       category: 'infra', tier: 'standard', tagline: 'Solana RPC & APIs' },
  { id: 'defillama',   name: 'DefiLlama',    category: 'infra', tier: 'standard', tagline: 'DeFi TVL analytics' },
  { id: 'dune',        name: 'Dune',         category: 'infra', tier: 'standard', tagline: 'Blockchain data analytics' },
  { id: 'rwa-xyz',     name: 'RWA.xyz',      category: 'infra', tier: 'standard', tagline: 'RWA market dashboard' },
  { id: 'render',      name: 'Render',       category: 'infra', tier: 'standard', tagline: 'Decentralized GPU rendering' },
  { id: 'bittensor',   name: 'Bittensor',    category: 'infra', tier: 'standard', tagline: 'Decentralized AI network' },
  { id: 'fetch-ai',    name: 'Fetch.ai',     category: 'infra', tier: 'standard', tagline: 'Autonomous AI agents' },
];

export const edges: EcosystemEdge[] = [
  // ── Solana DEX Aggregation ──────────────────────
  { source: 'jupiter',  target: 'raydium',       type: 'aggregates',  label: 'aggregates liquidity' },
  { source: 'jupiter',  target: 'orca',           type: 'aggregates',  label: 'aggregates liquidity' },
  { source: 'jupiter',  target: 'meteora',        type: 'aggregates',  label: 'aggregates liquidity' },

  // ── Oracles ─────────────────────────────────────
  { source: 'pyth',      target: 'jupiter',       type: 'oracle',      label: 'price feeds' },
  { source: 'pyth',      target: 'marginfi',      type: 'oracle',      label: 'price feeds' },
  { source: 'pyth',      target: 'raydium',       type: 'oracle',      label: 'price feeds' },
  { source: 'chainlink', target: 'aave',          type: 'oracle',      label: 'price feeds' },
  { source: 'chainlink', target: 'maker',         type: 'oracle',      label: 'price feeds' },
  { source: 'chainlink', target: 'ens',            type: 'oracle',      label: 'price feeds' },
  { source: 'chainlink', target: 'ondo',          type: 'oracle',      label: 'NAV feeds' },

  // ── MEV Protection ─────────────────────────────────────────
  { source: 'jito',      target: 'jupiter',       type: 'infrastructure', label: 'MEV protection' },
  { source: 'jito',      target: 'raydium',       type: 'infrastructure', label: 'MEV protection' },

  // ── Token Graduation ────────────────────────────
  { source: 'pump-fun',  target: 'raydium',       type: 'graduation',  label: 'graduates to' },
  { source: 'pump-fun',  target: 'meteora',       type: 'graduation',  label: 'graduates to' },

  // ── Wallet Access (infrastructure) ──────────────
  { source: 'phantom',   target: 'jupiter',       type: 'infrastructure',      label: 'connects to' },
  { source: 'phantom',   target: 'raydium',       type: 'infrastructure',      label: 'connects to' },
  { source: 'phantom',   target: 'marginfi',      type: 'infrastructure',      label: 'connects to' },
  { source: 'phantom',   target: 'tensor',        type: 'infrastructure',      label: 'connects to' },
  { source: 'backpack',  target: 'jupiter',       type: 'infrastructure',      label: 'connects to' },
  { source: 'metamask',  target: 'uniswap',       type: 'infrastructure',      label: 'connects to' },
  { source: 'metamask',  target: 'aave',          type: 'infrastructure',      label: 'connects to' },
  { source: 'metamask',  target: 'lido',          type: 'infrastructure',      label: 'connects to' },
  { source: 'metamask',  target: 'eigenlayer',    type: 'infrastructure',      label: 'connects to' },
  { source: 'xverse',    target: 'stacks',        type: 'infrastructure',      label: 'connects to' },
  { source: 'unisat',    target: 'magic-eden',    type: 'infrastructure',      label: 'connects to' },

  // ── Infrastructure ──────────────────────────────
  { source: 'helius',    target: 'jupiter',       type: 'infrastructure', label: 'RPC provider' },
  { source: 'helius',    target: 'phantom',       type: 'infrastructure', label: 'RPC provider' },
  { source: 'helius',    target: 'tensor',        type: 'infrastructure', label: 'RPC provider' },
  { source: 'anchor',    target: 'raydium',       type: 'infrastructure', label: 'built with' },
  { source: 'anchor',    target: 'marginfi',      type: 'infrastructure', label: 'built with' },
  { source: 'hardhat',   target: 'aave',          type: 'infrastructure', label: 'dev tooling' },
  { source: 'foundry',   target: 'uniswap',       type: 'infrastructure', label: 'dev tooling' },

  // ── Composability (DeFi Legos) ──────────────────
  { source: 'jito',      target: 'marginfi',      type: 'composability', label: 'jitoSOL as collateral' },
  { source: 'jito',      target: 'raydium',       type: 'composability', label: 'jitoSOL liquidity' },
  { source: 'marinade',  target: 'marginfi',      type: 'composability', label: 'mSOL as collateral' },
  { source: 'lido',      target: 'aave',          type: 'composability', label: 'stETH as collateral' },
  { source: 'lido',      target: 'eigenlayer',    type: 'composability', label: 'stETH restaking' },
  { source: 'lido',      target: 'maker',         type: 'composability', label: 'stETH as collateral' },
  { source: 'maker',     target: 'aave',          type: 'composability', label: 'DAI integration' },
  { source: 'usdc',      target: 'aave',          type: 'composability', label: 'lending asset' },
  { source: 'usdc',      target: 'uniswap',       type: 'composability', label: 'base pair' },
  { source: 'usdc',      target: 'jupiter',       type: 'composability', label: 'base pair' },
  { source: 'usdc',      target: 'maple',         type: 'composability', label: 'lending denomination' },

  // ── Bridges ─────────────────────────────────────
  { source: 'wormhole',  target: 'jupiter',       type: 'bridge',      label: 'cross-chain to Solana' },
  { source: 'wormhole',  target: 'uniswap',       type: 'bridge',      label: 'cross-chain to Ethereum' },
  { source: 'wormhole',  target: 'phantom',       type: 'bridge',      label: 'bridge integration' },
  { source: 'stargate',  target: 'uniswap',       type: 'bridge',      label: 'omnichain liquidity' },
  { source: 'stargate',  target: 'arbitrum',      type: 'bridge',      label: 'L2 bridging' },

  // ── Staking ─────────────────────────────────────
  { source: 'lido',       target: 'uniswap',      type: 'staking',     label: 'stETH liquidity' },
  { source: 'eigenlayer', target: 'lido',          type: 'staking',     label: 'restakes stETH' },
  { source: 'babylon-labs', target: 'stacks',      type: 'staking',     label: 'Bitcoin staking' },
  { source: 'jito',        target: 'jupiter',      type: 'staking',     label: 'jitoSOL staking' },
  { source: 'marinade',    target: 'raydium',      type: 'staking',     label: 'mSOL liquidity' },

  // ── AI Powers ───────────────────────────────────
  { source: 'claude',     target: 'cursor',        type: 'powers',      label: 'powers' },
  { source: 'claude',     target: 'claude-code',   type: 'powers',      label: 'powers' },
  { source: 'claude',     target: 'cline',         type: 'powers',      label: 'powers' },
  { source: 'claude',     target: 'aider',         type: 'powers',      label: 'powers' },
  { source: 'claude',     target: 'windsurf',      type: 'powers',      label: 'powers' },
  { source: 'chatgpt',    target: 'dall-e',        type: 'powers',      label: 'powers' },
  { source: 'chatgpt',    target: 'github-copilot', type: 'powers',    label: 'same model family' },
  { source: 'gemini',     target: 'notebooklm',    type: 'powers',      label: 'powers' },
  { source: 'deepseek',   target: 'cursor',        type: 'powers',      label: 'powers' },
  { source: 'llama',      target: 'ollama',        type: 'powers',      label: 'runs on' },
  { source: 'llama',      target: 'lm-studio',     type: 'powers',      label: 'runs on' },
  { source: 'mistral',    target: 'ollama',        type: 'powers',      label: 'runs on' },
  { source: 'qwen',       target: 'ollama',        type: 'powers',      label: 'runs on' },
  { source: 'langchain',  target: 'crewai',        type: 'powers',      label: 'framework for' },
  { source: 'langchain',  target: 'n8n',           type: 'powers',      label: 'integrates with' },

  // ── L2 Relationships ────────────────────────────
  { source: 'arbitrum',   target: 'uniswap',       type: 'composability', label: 'hosts Uniswap' },
  { source: 'optimism',   target: 'uniswap',       type: 'composability', label: 'hosts Uniswap' },
  { source: 'base',       target: 'uniswap',       type: 'composability', label: 'hosts Uniswap' },
  { source: 'arbitrum',   target: 'aave',          type: 'composability', label: 'hosts Aave' },
  { source: 'optimism',   target: 'aave',          type: 'composability', label: 'hosts Aave' },

  // ── Cross-ecosystem ─────────────────────────────
  { source: 'magic-eden', target: 'tensor',        type: 'competes',      label: 'NFT marketplace' },
  { source: 'opensea',    target: 'magic-eden',    type: 'competes',      label: 'NFT marketplace' },
  { source: 'opensea',    target: 'tensor',        type: 'competes',      label: 'NFT marketplace' },
  { source: 'metamask',   target: 'opensea',       type: 'infrastructure',        label: 'connects to' },
  { source: 'defillama',  target: 'aave',          type: 'infrastructure', label: 'tracks TVL' },
  { source: 'defillama',  target: 'jupiter',       type: 'infrastructure', label: 'tracks TVL' },
  { source: 'defillama',  target: 'uniswap',       type: 'infrastructure', label: 'tracks TVL' },
  { source: 'dune',       target: 'uniswap',       type: 'infrastructure', label: 'analytics' },
  { source: 'dune',       target: 'aave',          type: 'infrastructure', label: 'analytics' },
  { source: 'rwa-xyz',    target: 'ondo',          type: 'infrastructure', label: 'tracks RWA' },
  { source: 'rwa-xyz',    target: 'blackrock-buidl', type: 'infrastructure', label: 'tracks RWA' },
  { source: 'rwa-xyz',    target: 'maple',         type: 'infrastructure', label: 'tracks RWA' },
  { source: 'rwa-xyz',    target: 'centrifuge',    type: 'infrastructure', label: 'tracks RWA' },
  { source: 'snapshot',   target: 'ens',           type: 'composability', label: 'governance voting' },

  // ── RWA connections ─────────────────────────────
  { source: 'ondo',       target: 'blackrock-buidl', type: 'composability', label: 'OUSG backed by BUIDL' },
  { source: 'centrifuge', target: 'maker',         type: 'composability', label: 'RWA vaults' },
  { source: 'maple',      target: 'usdc',          type: 'composability', label: 'USDC lending pools' },

  // ── AI x Crypto ─────────────────────────────────
  { source: 'render',     target: 'stable-diffusion', type: 'infrastructure', label: 'GPU rendering' },
  { source: 'bittensor',  target: 'render',        type: 'infrastructure', label: 'decentralized compute' },
  { source: 'fetch-ai',   target: 'chainlink',     type: 'composability', label: 'AI oracle agents' },

  // ── Lightning ecosystem ─────────────────────────
  { source: 'breez',         target: 'lightning-network', type: 'infrastructure', label: 'Lightning SDK' },
  { source: 'phoenix-wallet', target: 'lightning-network', type: 'infrastructure', label: 'Lightning wallet' },
  { source: 'btcpay-server', target: 'lightning-network', type: 'infrastructure', label: 'Lightning payments' },
  { source: 'zebedee',       target: 'lightning-network', type: 'infrastructure', label: 'Lightning gaming' },

  // ── Solana Blinks ───────────────────────────────
  { source: 'solana-blinks', target: 'jupiter',    type: 'composability', label: 'swap actions' },
  { source: 'solana-blinks', target: 'tensor',     type: 'composability', label: 'NFT actions' },

  // ── GPU infrastructure ──────────────────────────
  { source: 'lambda-labs', target: 'llama',         type: 'infrastructure', label: 'training compute' },
  { source: 'runpod',      target: 'stable-diffusion', type: 'infrastructure', label: 'inference hosting' },

  // ── More AI tool relationships ──────────────────
  { source: 'bolt-new',   target: 'claude',        type: 'powers',      label: 'uses Claude' },
  { source: 'v0',         target: 'claude',        type: 'powers',      label: 'uses Claude' },

  // ── Seedance ────────────────────────────────────
  { source: 'seedance',   target: 'runway',          type: 'competes',      label: 'AI video' },
  { source: 'seedance',   target: 'sora',            type: 'competes',      label: 'AI video' },
  { source: 'seedance',   target: 'kling',           type: 'competes',      label: 'AI video' },
  { source: 'seedance',   target: 'veo',             type: 'competes',      label: 'AI video' },

  // ── OpenClaw ───────────────────────────────────
  { source: 'claude',     target: 'openclaw',        type: 'powers',        label: 'powers' },
  { source: 'chatgpt',    target: 'openclaw',        type: 'powers',        label: 'powers' },
  { source: 'langchain',  target: 'openclaw',        type: 'powers',        label: 'orchestrates' },
  { source: 'openclaw',   target: 'n8n',             type: 'composability', label: 'workflow automation' },
  { source: 'openclaw',   target: 'crewai',          type: 'composability', label: 'agent framework' },
  { source: 'ollama',     target: 'openclaw',        type: 'powers',        label: 'local inference' },

  // ── WenRWA ecosystem ──────────────────────────
  { source: 'claude',    target: 'wenrwa',          type: 'powers',        label: 'powers' },
  { source: 'chatgpt',   target: 'wenrwa',          type: 'powers',        label: 'powers' },
  { source: 'wenrwa',    target: 'raydium',        type: 'aggregates',    label: 'swaps via' },
  { source: 'wenrwa',    target: 'orca',            type: 'aggregates',    label: 'swaps via' },
  { source: 'wenrwa',    target: 'jupiter',         type: 'aggregates',    label: 'routes through' },
  { source: 'pyth',      target: 'wenrwa',          type: 'oracle',        label: 'price feeds' },
  { source: 'rwa-xyz',   target: 'wenrwa',          type: 'infrastructure', label: 'tracks RWA' },
  { source: 'helius',    target: 'wenrwa',          type: 'infrastructure', label: 'RPC provider' },
  { source: 'phantom',   target: 'wenrwa',          type: 'infrastructure',        label: 'connects to' },
  { source: 'backpack',  target: 'wenrwa',          type: 'infrastructure',        label: 'connects to' },
];
