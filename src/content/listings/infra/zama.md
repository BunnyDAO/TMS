---
name: "Zama"
slug: "zama"
tagline: "Open source FHE cryptography enabling confidential smart contracts on any blockchain"
description: "Zama builds open source Fully Homomorphic Encryption (FHE) solutions that allow computation on encrypted data without ever decrypting it. Their Confidential Blockchain Protocol enables confidential smart contracts on any L1 or L2, bringing programmable privacy to blockchain applications. By making FHE practical and accessible, Zama allows developers to build applications where sensitive data remains encrypted throughout processing."
category: "infra"
subcategory: "privacy"
tags: ["fhe", "cryptography", "privacy", "open-source", "blockchain", "smart-contracts", "ethereum"]
website: "https://www.zama.org/"
github: "https://github.com/zama-ai"
docs: "https://docs.zama.ai/"
pricing: "open-source"
status: "new"
dateAdded: 2026-05-13
featured: false
---

## Getting Started

1. **Explore the libraries** — Visit the Zama GitHub organization to browse FHE libraries like fhEVM, TFHE-rs, and Concrete.
2. **Install a library** — Pick the library suited to your use case (e.g., fhEVM for blockchain, TFHE-rs for Rust-based FHE) and follow the installation instructions in the docs.
3. **Try the examples** — Each library includes example projects demonstrating confidential token transfers, encrypted voting, and other privacy-preserving patterns.
4. **Deploy confidential contracts** — Use fhEVM to write and deploy smart contracts that operate on encrypted state on supported EVM-compatible networks.

## Key Features

- **fhEVM** — An FHE-enabled EVM implementation that allows smart contracts to compute on encrypted data, enabling confidential on-chain logic.
- **TFHE-rs** — A pure Rust implementation of the TFHE scheme, providing fast and composable FHE operations for developers.
- **Concrete** — A compiler that translates regular programs into FHE-compatible equivalents, lowering the barrier to writing encrypted computation.
- **Confidential Blockchain Protocol** — A protocol layer that integrates FHE into any L1 or L2, enabling confidential smart contracts without changing the base chain.
- **Open Source** — All core libraries and tooling are released under open source licenses, allowing community audit, contribution, and integration.
- **Cross-chain Compatibility** — Designed to work across multiple blockchain environments, not limited to a single network or ecosystem.
