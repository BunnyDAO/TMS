---
name: "Anchor"
slug: "anchor"
tagline: "Framework for building secure Solana programs in Rust"
description: "Anchor is the standard framework for developing Solana programs (smart contracts) in Rust. It provides a developer-friendly abstraction layer with declarative macros, automatic serialization, and built-in security checks that dramatically simplify Solana program development."
category: "solana"
subcategory: "dev-tools"
tags: ["framework", "rust", "smart-contracts", "development", "security"]
website: "https://anchor-lang.com"
github: "https://github.com/coral-xyz/anchor"
docs: "https://www.anchor-lang.com/docs"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Install the Anchor CLI: `cargo install --git https://github.com/coral-xyz/anchor anchor-cli`.
2. Create a new project with `anchor init my-program` to scaffold a program with test structure.
3. Define your program's instructions and accounts using Anchor's declarative macros in `lib.rs`.
4. Build and test locally with `anchor build && anchor test`, then deploy to devnet with `anchor deploy`.

## Key Features

- **Declarative account validation** define account constraints with macros that automatically generate security checks.
- **Automatic serialization** handles Borsh serialization and deserialization of account data and instruction arguments.
- **IDL generation** automatically generates an Interface Description Language file for client-side integration.
- **TypeScript client** auto-generates a TypeScript client library from the IDL for seamless frontend integration.
- **Built-in testing** provides a testing framework with local validator support for rapid development iteration.
- **Security-first design** eliminates common Solana vulnerabilities like missing signer checks and account validation errors.
