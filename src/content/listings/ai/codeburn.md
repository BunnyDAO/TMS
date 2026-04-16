---
name: "CodeBurn"
slug: "codeburn"
tagline: "Interactive TUI dashboard for tracking AI coding token costs across Claude Code, Codex, and Cursor"
description: "CodeBurn is an open-source terminal dashboard that reads session data directly from disk to visualize token usage and costs across Claude Code, Codex, Cursor, and OpenCode. It tracks spending by task type, model, project, and MCP server, and measures one-shot success rates so developers can see where AI tools excel versus where they burn tokens on retries. No proxy, no API keys, and no wrappers required."
category: "ai"
subcategory: "developer-tools"
tags: ["ai", "developer-tools", "cost-tracking", "claude-code", "cursor", "tui", "token-usage", "open-source"]
website: "https://www.npmjs.com/package/codeburn"
github: "https://github.com/AgentSeal/codeburn"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-16
featured: false
---

## Getting Started

1. **Install globally via npm** — Run `npm install -g codeburn` (requires Node.js 20+)
2. **Launch the dashboard** — Run `codeburn` to open the interactive TUI with the last 7 days of data
3. **Navigate time ranges** — Use arrow keys or `1` `2` `3` `4` shortcuts to switch between Today, 7 Days, 30 Days, and Month views
4. **Export your data** — Run `codeburn export` for CSV or `codeburn export -f json` for JSON output

## Key Features

- **Multi-provider support** — Tracks Claude Code, Codex (OpenAI), Cursor, and OpenCode; press `p` in the dashboard to toggle between providers
- **No instrumentation needed** — Reads session data directly from disk with no proxy, wrapper, or API keys required
- **One-shot success rate tracking** — Shows where AI nails tasks on the first try versus burning tokens on edit/test/fix retries
- **Granular cost breakdown** — Visualizes spend by task type, model, project, and MCP server with gradient charts
- **Flexible reporting** — Supports rolling time windows, auto-refresh intervals, and compact one-liner status output
- **LiteLLM pricing data** — Auto-cached pricing for all supported models with no manual configuration
