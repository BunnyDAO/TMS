---
name: "Open WebUI"
slug: "open-webui"
tagline: "Self-hosted web UI for running AI models locally with Ollama and OpenAI-compatible APIs"
description: "Open WebUI is a feature-rich, self-hosted AI platform that runs entirely offline and supports LLM backends like Ollama and any OpenAI-compatible API. It provides a polished chat interface with built-in RAG support, user management, and extensible plugins. Designed for privacy-conscious users and teams who want full control over their AI infrastructure."
category: "ai"
subcategory: "local-ai"
tags: ["local-ai", "self-hosted", "ollama", "open-source", "privacy", "rag", "ui"]
website: "https://openwebui.com"
github: "https://github.com/open-webui/open-webui"
docs: "https://docs.openwebui.com"
pricing: "open-source"
status: "new"
dateAdded: 2026-02-19
featured: false
---

## Getting Started

1. **Install via Docker** — Run `docker run -d -p 3000:80 ghcr.io/open-webui/open-webui:main` to spin up the interface locally
2. **Connect a backend** — Point Open WebUI at your local Ollama instance or any OpenAI-compatible API endpoint (LMStudio, Groq, Mistral, etc.)
3. **Pull a model** — Use the built-in model manager to download and manage LLMs directly from the UI
4. **Start chatting** — Open your browser at `localhost:3000` and begin using your chosen model with full chat history and settings

## Key Features

- **Multi-backend support** — Works with Ollama, OpenAI API, LMStudio, GroqCloud, Mistral, OpenRouter, and other compatible endpoints
- **Built-in RAG** — Retrieval-Augmented Generation lets you chat with your own documents and knowledge bases without external services
- **User management** — Granular role-based permissions and user groups for secure multi-user deployments
- **Progressive Web App** — Installable as a PWA on mobile devices for a native app-like offline experience
- **Full Markdown & LaTeX** — Rich text rendering including mathematical notation for technical and academic use cases
- **Extensible plugins** — Community-built plugins and tools extend functionality without modifying core code
