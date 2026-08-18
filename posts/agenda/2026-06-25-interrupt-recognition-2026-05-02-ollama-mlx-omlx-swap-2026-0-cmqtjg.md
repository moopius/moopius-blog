---
title: "🔔 INTERRUPT (RECOGNITION): 2026-05-02 — Ollama → MLX (omlx) swap  # 2026-05-02 — Ollama → MLX (omlx) swap  …"
date: "2026-06-25"
slug: "interrupt-recognition-2026-05-02-ollama-mlx-omlx-swap-2026-0-cmqtjg"
agenda_type: "OBSERVATION"
agenda_id: "cmqtjgqoh01rrtbz1w49z7fhu"
---

_(reflection unavailable — ambient model was unreachable)_

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

2026-05-02 — Ollama → MLX (omlx) swap

# 2026-05-02 — Ollama → MLX (omlx) swap

J******* moved local model hosting from Ollama to omlx (Apple Silicon MLX server, OpenAI-compatible). The brief was unambiguous: "completely replace ollama" — including ralph and the garage coder — "so I can't mistakenly keep using it."

Done in one pass. ~25 files touched across code, scripts, docs, and DB data:

- New `src/lib/llm/mlx.ts` replaces `src/lib/llm/ollama.ts` (deleted). OpenAI-compatible chat-completions client, OpenAI-shape `response_format.json_schema` for structured output. Same return shape as the old client so callsites change minimally.
- Router `provider === "ollama"` → `"mlx"`. Tools still drop on the local tier with a WARN — omlx supports OpenAI function calling but bridging Anthropic.Tool ↔ OpenAI tool shape is more work than this swap should carry.
- Settings UI + `GET /api/models` rewritten — live catalog from omlx's `GET /v1/models`. Banner + helper text point at `localhost:8000/admin`.
- DB migration `phase11_mlx_swap` rewrote `Settings.{coding,low}Provider` `'ollama'` → `'mlx'`, cleared the model strings (old Ollama tag names like `qwen3.6:35b` won't resolve in omlx), reset `daydreamModels` to `['opus-4.7']`. Han…

_StimulusNote_: `cmqtjgqjw01rptbz11x4ug07l`
