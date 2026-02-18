---
name: "Claude Code"
slug: "claude-code"
tagline: "Anthropic's agentic coding CLI — lives in your terminal, understands your entire codebase"
description: "Claude Code is Anthropic's official command-line tool that brings Claude directly into your terminal. Powered by Opus 4, it autonomously explores codebases, edits files, runs commands, manages git, and handles complex multi-file refactors. It features slash commands, hooks, MCP server integration, IDE extensions, and a powerful agent SDK for building custom workflows."
category: "ai"
subcategory: "coding"
tags: ["coding-assistant", "terminal", "agentic", "anthropic", "cli", "opus", "mcp", "hooks", "agent-sdk", "developer-tools"]
website: "https://docs.anthropic.com/en/docs/claude-code"
docs: "https://docs.anthropic.com/en/docs/claude-code"
github: "https://github.com/anthropics/claude-code"
pricing: "paid"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Install globally: `npm install -g @anthropic-ai/claude-code` (requires Node.js 18+).
2. Navigate to your project and run `claude` to start an interactive session — it automatically maps your codebase.
3. Run `/init` to generate a `CLAUDE.md` file with project-specific instructions, conventions, and context that persists across sessions.
4. Start coding: ask it to fix bugs, add features, refactor code, write tests, create commits, or open PRs.

## Slash Commands

- `/init` — Set up a CLAUDE.md with project conventions and context
- `/compact` — Compress conversation history to free up context window
- `/cost` — Show token usage and cost for the current session
- `/clear` — Reset conversation while staying in the same project
- `/help` — View all available commands and keyboard shortcuts
- `/review` — Review a PR or diff with detailed feedback
- `/commit` — Stage changes and create a well-formatted git commit

## Key Features

- **Powered by Opus 4** — Uses the most capable Claude model for deep codebase understanding, multi-step reasoning, and complex autonomous coding tasks.
- **Agentic tool use** — Reads and edits files, runs terminal commands (builds, tests, linters), searches with glob/grep, and fetches web content — all autonomously chained together.
- **Git-native workflow** — Creates branches, stages files, writes commit messages following your repo's conventions, opens PRs via `gh`, and handles merge conflicts.
- **CLAUDE.md project memory** — Persistent project instructions that teach Claude your stack, conventions, testing patterns, and preferences across sessions.
- **Hooks system** — Configure shell commands that run automatically in response to events (pre/post tool calls, notifications). Perfect for enforcing formatting, running linters, or custom validation.
- **MCP server integration** — Connect to external tools and services via the Model Context Protocol — databases, APIs, Slack, Jira, GitHub, and any custom MCP server.
- **IDE extensions** — First-class VS Code extension with inline diff previews, status bar integration, and the ability to run Claude Code directly from your editor.
- **Claude Code Agent SDK** — Build custom AI agents on top of Claude Code's infrastructure. Create specialized agents with their own tools, system prompts, and orchestration logic.
- **Background agents** — Kick off long-running tasks (test suites, large refactors) that run asynchronously while you continue working.
- **Multi-file refactoring** — Performs complex changes across dozens of files simultaneously with awareness of imports, types, cross-file dependencies, and test coverage.
- **Subagent architecture** — Spawns specialized sub-agents for parallel research, exploration, and task execution within a single session.
- **Auto-memory** — Automatically saves patterns, debugging insights, and project-specific knowledge to a persistent memory directory for use across sessions.
- **Latest release** — Updated February 2026 with continued improvements to agentic reliability, hook configurability, and MCP server compatibility.
