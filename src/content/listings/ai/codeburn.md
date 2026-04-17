---
name: "CodeBurn"
slug: "codeburn"
tagline: "Interactive TUI dashboard for tracking AI coding token costs across Claude Code, Cursor, and more"
description: "CodeBurn is an open-source terminal dashboard that reads session data directly from disk to visualize token usage and costs across Claude Code, Codex, Cursor, OpenCode, and GitHub Copilot. It tracks spending by task type, model, project, and MCP server, and measures one-shot success rates so you can see where AI tools burn tokens on retries. No API keys, proxies, or wrappers required."
category: "ai"
subcategory: "developer-tools"
tags: ["ai-coding", "cost-tracking", "tui", "claude-code", "cursor", "observability", "developer-tools"]
website: "https://www.npmjs.com/package/codeburn"
github: "https://github.com/AgentSeal/codeburn"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-17
featured: false
---

## Getting Started

1. **Install via npm** — Run `npm install -g codeburn` (requires Node.js 20+), or use `npx codeburn` without installing.
2. **Launch the dashboard** — Run `codeburn` to open the interactive TUI with a default 7-day view of your token usage.
3. **Explore time ranges** — Use commands like `codeburn today`, `codeburn month`, or `codeburn report -p 30days` to filter by period.
4. **Export or optimize** — Run `codeburn export` for CSV/JSON reports, or `codeburn optimize` to identify wasteful patterns and get actionable fixes.

## Key Features

- **Multi-tool support** — Tracks token usage across Claude Code, Codex (OpenAI), Cursor, OpenCode, Pi, and GitHub Copilot via a provider plugin system.
- **No instrumentation required** — Reads session data directly from disk; no API keys, proxies, or wrappers needed.
- **One-shot success tracking** — Measures first-try success rates per activity type so you can see where AI nails it vs. burns tokens on edit/test/fix retries.
- **Interactive TUI dashboard** — Gradient charts, responsive panels, and full keyboard navigation built into the terminal interface.
- **Flexible reporting** — Export data as CSV or JSON, auto-refresh on a timer, and filter by project, model, or MCP server.
- **macOS menu bar widget** — Optional SwiftBar integration for at-a-glance cost monitoring from your menu bar.
