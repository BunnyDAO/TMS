---
name: "Parlor"
slug: "parlor"
tagline: "On-device real-time voice and vision AI conversations powered by Gemma 4 and Kokoro"
description: "Parlor is an open-source tool that runs multimodal AI entirely on your local machine, enabling natural voice and camera-based conversations without sending data to any server. It uses Gemma 4 E2B for speech and vision understanding and Kokoro for text-to-speech, running in real-time on Apple Silicon or Linux with a supported GPU. The browser-based interface supports hands-free voice activity detection, barge-in interruption, and sentence-level streaming audio."
category: "ai"
subcategory: "local-ai"
tags: ["local-ai", "multimodal", "voice-ai", "on-device", "open-source", "gemma", "real-time"]
website: "https://github.com/fikrikarim/parlor"
github: "https://github.com/fikrikarim/parlor"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-11
featured: false
---

## Getting Started

1. **Clone the repo** — `git clone https://github.com/fikrikarim/parlor.git && cd parlor`
2. **Install uv** — `curl -LsSf https://astral.sh/uv/install.sh | sh` (skip if already installed)
3. **Install dependencies and start the server** — `cd src && uv sync && uv run server.py`
4. **Open the app** — Visit [http://localhost:8000](http://localhost:8000), grant camera and microphone access, and start talking. Models (~2.6 GB) download automatically on first run.

## Key Features

- **Fully on-device** — All inference runs locally; no data leaves your machine and no API costs
- **Voice + vision** — Combines microphone input and live camera feed for true multimodal conversations
- **Hands-free VAD** — Uses Silero VAD in the browser for automatic voice activity detection with no push-to-talk required
- **Barge-in support** — Interrupt the AI mid-response by speaking, just like a natural conversation
- **Streaming TTS** — Kokoro begins playing audio before the full response is generated, reducing perceived latency
- **Cross-platform** — Runs on macOS with Apple Silicon (MLX) or Linux with a supported GPU (ONNX)
