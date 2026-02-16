---
name: "Foundry"
slug: "foundry"
tagline: "Blazing fast Ethereum development toolkit written in Rust"
description: "Foundry is a fast, portable Ethereum development toolkit written in Rust. It includes Forge for testing, Cast for interacting with contracts, Anvil for local development, and Chisel for Solidity REPL, making it the preferred toolchain for professional Solidity developers."
category: "ethereum"
subcategory: "dev-tools"
tags: ["development", "testing", "solidity", "rust", "smart-contracts"]
website: "https://getfoundry.sh"
github: "https://github.com/foundry-rs/foundry"
docs: "https://book.getfoundry.sh"
pricing: "open-source"
status: "hot"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Install Foundry with the one-line installer: `curl -L https://foundry.paradigm.xyz | bash && foundryup`.
2. Create a new project with `forge init my-project` to scaffold a complete Solidity project structure.
3. Write tests in Solidity using Forge's testing framework and run them with `forge test`.
4. Deploy contracts with `forge create` or `forge script` and interact using `cast` CLI commands.

## Key Features

- **Blazing fast compilation and testing** written in Rust for speed that is orders of magnitude faster than JavaScript-based tools.
- **Solidity-native testing** write tests in Solidity alongside your contracts for a natural, efficient testing workflow.
- **Fuzz testing** built-in property-based fuzzing automatically generates test inputs to find edge cases and bugs.
- **Forking mode** fork any EVM chain state for testing against real deployed contracts and data.
- **Cast CLI** interact with deployed contracts, send transactions, and query chain data from the command line.
- **Anvil local node** spin up a local Ethereum node for development with configurable block times and account state.
