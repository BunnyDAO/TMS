---
name: "DeepSeek"
slug: "deepseek"
tagline: "Open-source frontier models at a fraction of the cost — R1 reasoning shook the industry"
description: "DeepSeek is a Chinese AI lab that stunned the world by training frontier-quality models for a fraction of typical costs. DeepSeek-R1 matches or beats OpenAI's o1 on reasoning benchmarks, and DeepSeek-V3 rivals GPT-4 — both fully open-source. Their mixture-of-experts architecture and efficient training methods have reshaped the AI cost curve."
category: "ai"
subcategory: "llms"
tags: ["llm", "open-source", "reasoning", "deepseek-r1", "deepseek-v3", "efficient", "moe", "chain-of-thought"]
website: "https://deepseek.com"
github: "https://github.com/deepseek-ai"
docs: "https://platform.deepseek.com/docs"
pricing: "open-source"
status: "hot"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Try DeepSeek online at [chat.deepseek.com](https://chat.deepseek.com) — free tier available with generous limits.
2. For API access, sign up at [platform.deepseek.com](https://platform.deepseek.com) — uses OpenAI-compatible endpoints, so just swap your base URL.
3. Run locally with Ollama: `ollama run deepseek-r1` for reasoning or `ollama run deepseek-v3` for general use.
4. Toggle "DeepThink" mode in the chat for complex math, coding, and logic problems that benefit from extended chain-of-thought reasoning.

## Model Lineup

- **DeepSeek-R1** — The reasoning model that shook the industry. Transparent chain-of-thought that rivals o1/o3 on AIME, MATH, and coding benchmarks. Shows its thinking process step by step.
- **DeepSeek-V3** — A 671B parameter MoE model (37B active) that matches GPT-4 class performance at a tiny fraction of the training cost (~$5.5M vs hundreds of millions).
- **DeepSeek-Coder-V2** — Specialized coding model with strong performance across languages and frameworks.

## Key Features

- **Industry-disrupting cost efficiency** — V3 was trained for ~$5.5M, proving frontier AI doesn't require billions in compute. API pricing is among the cheapest available.
- **Transparent reasoning (R1)** — Unlike black-box models, R1 shows every step of its chain-of-thought, making it easy to verify and debug its logic.
- **Fully open-source weights** — Released under MIT license. Download, self-host, fine-tune, and deploy without restrictions.
- **Mixture-of-Experts (MoE)** — Only activates ~37B of 671B parameters per query, slashing inference costs while maintaining quality.
- **OpenAI-compatible API** — Drop-in replacement for OpenAI's API. Change one line of code (the base URL) and you're running DeepSeek.
- **Distilled variants** — Smaller versions (1.5B, 7B, 14B, 32B, 70B) distilled from R1, runnable on consumer hardware via Ollama or vLLM.
