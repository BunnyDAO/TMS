---
name: "Transformers"
slug: "huggingface-transformers"
tagline: "Open-source library for state-of-the-art ML models across text, vision, and audio"
description: "Hugging Face Transformers is the de facto standard Python library for loading, running, and fine-tuning thousands of pretrained machine learning models. It supports text, vision, audio, and multimodal tasks with backends for PyTorch, TensorFlow, and JAX. With a unified API and tight integration with the Hugging Face Hub, it lets developers go from model discovery to inference in just a few lines of code."
category: "ai"
subcategory: "local-ai"
tags: ["ai", "llm", "machine-learning", "open-source", "huggingface", "inference", "fine-tuning", "python"]
website: "https://huggingface.co/docs/transformers"
github: "https://github.com/huggingface/transformers"
docs: "https://huggingface.co/docs/transformers/index"
pricing: "open-source"
status: "new"
dateAdded: 2026-02-19
featured: false
---

## Getting Started

1. **Install the library** — Run `pip install transformers` (add `torch`, `tensorflow`, or `jax` as your preferred backend).
2. **Pick a model** — Browse the [Hugging Face Hub](https://huggingface.co/models) for a pretrained model suited to your task.
3. **Run inference** — Use the `pipeline()` API for one-liner inference: `from transformers import pipeline; pipe = pipeline('text-generation', model='gpt2'); pipe('Hello, world')`.
4. **Fine-tune or train** — Use the `Trainer` API or integrate with PyTorch/TensorFlow training loops to adapt models to your own data.

## Key Features

- **Unified Model API** — A consistent interface across thousands of architectures including BERT, LLaMA, Whisper, CLIP, and more.
- **Multi-framework support** — Works with PyTorch, TensorFlow, and JAX, with model weight interoperability between them.
- **Pipeline abstraction** — High-level `pipeline()` helper covers common tasks like text generation, classification, translation, image captioning, and speech recognition.
- **Hugging Face Hub integration** — Load any public or private model checkpoint directly with a model name string; no manual downloads required.
- **Trainer API** — Built-in training loop with support for mixed precision, gradient accumulation, and distributed training.
- **Active ecosystem** — Backed by a large open-source community and compatible with libraries like PEFT, Accelerate, and Datasets.
