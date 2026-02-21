---
name: "Orca"
slug: "orca"
tagline: "Solana's concentrated liquidity DEX — Whirlpools powering ecosystem-wide swaps"
description: "Orca is a core liquidity provider in the Solana ecosystem, best known for Whirlpools — its concentrated liquidity pools. Much of Orca's volume comes through Jupiter aggregation, meaning when Jupiter finds the best swap route, it often routes through Orca's deep Whirlpool liquidity. Open-source SDKs make it a favorite for developers building swap integrations."
category: "solana"
subcategory: "dex"
tags: ["dex", "concentrated-liquidity", "whirlpools", "defi", "sdk", "open-source"]
website: "https://orca.so"
github: "https://github.com/orca-so"
docs: "https://docs.orca.so"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Visit [orca.so](https://orca.so) and connect your Phantom or Backpack wallet.
2. Swap SPL tokens with clean, transparent pricing — or go directly through Jupiter for cross-DEX routing.
3. Provide concentrated liquidity in **Whirlpools**: pick a token pair, set your price range, and start earning fees.
4. Use Orca's TypeScript SDK to integrate swaps and liquidity into your own Solana dApp.

## How Orca Fits the Ecosystem

- **Jupiter routing** — Orca's Whirlpools are a primary liquidity source for Jupiter. When you swap on any Solana app, Jupiter may split your trade across Orca, Raydium, and Meteora pools simultaneously.
- **Developer-first** — Orca's open-source TypeScript and Rust SDKs make it the easiest DEX to integrate programmatically. Many Solana dApps use Orca's SDK directly.
- **Helius-powered** — Like most Solana dApps, Orca relies on high-performance RPC providers like Helius for reliable transaction processing.
- **Pyth integration** — Uses Pyth Network price feeds for reference pricing and analytics.

## Key Features

- **Whirlpools (concentrated liquidity)** — Provide liquidity within specific price ranges for dramatically higher capital efficiency. Earn more fees with less capital deployed.
- **Jupiter-integrated** — A core liquidity source in Jupiter's aggregation. Orca pools are automatically included in Jupiter's best-price routing.
- **Open-source SDKs** — Full TypeScript and Rust SDKs for developers to build swaps, LP management, and analytics on top of Orca programmatically.
- **Clean, intuitive UI** — Known for the simplest, most beginner-friendly interface among Solana DEXs.
- **Fair pricing** — Transparent fee tiers (0.01% to 2%) with clear display of price impact, slippage, and route details.
- **Multi-token support** — Hundreds of SPL token pairs with deep liquidity in major pairs (SOL/USDC, SOL/USDT, etc.).
