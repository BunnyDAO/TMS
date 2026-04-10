---
name: "Parlor"
slug: "parlor"
tagline: "On-device, real-time multimodal AI for voice and vision conversations"
description: "Parlor runs entirely on your local machine, enabling natural voice and vision conversations powered by Gemma 4 E2B for speech and vision understanding and Kokoro for text-to-speech. It streams audio back sentence-by-sentence before the full response is generated, supports barge-in interruptions, and uses browser-based voice activity detection for hands-free operation. No cloud API calls or server costs — everything runs locally on Apple Silicon or Linux with a supported GPU."
category: "ai"
subcategory: "local-ai"
tags: ["local-ai", "multimodal", "voice", "vision", "on-device", "gemma", "open-source"]
website: "https://github.com/fikrikarim/parlor"
github: "https://github.com/fikrikarim/parlor"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-10
featured: false
---

## Getting Started

1. **Clone the repo** — `git clone https://github.com/fikrikarim/parlor.git && cd parlor`
2. **Install uv** — `curl -LsSf https://astral.sh/uv/install.sh | sh` (if not already installed)
3. **Run the server** — `cd src && uv sync && uv run server.py`
4. **Open your browser** — Navigate to `http://localhost:8000`, grant camera and microphone access, and start talking. Models (~2.6 GB) are downloaded automatically on first run.

## Key Features

- **Fully on-device** — All inference runs locally; no API keys, no cloud costs, no data leaving your machine
- **Voice + vision** — Talk to the AI and show your camera simultaneously; Gemma 4 E2B handles both modalities
- **Hands-free VAD** — Browser-side Silero Voice Activity Detection detects when you speak with no push-to-talk required
- **Barge-in support** — Interrupt the AI mid-sentence by simply speaking; it stops and listens
- **Streaming TTS** — Kokoro begins playing audio before the full response is generated, reducing perceived latency
- **Cross-platform** — Runs on macOS with Apple Silicon (MLX) or Linux with a supported GPU (ONNX)
