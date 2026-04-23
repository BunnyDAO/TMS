---
name: "Browser Harness"
slug: "browser-harness"
tagline: "Self-healing browser harness that gives LLMs complete freedom to automate any browser task"
description: "Browser Harness is a minimal (~592 lines of Python) self-healing browser automation layer built directly on Chrome DevTools Protocol (CDP). It gives LLMs complete freedom to execute browser tasks by writing missing helper functions mid-task, with no framework overhead or predefined recipes. Agents can extend the harness themselves as they discover new patterns, making it progressively more capable over time."
category: "ai"
subcategory: "agents"
tags: ["browser-automation", "ai-agents", "llm", "cdp", "open-source", "developer-tools", "self-healing"]
website: "https://browser-use.com"
github: "https://github.com/browser-use/browser-harness"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-23
featured: false
---

## Getting Started

1. **Install the harness** — Clone the repo and follow `install.md` to install dependencies and connect to your real browser via remote debugging.
2. **Connect to Chrome** — Enable remote debugging in Chrome by ticking the checkbox in the setup page so the agent can connect via CDP websocket.
3. **Paste the setup prompt** — Copy the provided setup prompt into Claude Code or Codex and let the agent handle the rest of the installation and verification.
4. **Run tasks** — Use `SKILL.md` for day-to-day usage guidance; the agent reads `helpers.py` for available functions and extends it as needed.

## Key Features

- **Self-healing execution** — The agent writes missing helper functions mid-task, so gaps in `helpers.py` are filled automatically as new situations arise.
- **Built directly on CDP** — One WebSocket connection to Chrome with nothing in between, keeping the stack thin and transparent.
- **Agent-editable helpers** — `helpers.py` starts with ~195 lines of tool calls and grows as the agent discovers and codifies new patterns.
- **Domain skills system** — A `domain-skills/` directory stores agent-generated skill files for sites and workflows, accumulating reusable knowledge over time.
- **Free remote browsers** — Optional cloud tier at `cloud.browser-use.com` offers 3 concurrent browsers with proxies and captcha solving at no cost.
- **Minimal codebase** — The entire harness is ~592 lines of Python across a handful of files, making it easy to audit, fork, and understand.
