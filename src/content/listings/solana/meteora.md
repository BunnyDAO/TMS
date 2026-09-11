---
name: "Meteora"
slug: "meteora"
tagline: "Solana's DLMM liquidity protocol — zero-slippage bins, dynamic fees, and launchpad integration"
description: "Meteora has emerged as one of Solana's most innovative DEXs with its Dynamic Liquidity Market Maker (DLMM). Unlike traditional AMMs, DLMM uses discrete price bins that offer zero-slippage trading within each bin and dynamically adjust fees based on volatility. Meteora has become a go-to for token launches and is deeply integrated into Jupiter's routing alongside Raydium and Orca."
category: "solana"
subcategory: "dex"
tags: ["dlmm", "liquidity", "dex", "launch", "defi", "dynamic-fees", "zero-slippage"]
website: "https://meteora.ag"
github: "https://github.com/nickarashiofficial/meteora-dlmm-sdk"
docs: "https://docs.meteora.ag"
pricing: "open-source"
status: "trending"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Visit [app.meteora.ag](https://app.meteora.ag) and connect your Phantom or Backpack wallet.
2. Browse DLMM pools — each shows the current active bin, fee tier, and LP APR.
3. Add liquidity by choosing a strategy: **Spot** (uniform), **Curve** (concentrated), or **Bid-Ask** (one-sided).
4. Watch your fees accrue in real-time as trades flow through your active bins via direct swaps and Jupiter aggregation.

## How Meteora Fits the Ecosystem

- **Jupiter routing** — Meteora's DLMM pools are integrated into Jupiter's aggregation. A swap on Jupiter may route through Meteora when its bins offer the best price for a portion of the trade.
- **Launch liquidity** — Many new Solana tokens use Meteora DLMM pools for initial liquidity, often alongside or as an alternative to Raydium. The dynamic fee structure protects LPs during volatile early trading.
- **Complementary to Raydium/Orca** — Each DEX uses a different AMM model. Jupiter routes across all three simultaneously, so they don't compete head-to-head — they provide diversified liquidity sources.
- **Pyth feeds** — References Pyth Network oracle data for analytics and position management tools.

## Key Features

- **DLMM (Dynamic Liquidity Market Maker)** — Discrete price bins provide zero-slippage swaps within each active bin. More precise than traditional concentrated liquidity.
- **Dynamic fees** — Fees automatically increase during high volatility and decrease during calm markets, optimizing LP returns and protecting against toxic flow.
- **Flexible LP strategies** — Choose Spot (even distribution), Curve (concentrated around current price), or Bid-Ask (one-sided, DCA-like) positioning.
- **One-sided liquidity** — Deposit just one token instead of a pair. Great for dollar-cost averaging into a position.
- **Jupiter-integrated** — Fully aggregated into Jupiter's routing, meaning LPs earn fees from all Solana trading volume, not just direct Meteora users.
- **Launch pool standard** — Increasingly used for token launches due to dynamic fees that protect LPs during the volatile first hours of trading.
