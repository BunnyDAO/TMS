---
name: "Aider"
slug: "aider"
tagline: "Terminal-based AI pair programmer that edits code in your git repo"
description: "Aider is an open-source AI pair programming tool that runs in your terminal and makes real changes to your local git repository. It supports multiple LLMs, understands your codebase structure, and creates well-formatted git commits for each set of changes."
category: "ai"
subcategory: "coding"
tags: ["pair-programming", "terminal", "git", "open-source", "cli"]
website: "https://aider.chat"
github: "https://github.com/paul-gauthier/aider"
docs: "https://aider.chat/docs"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Install Aider via pip: `python -m pip install aider-chat`.
2. Set your API key for your preferred model provider (e.g., `export ANTHROPIC_API_KEY=your-key`).
3. Navigate to a git repository and run `aider` to start an interactive pair programming session.
4. Add files to the chat context with `/add filename` and describe the changes you want in natural language.

## Key Features

- **Direct git integration** automatically creates meaningful commits for each set of AI-generated changes.
- **Repository map** builds an understanding of your entire codebase structure for contextually relevant edits.
- **Multi-model support** works with Claude, GPT-4, Gemini, DeepSeek, local models, and dozens of other providers.
- **Architect mode** uses a strong model for planning and a fast model for execution, optimizing cost and quality.
- **Voice coding** supports voice input for hands-free pair programming sessions via speech-to-text.
- **Benchmarked and tested** consistently ranks among the top AI coding tools on the SWE-bench software engineering benchmark.
