---
name: "Browser Harness"
slug: "browser-harness"
tagline: "Self-healing browser harness that lets LLMs autonomously complete tasks in Chrome"
description: "Browser Harness is a minimal (~592 lines of Python) self-healing browser automation layer that connects LLMs directly to Chrome via CDP (Chrome DevTools Protocol). When a needed browser function is missing mid-task, the agent writes it itself, extending the harness on the fly. Built by the browser-use team, it requires no framework, no recipes, and no predefined flows."
category: "ai"
subcategory: "agents"
tags: ["browser-automation", "llm", "agents", "cdp", "open-source", "developer-tools", "ai"]
website: "https://github.com/browser-use/browser-harness"
github: "https://github.com/browser-use/browser-harness"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-19
featured: false
---

## Getting Started

1. **Install and connect** — Read `install.md` in the repo to install dependencies and connect Browser Harness to your real Chrome browser via remote debugging.
2. **Paste the setup prompt** — Copy the provided setup prompt into Claude Code or Codex and let the agent handle first-time configuration automatically.
3. **Enable remote debugging** — When the setup page appears, tick the checkbox to allow the agent to connect to your browser over CDP.
4. **Run tasks** — Use `SKILL.md` for day-to-day usage; the agent reads `helpers.py` for available functions and writes new ones as needed during tasks.

## Key Features

- **Self-healing harness** — When the agent needs a browser function that doesn't exist yet, it writes the code itself mid-task without stopping or failing.
- **Direct CDP connection** — One WebSocket to Chrome with nothing in between; no framework overhead or abstraction layers.
- **Agent-editable helpers** — `helpers.py` serves as a living toolset that grows as the agent discovers new patterns and selectors.
- **Domain skills** — A collection of community-contributed task recipes covering sites like LinkedIn, Amazon, and more, written by the agent itself during real runs.
- **Free remote browsers** — Cloud tier provides 3 concurrent remote browsers at no cost, useful for sub-agents and deployment scenarios.
- **Minimal codebase** — The entire harness is ~592 lines of Python across a handful of well-defined files, making it easy to understand and extend.
