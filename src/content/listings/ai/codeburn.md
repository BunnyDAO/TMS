---
name: "CodeBurn"
slug: "codeburn"
tagline: "Interactive TUI dashboard for tracking Claude Code and Codex token spend"
description: "CodeBurn is an open-source terminal dashboard that reads Claude Code and Codex session transcripts directly from disk to show exactly where your AI coding tokens and money are going. It breaks down usage by task type, tool, model, MCP server, and project, and tracks one-shot success rates so you can see where the AI succeeds first try versus burns tokens on retries. No API keys, proxies, or wrappers required."
category: "ai"
subcategory: "developer-tools"
tags: ["ai", "developer-tools", "cost-management", "claude-code", "codex", "tui", "open-source", "token-tracking"]
website: "https://www.npmjs.com/package/codeburn"
github: "https://github.com/AgentSeal/codeburn"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-15
featured: false
---

## Getting Started

1. **Install via npm** — Run `npm install -g codeburn` (requires Node.js 20+), or use `npx codeburn` to run without installing.
2. **Ensure session data exists** — CodeBurn reads from `~/.claude/projects/` for Claude Code and `~/.codex/sessions/` for Codex; no extra setup needed.
3. **Launch the dashboard** — Run `codeburn` to open the interactive TUI with the default 7-day view, or use `codeburn today` or `codeburn month` for specific periods.
4. **Export or automate** — Use `codeburn export` for CSV/JSON output, or `codeburn report --refresh 60` for auto-refreshing reports.

## Key Features

- **No-proxy design** — Reads session transcripts directly from disk; no API keys, wrappers, or proxies required.
- **Multi-provider support** — Auto-detects Claude Code and Codex usage; toggle between providers in the dashboard with `p`.
- **Breakdown by dimension** — View spend and token usage sliced by task type, tool, model, MCP server, and project.
- **One-shot success tracking** — Measures first-try success rate per activity type to identify where the AI wastes tokens on retries.
- **Gradient TUI with keyboard nav** — Responsive panels, gradient charts, and keyboard shortcuts for time range switching (`1`–`4` keys).
- **CSV and JSON export** — Export usage data for today, 7-day, and 30-day windows with a single command.
