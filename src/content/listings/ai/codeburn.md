---
name: "CodeBurn"
slug: "codeburn"
tagline: "TUI dashboard for tracking token costs across Claude Code, Codex, and Cursor"
description: "CodeBurn is an interactive terminal dashboard that reads AI coding session data directly from disk to visualize token usage and costs across Claude Code, Codex, Cursor, and other tools. It tracks spending by task type, model, project, and MCP server, and measures one-shot success rates to show where AI handles tasks on the first try versus burning tokens on retries. No API keys or proxies required — it works by parsing local session files."
category: "ai"
subcategory: "coding"
tags: ["ai", "cost-tracking", "tui", "claude-code", "cursor", "developer-tools", "token-usage"]
website: "https://www.npmjs.com/package/codeburn"
github: "https://github.com/getagentseal/codeburn"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-19
featured: false
---

## Getting Started

1. **Install globally via npm** — run `npm install -g codeburn` (requires Node.js 20+)
2. **Launch the dashboard** — run `codeburn` to open the interactive TUI with the last 7 days of data
3. **Explore time ranges** — use commands like `codeburn today`, `codeburn month`, or `codeburn report -p 30days` to filter by period
4. **Export your data** — run `codeburn export` for CSV or `codeburn export -f json` for JSON output

## Key Features

- **Multi-tool support** — tracks usage across Claude Code, Codex (OpenAI), Cursor, OpenCode, Pi, and GitHub Copilot
- **No wrappers or proxies** — reads session data directly from local disk files, no API keys needed
- **One-shot success tracking** — measures per-activity success rates to show where AI nails tasks first try vs. burns tokens on retries
- **Granular cost breakdowns** — segments spending by task type, model, MCP server, and project
- **Interactive TUI** — gradient charts, responsive panels, and full keyboard navigation in the terminal
- **Flexible export** — CSV and JSON export options, plus auto-refresh mode for continuous monitoring
