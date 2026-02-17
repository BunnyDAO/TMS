---
name: "Helius"
slug: "helius"
tagline: "Solana's dev infrastructure — the RPC, APIs, and webhooks powering Jupiter, Phantom, and more"
description: "Helius is the infrastructure layer underneath Solana's biggest apps. It provides high-performance RPC nodes, Solana-specific APIs (transaction parsing, digital assets, priority fees), and real-time webhooks. Jupiter, Phantom, Magic Eden, and hundreds of other Solana apps rely on Helius RPCs for reliable transaction processing. Far more than a generic RPC — it's purpose-built for Solana."
category: "solana"
subcategory: "dev-tools"
tags: ["rpc", "api", "infrastructure", "developer-tools", "webhooks", "das", "priority-fees"]
website: "https://helius.dev"
docs: "https://docs.helius.dev"
pricing: "freemium"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Sign up at [helius.dev](https://helius.dev) — free tier gives you 100K credits/day, enough for dev and small apps.
2. Replace your Solana RPC URL with your Helius endpoint for faster, more reliable connections.
3. Try the **DAS API**: fetch all NFTs for a wallet in a single call, including compressed NFTs (cNFTs).
4. Set up **webhooks** to get notified in real-time when specific on-chain events happen (transfers, swaps, program interactions).

## How Helius Powers the Ecosystem

- **Jupiter, Phantom, Magic Eden** — Major Solana apps use Helius RPCs for reliable transaction processing. When you swap on Jupiter or list an NFT on Magic Eden, Helius nodes are likely processing that transaction.
- **Transaction landing** — Helius's priority fee API helps apps calculate the right fee for reliable transaction inclusion, critical during high-congestion periods.
- **Compressed NFTs** — Helius's DAS (Digital Asset Standard) API is the standard way to read compressed NFTs on Solana, used by wallets and marketplaces.
- **Solana-specific** — Unlike generic RPC providers, Helius builds Solana-native features: parsed transaction history, token metadata, webhooks for program events.

## Key Features

- **High-performance RPC** — Dedicated Solana nodes with staked connections for reliable transaction landing. Supports standard and geyser-based websocket subscriptions.
- **Digital Asset API (DAS)** — Fetch NFTs, compressed NFTs (cNFTs), fungible tokens, and metadata for any wallet with a single API call. The standard for Solana asset data.
- **Transaction parsing** — Get human-readable transaction history with decoded instructions, token transfers, and program interactions. No raw data wrangling.
- **Webhooks** — Real-time push notifications for any on-chain event. Monitor wallets, track swaps, watch program interactions — no polling required.
- **Priority fee API** — Get recommended priority fees for reliable transaction landing. Essential during network congestion.
- **Free tier** — 100K credits/day free, enough for development and small-scale production apps.
