---
name: "Morpho Blue"
slug: "morpho-blue"
tagline: "Trustless permissionless lending primitive for isolated markets on Ethereum"
description: "Morpho Blue is a decentralized lending protocol on Ethereum that allows anyone to create isolated lending markets with custom parameters, including choice of collateral asset, loan asset, oracle, and liquidation LTV. Unlike monolithic lending protocols, each market is independent, limiting systemic risk across positions. It serves as a base layer primitive that other protocols and curators can build upon to offer more opinionated lending products."
category: "ethereum"
subcategory: "defi-lending"
tags: ["ethereum", "lending", "defi", "permissionless", "money-market", "isolated-markets", "open-source"]
website: "https://app.morpho.org"
github: "https://github.com/morpho-org/morpho-blue"
docs: "https://docs.morpho.org"
pricing: "free"
status: "new"
dateAdded: 2026-05-01
featured: false
---

## Getting Started

1. **Connect your wallet** — Navigate to [app.morpho.org](https://app.morpho.org) and connect an Ethereum-compatible wallet such as MetaMask or Coinbase Wallet.
2. **Browse markets** — Explore existing isolated lending markets to find a collateral/loan asset pair that suits your needs, or review yield opportunities as a lender.
3. **Supply or borrow** — Deposit assets to earn lending yield, or supply collateral and borrow against it within a chosen market's parameters.
4. **Monitor positions** — Track your health factor and interest accrual directly in the interface to manage liquidation risk.

## Key Features

- **Permissionless market creation** — Anyone can deploy a new isolated lending market by specifying collateral, loan asset, oracle, interest rate model, and liquidation LTV with no governance approval required.
- **Isolated risk** — Each market is fully independent, so a problem in one market does not cascade to others, reducing systemic protocol risk.
- **Minimal and audited core** — The Morpho Blue contract is intentionally small and immutable, making it easier to audit and reducing the attack surface.
- **Curator layer** — Third-party curators (such as MetaMorpho vaults) can build opinionated risk management products on top of the primitive, abstracting complexity for end users.
- **Capital efficiency** — The protocol is designed to maximize utilization and efficient capital allocation between lenders and borrowers.
- **Open source** — All smart contract code is publicly available, enabling developers to integrate or build on top of Morpho Blue freely.
