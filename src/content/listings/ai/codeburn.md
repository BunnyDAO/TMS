---
name: "CodeBurn"
slug: "codeburn"
tagline: "TUI dashboard for tracking AI coding token costs across Claude Code, Codex, and Cursor"
description: "CodeBurn is an interactive terminal dashboard that reads session data directly from disk to visualize token usage and costs across Claude Code, Codex, OpenAI, Cursor, and other AI coding tools. It tracks spending by task type, model, project, and MCP server, and measures one-shot success rates so you can see where AI retries are burning tokens. No API keys, wrappers, or proxies required — just install and run."
category: "ai"
subcategory: "coding"
tags: ["ai", "cost-tracking", "claude-code", "cursor", "developer-tools", "tui", "token-usage"]
website: "https://www.npmjs.com/package/codeburn"
github: "https://github.com/AgentSeal/codeburn"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-18
featured: false
---

## Getting Started

1. **Install globally** — run `npm install -g codeburn` (requires Node.js 20+)
2. **Launch the dashboard** — run `codeburn` to open the interactive TUI with the last 7 days of data
3. **Explore time ranges** — use `codeburn today`, `codeburn month`, or `codeburn report -p 30days` to filter by period
4. **Export your data** — run `codeburn export` for CSV or `codeburn export -f json` for JSON output

## Key Features

- **Multi-tool support** — tracks Claude Code, Codex, Cursor, OpenCode, Pi, and GitHub Copilot in one dashboard
- **No instrumentation needed** — reads session files directly from disk with no API keys, proxies, or wrappers
- **One-shot success tracking** — shows where AI completes tasks first try versus burning tokens on retries
- **Granular breakdowns** — visualizes spend by task type, model, MCP server, and project
- **Optimization suggestions** — `codeburn optimize` identifies waste and provides copy-paste fixes
- **Flexible export** — supports CSV and JSON export, plus auto-refresh mode for live monitoring
