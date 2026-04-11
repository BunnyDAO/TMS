---
name: "Jupiter"
slug: "jupiter"
tagline: "Solana's trading hub — aggregates every DEX, plus perps, DCA, limit orders, and a launchpad"
description: "Jupiter is far more than a DEX aggregator. It's Solana's central trading infrastructure. Every swap on Solana flows through Jupiter, which routes across Raydium, Orca, Meteora, and dozens of other liquidity sources using Pyth Network price feeds for optimal execution. On top of aggregation, Jupiter offers perpetual trading (up to 100x leverage), limit orders, DCA automation, and Jupiter Start for token launches. JUP is the governance token."
category: "solana"
subcategory: "dex"
tags: ["dex", "aggregator", "trading", "defi", "perpetuals", "dca", "limit-orders", "jup", "launchpad"]
website: "https://jup.ag"
github: "https://github.com/jup-ag"
docs: "https://station.jup.ag/docs"
pricing: "free"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Visit [jup.ag](https://jup.ag) and connect your Phantom or Backpack wallet.
2. Swap any SPL token — Jupiter automatically routes across Raydium, Orca, Meteora, and other DEXs to find the best price.
3. Try advanced features: set a **limit order** to buy at a specific price, or set up **DCA** to auto-buy weekly.
4. For leveraged trading, switch to **Jupiter Perps** for perpetual contracts on SOL, ETH, BTC, and more.

## How Jupiter Connects the Ecosystem

Jupiter is the routing layer that ties Solana DeFi together:
- **Liquidity sources** — Aggregates pools from Raydium (CLMM + standard AMM), Orca (Whirlpools), Meteora (DLMM), and 20+ other DEXs. When you swap on Jupiter, it splits your trade across multiple pools for the best execution.
- **Price data** — Uses Pyth Network oracle feeds for real-time pricing on perpetual contracts and limit order execution.
- **MEV protection** — Routes trades through Jito bundles to prevent sandwich attacks and front-running.
- **Infrastructure** — dApps and wallets (including Phantom's built-in swap) use Jupiter's API as their swap backend. Helius RPCs power the transaction infrastructure underneath.
- **Token launches** — pump.fun tokens that graduate to Raydium become instantly tradeable through Jupiter's aggregation.

## Key Features

- **Best-price routing** — Splits trades across every Solana DEX simultaneously. A single swap might route through Raydium, Orca, and Meteora in one transaction for optimal pricing.
- **Perpetual trading (Jupiter Perps)** — Trade perpetual contracts with up to 100x leverage on SOL, ETH, BTC, and other pairs. Uses Pyth oracles for price feeds and Jito for MEV-protected execution.
- **Limit orders** — Place orders at specific prices that execute automatically. No gas fees unless the order fills.
- **Dollar-cost averaging (DCA)** — Automate recurring buys of any token over customizable intervals. Set it and forget it.
- **Jupiter Start (Launchpad)** — Token launch platform with community DAO voting, LFG launchpad, and Atlas for early-stage projects.
- **JUP governance** — JUP token holders vote on protocol decisions, fee structures, and which projects launch on Jupiter Start.
- **MEV protection** — Built-in sandwich attack protection via Jito bundles, plus slippage controls and transaction simulation.
- **Ultra-fast API** — Jupiter's swap API powers the majority of Solana trading volume, used by wallets, bots, and dApps as their swap backend.
