---
name: "Morpho Blue"
slug: "morpho-blue"
tagline: "Permissionless isolated lending markets built on a trustless primitive"
description: "Morpho Blue is a trustless lending protocol that allows anyone to create isolated lending markets with custom parameters including collateral assets, loan assets, liquidation thresholds, and oracles. Unlike pooled lending protocols, each market is independent, reducing systemic risk and enabling a wider range of assets. It serves as a foundational primitive on which more complex lending products can be built."
category: "ethereum"
subcategory: "defi-lending"
tags: ["defi", "lending", "borrowing", "permissionless", "ethereum", "money-market", "isolated-markets"]
website: "https://app.morpho.org"
github: "https://github.com/morpho-org/morpho-blue"
docs: "https://docs.morpho.org"
pricing: "free"
status: "new"
dateAdded: 2026-05-03
featured: false
---

## Getting Started

1. **Connect your wallet** — Visit app.morpho.org and connect an Ethereum-compatible wallet such as MetaMask or Coinbase Wallet.
2. **Browse markets** — Explore existing isolated lending markets, each defined by a specific collateral/loan asset pair and oracle configuration.
3. **Supply or borrow** — Deposit assets to earn yield as a lender, or provide collateral to borrow against it within a chosen market.
4. **Create a market** — If no suitable market exists, anyone can permissionlessly deploy a new isolated market with custom parameters.

## Key Features

- **Permissionless market creation** — Any user can create a new lending market by specifying collateral, loan asset, oracle, LTV, and liquidation parameters without governance approval.
- **Isolated markets** — Each market is independent, so risk from one collateral type does not spill over to others, reducing systemic exposure.
- **Minimal and immutable core** — Morpho Blue's core contract is intentionally simple and non-upgradeable, minimizing smart contract attack surface.
- **Flexible oracle support** — Markets can use any price oracle that conforms to the expected interface, enabling a broad range of assets.
- **Lending primitives for builders** — Developers can build curated vaults and higher-level products on top of Morpho Blue using the MetaMorpho vault standard.
- **No protocol fees by default** — The base protocol charges no fees, keeping it maximally efficient for lenders and borrowers.
