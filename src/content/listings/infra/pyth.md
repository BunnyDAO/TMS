---
name: "Pyth Network"
slug: "pyth"
tagline: "High-frequency oracle — 400ms price updates from first-party sources powering DeFi across 70+ chains"
description: "Pyth Network is the oracle powering real-time price feeds for DeFi across 70+ blockchains. Unlike Chainlink's node operator model, Pyth sources data directly from major exchanges and trading firms (first-party data), publishing updates every 400ms. Jupiter Perps uses Pyth for perpetual contract pricing, Solana DeFi protocols use it for liquidations, and it's expanding rapidly across Ethereum L2s and other chains."
category: "infra"
subcategory: "oracles"
tags: ["oracle", "price-feeds", "real-time", "high-frequency", "market-data", "first-party", "cross-chain"]
website: "https://pyth.network"
github: "https://github.com/pyth-network"
docs: "https://docs.pyth.network"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Browse all available price feeds at [pyth.network/price-feeds](https://pyth.network/price-feeds) — 500+ feeds covering crypto, equities, FX, and commodities.
2. Integrate Pyth into your smart contract using the SDK for your chain (Solana, EVM, Sui, Aptos, etc.).
3. Use the **pull-based model**: your users submit the latest Pyth price update alongside their transaction for the freshest possible data.
4. Access historical data through Pyth Benchmarks for backtesting, analytics, and settlement.

## How Pyth Powers the Ecosystem

- **Jupiter Perps** — Pyth is the price oracle for Jupiter's perpetual trading. Every long/short position, liquidation, and funding rate calculation uses Pyth's 400ms price feeds.
- **Solana DeFi** — MarginFi, Drift, Mango, and other Solana lending/perp protocols use Pyth for collateral pricing and liquidation triggers.
- **Cross-chain expansion** — Originally Solana-native, Pyth now serves 70+ chains including Ethereum, Arbitrum, Base, Optimism, Sui, and Aptos via Pyth Crosschain.
- **First-party data** — Unlike aggregated oracles, Pyth sources prices directly from Jump Trading, Jane Street, Wintermute, Binance, OKX, and other major firms. This means faster, more accurate data.

## Key Features

- **400ms update frequency** — Price updates multiple times per second, essential for latency-sensitive DeFi (perps, liquidations, MEV protection).
- **First-party data sources** — Prices come directly from major exchanges and trading firms, not aggregated from other feeds. 95+ institutional data publishers.
- **70+ blockchain support** — Available on Solana, Ethereum, Arbitrum, Base, Optimism, Sui, Aptos, Sei, Injective, and dozens more.
- **Pull-based oracle** — Users bring the latest price on-chain when needed, ensuring freshness while reducing costs vs. push-based oracles.
- **Confidence intervals** — Every price feed includes a confidence band, letting protocols make smarter risk decisions (wider spread = more uncertainty).
- **500+ price feeds** — Covers crypto tokens, US equities, forex pairs, commodities (gold, oil, etc.), and other traditional financial assets.
- **Pyth Benchmarks** — Historical price data API for backtesting strategies, settlement, and analytics.
