---
name: "Browser Harness"
slug: "browser-harness"
tagline: "Self-healing browser harness that lets LLMs complete any browser task autonomously"
description: "Browser Harness is a minimal (~592 lines of Python) self-healing framework that connects LLMs directly to Chrome via the Chrome DevTools Protocol (CDP). When the agent encounters a missing capability mid-task, it writes the helper function itself and continues without interruption. It requires no framework, no recipes, and no abstraction layers between the agent and the browser."
category: "ai"
subcategory: "agents"
tags: ["ai-agents", "browser-automation", "llm", "cdp", "open-source", "developer-tools", "self-healing"]
website: "https://browser-use.com"
github: "https://github.com/browser-use/browser-harness"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-21
featured: false
---

## Getting Started

1. **Clone the repo** — Clone `browser-use/browser-harness` from GitHub and read `install.md` for first-time setup instructions.
2. **Connect to your browser** — Enable remote debugging in Chrome by checking the required checkbox in the browser settings page that appears during setup.
3. **Paste the setup prompt** — Copy the provided setup prompt into Claude Code or Codex, which will walk the agent through installing and verifying the connection to your live browser.
4. **Run tasks** — Describe what you want done; the agent uses `helpers.py` as its toolbox and extends it on the fly when new capabilities are needed.

## Key Features

- **Self-healing execution** — When a required browser helper is missing mid-task, the agent writes it into `helpers.py` itself and continues without failing or stopping.
- **Direct CDP connection** — Communicates with Chrome over a single WebSocket via the Chrome DevTools Protocol, with no framework or middleware in between.
- **Minimal codebase** — The entire harness is roughly 592 lines of Python across five files, making it easy to read, audit, and modify.
- **Domain skills** — A growing collection of agent-generated skill files in `domain-skills/` captures site-specific selectors and flows so the agent doesn't have to rediscover them each run.
- **Free remote browsers** — A cloud tier at `cloud.browser-use.com` provides up to 3 concurrent remote browsers at no cost, useful for sub-agents or deployment scenarios.
- **LLM-agnostic** — Works with any LLM that can execute Python and interact with a websocket, including Claude and OpenAI Codex-based tools.
