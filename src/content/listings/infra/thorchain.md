---
name: "THORChain"
slug: "thorchain"
tagline: "Decentralized cross-chain swaps for native assets without wrapping or bridges"
description: "THORChain is a decentralized liquidity protocol that enables native asset swaps across Bitcoin, Ethereum, and other blockchains without wrapped tokens, custodians, or intermediaries. It uses an AMM model with liquidity pools and its native RUNE token to facilitate pricing and settlement across chains. Unlike traditional bridges, THORChain holds native assets in its vaults directly, removing the need for synthetic or wrapped representations."
category: "infra"
subcategory: "bridges"
tags: ["cross-chain", "dex", "amm", "bitcoin", "ethereum", "native-swaps", "defi"]
website: "https://thorchain.org"
github: "https://github.com/thorchain"
docs: "https://docs.thorchain.org"
pricing: "free"
status: "new"
dateAdded: 2026-04-25
featured: false
---

## Getting Started

1. **Access a THORChain interface** — Use a compatible frontend such as THORSwap, Rango, or any wallet that integrates THORChain liquidity.
2. **Connect your wallet** — THORChain works with standard wallets for each supported chain (e.g., MetaMask for Ethereum, native Bitcoin wallets); no specialized wallet is required.
3. **Select assets and swap** — Choose a source asset and destination asset across supported chains. THORChain routes the swap natively through its liquidity pools.
4. **Provide liquidity (optional)** — Deposit native assets into THORChain liquidity pools alongside RUNE to earn swap fees.

## Key Features

- **Native asset swaps** — Swaps settle in the actual native asset on each chain, not wrapped or synthetic versions, reducing counterparty risk.
- **No bridges required** — THORChain's validator network holds assets in distributed vaults, eliminating reliance on traditional bridge infrastructure.
- **Cross-chain AMM** — Uses an automated market maker model with continuous liquidity pools, enabling permissionless price discovery across chains.
- **RUNE settlement layer** — All pools pair against RUNE, which acts as the settlement asset and aligns node operator incentives with network security.
- **Streaming swaps** — Large trades can be split into smaller sub-swaps over time to minimize slippage on significant order sizes.
- **Censorship resistance** — The protocol is governed by on-chain rules with no admin keys, making it resistant to unilateral censorship or shutdown.
