---
name: "Hardhat"
slug: "hardhat"
tagline: "Ethereum development environment for compiling, testing, and deploying"
description: "Hardhat is a comprehensive Ethereum development environment that helps developers compile, deploy, test, and debug Solidity smart contracts. With a rich plugin ecosystem and JavaScript/TypeScript-based workflow, it has been the standard toolchain for Ethereum development."
category: "ethereum"
subcategory: "dev-tools"
tags: ["development", "testing", "solidity", "javascript", "smart-contracts"]
website: "https://hardhat.org"
github: "https://github.com/NomicFoundation/hardhat"
docs: "https://hardhat.org/docs"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Initialize a new project: `npx hardhat init` and choose a JavaScript or TypeScript project template.
2. Write your Solidity smart contracts in the `contracts/` directory.
3. Write tests using Mocha, Chai, and ethers.js in the `test/` directory and run them with `npx hardhat test`.
4. Deploy contracts using Hardhat Ignition or custom scripts with `npx hardhat ignition deploy`.

## Key Features

- **JavaScript/TypeScript workflow** write tests, scripts, and deployment logic in familiar JavaScript or TypeScript.
- **Hardhat Network** built-in local Ethereum network with console.log debugging, stack traces, and mainnet forking.
- **Rich plugin ecosystem** extends functionality with plugins for ethers.js, Etherscan verification, gas reporting, and more.
- **Hardhat Ignition** declarative deployment system for reproducible, verifiable smart contract deployments.
- **Mainnet forking** test against real chain state by forking Ethereum mainnet or any EVM chain locally.
- **Solidity debugging** provides clear error messages, stack traces, and console.log support within smart contracts.
