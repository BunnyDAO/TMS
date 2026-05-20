---
name: "Balancer V3"
slug: "balancer-v3"
tagline: "Flexible decentralized AMM protocol with customizable pools and vault architecture"
description: "Balancer V3 is a decentralized automated market maker protocol built on Ethereum that features a flexible vault architecture enabling customizable liquidity pools. It supports dynamic swap fees and hooks, allowing developers and liquidity providers to tailor pool behavior to specific strategies. Balancer is open-source and non-custodial, with liquidity accessible across integrating DeFi protocols and aggregators."
category: "ethereum"
subcategory: "defi"
tags: ["amm", "dex", "defi", "ethereum", "liquidity", "open-source", "pools"]
website: "https://balancer.fi/"
github: "https://github.com/balancer/balancer-v3-monorepo"
docs: "https://docs.balancer.fi/"
pricing: "free"
status: "new"
dateAdded: 2026-05-20
featured: false
---

## Getting Started

1. **Connect your wallet** — Visit balancer.fi and connect a compatible Ethereum wallet such as MetaMask or WalletConnect.
2. **Swap tokens** — Use the swap interface to exchange tokens across Balancer's liquidity pools at competitive rates.
3. **Provide liquidity** — Deposit assets into an existing pool or create a custom pool to earn swap fees from trading activity.
4. **Explore hooks and customization** — Developers can deploy custom pool types using Balancer V3's hooks system to implement tailored logic for fees, rebalancing, or access control.

## Key Features

- **Vault Architecture** — A shared singleton vault holds all pool assets, improving capital efficiency and simplifying integrations across pool types.
- **Customizable Pools** — Developers can build bespoke AMM logic by creating custom pool contracts that plug into the shared vault.
- **Hooks System** — Lifecycle hooks allow pool creators to inject custom logic at key points such as swaps, liquidity additions, and removals.
- **Dynamic Swap Fees** — Pools can adjust fees programmatically in response to market conditions or governance parameters.
- **Non-Custodial** — Users retain full control of their assets; all operations are governed by audited smart contracts with no central intermediary.
- **Composable Liquidity** — Balancer pools are accessible to aggregators and other DeFi protocols, making liquidity broadly usable across the ecosystem.
