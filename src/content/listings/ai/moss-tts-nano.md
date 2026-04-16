---
name: "MOSS-TTS-Nano"
slug: "moss-tts-nano"
tagline: "Tiny 0.1B multilingual TTS model that runs on CPU in real time"
description: "MOSS-TTS-Nano is an open-source multilingual text-to-speech model with only 0.1 billion parameters, developed by OpenMOSS and MOSI.AI. It is designed for real-time speech generation and runs entirely on CPU without requiring a GPU. The model is suitable for local demos, web serving, and lightweight product integration, and supports finetuning on custom voices."
category: "ai"
subcategory: "audio-generation"
tags: ["tts", "speech-synthesis", "local-ai", "open-source", "multilingual", "lightweight", "cpu-inference"]
website: "https://openmoss.github.io/MOSS-TTS-Nano-Demo/"
github: "https://github.com/OpenMOSS/MOSS-TTS-Nano"
docs: "https://studio.mosi.cn/docs/moss-tts-nano"
pricing: "open-source"
status: "new"
dateAdded: 2026-04-16
featured: false
---

## Getting Started

1. **Install dependencies** — Clone the repository and install the required Python packages via `pip install -r requirements.txt`.
2. **Download the model** — Fetch the model weights from Hugging Face (`OpenMOSS-Team/MOSS-TTS-Nano`) or ModelScope.
3. **Run inference** — Use the provided Python scripts or the command-line interface to synthesize speech from text input.
4. **Finetune (optional)** — Use the included finetuning code in `./finetuning/` to adapt the model to a custom voice or language.

## Key Features

- **CPU-only inference** — Runs in real time without a GPU, making it deployable on standard hardware and edge devices.
- **Tiny footprint** — At 0.1B parameters, the model is significantly smaller than typical TTS systems while remaining production-capable.
- **Multilingual support** — Handles multiple languages out of the box, suitable for diverse use cases.
- **Finetuning support** — Official finetuning code is provided so developers can train custom voices with their own data.
- **Multiple deployment targets** — Works for local demos, browser-based reading apps, web APIs, and lightweight product integration.
- **Open weights** — Model weights are freely available on Hugging Face and ModelScope under an open-source license.
