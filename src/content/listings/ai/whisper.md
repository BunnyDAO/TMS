---
name: "Whisper"
slug: "whisper"
tagline: "OpenAI's open-source speech recognition model"
description: "Whisper is OpenAI's open-source automatic speech recognition model trained on 680,000 hours of multilingual audio. It provides highly accurate transcription and translation across 99 languages, making it the go-to solution for speech-to-text tasks."
category: "ai"
subcategory: "audio"
tags: ["speech-recognition", "transcription", "open-source", "multilingual", "openai"]
website: "https://github.com/openai/whisper"
github: "https://github.com/openai/whisper"
docs: "https://platform.openai.com/docs/guides/speech-to-text"
pricing: "open-source"
status: "stable"
dateAdded: 2026-01-15
featured: false
---

## Getting Started

1. Install Whisper locally via pip: `pip install openai-whisper`.
2. Transcribe an audio file from the command line: `whisper audio.mp3 --model medium`.
3. Choose from model sizes (tiny, base, small, medium, large) based on your accuracy and speed needs.
4. Alternatively, use the OpenAI API for cloud-based transcription without local GPU requirements.

## Key Features

- **99-language support** provides accurate transcription across nearly all widely spoken languages worldwide.
- **Multiple model sizes** from tiny (39M params) to large (1.5B params) for flexible accuracy vs. speed tradeoffs.
- **Automatic language detection** identifies the spoken language and transcribes without manual language selection.
- **Translation capability** translates speech from any supported language directly into English text.
- **Timestamp generation** produces word-level and segment-level timestamps for subtitle and caption creation.
- **Fully open-source** with MIT license, enabling unrestricted commercial use, modification, and self-hosting.
