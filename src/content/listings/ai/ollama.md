---
name: "Ollama"
slug: "ollama"
tagline: "Run large language models locally with a simple CLI"
description: "Ollama is the easiest way to run large language models on your local machine. With a simple command-line interface inspired by Docker, it handles model downloading, quantization, and serving, making local AI inference accessible to developers and enthusiasts."
category: "ai"
subcategory: "local"
tags: ["local-ai", "cli", "self-hosted", "inference", "open-source"]
website: "https://ollama.com"
github: "https://github.com/ollama/ollama"
docs: "https://github.com/ollama/ollama/blob/main/docs/README.md"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Install Ollama from [ollama.com](https://ollama.com) with the one-line installer for macOS, Linux, or Windows.
2. Run your first model with a single command: `ollama run llama3.2` to download and start chatting.
3. Browse available models at [ollama.com/library](https://ollama.com/library) and pull any model with `ollama pull model-name`.
4. Use the OpenAI-compatible API at `localhost:11434` to integrate local models into your applications.

## Key Features

- **One-command setup** downloads and runs any supported model with a single `ollama run` command.
- **Extensive model library** hosts hundreds of models including Llama, Mistral, Gemma, Phi, Qwen, and DeepSeek.
- **OpenAI-compatible API** serves models locally with an API that works as a drop-in replacement for OpenAI.
- **Automatic quantization** optimizes models for your hardware, running efficiently on consumer GPUs and Apple Silicon.
- **Modelfile customization** lets you create custom model configurations with system prompts, parameters, and templates.
- **Cross-platform support** runs natively on macOS (Apple Silicon), Linux (NVIDIA/AMD), and Windows.
