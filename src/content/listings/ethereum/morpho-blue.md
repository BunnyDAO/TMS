---
name: "Morpho Blue"
slug: "morpho-blue"
tagline: "Trustless permissionless lending primitive for isolated markets on Ethereum"
description: "Morpho Blue is a decentralized lending protocol on Ethereum that allows anyone to create isolated lending markets with custom parameters including collateral asset, loan asset, LTV, and oracle. Unlike traditional pooled lending protocols, each market is independent, reducing systemic risk and enabling highly specific risk configurations. It serves as a base layer primitive on top of which more complex lending products can be built."
category: "ethereum"
subcategory: "defi-lending"
tags: ["ethereum", "lending", "defi", "permissionless", "money-market", "isolated-markets", "open-source"]
website: "https://app.morpho.org"
github: "https://github.com/morpho-org/morpho-blue"
docs: "https://docs.morpho.org"
pricing: "free"
status: "new"
dateAdded: 2026-05-02
featured: false
---

## Getting Started

1. **Connect your wallet** — Visit [app.morpho.org](https://app.morpho.org) and connect a compatible Ethereum wallet such as MetaMask or Coinbase Wallet.
2. **Browse markets** — Explore existing isolated lending markets or filter by collateral and loan asset pairs that match your needs.
3. **Supply or borrow** — Deposit collateral to borrow assets, or supply liquidity to a market to earn interest from borrowers.
4. **Create a market** — Anyone can permissionlessly deploy a new isolated market by specifying collateral, loan token, oracle, and risk parameters.

## Key Features

- **Permissionless market creation** — Any user or protocol can create a lending market with fully custom parameters without governance approval.
- **Isolated risk** — Each market is independent, meaning a liquidation or exploit in one market does not affect others.
- **Minimal and audited codebase** — Morpho Blue is designed as a simple, immutable core contract to minimize attack surface and maximize trustlessness.
- **Custom oracles and LTV** — Market creators choose their own price oracle and loan-to-value ratios, enabling fine-grained risk control.
- **Composable primitive** — Designed to serve as a base layer that other protocols, vaults, and aggregators can build on top of.
- **No protocol fees by default** — The core protocol imposes no fees, making it highly efficient for both lenders and borrowers.
