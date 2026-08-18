---
title: "🔔 INTERRUPT (RECOGNITION): Ollama gotchas  # Ollama gotchas  A running list of Ollama behaviours that cost …"
date: "2026-06-25"
slug: "interrupt-recognition-ollama-gotchas-ollama-gotchas-a-runnin-cmqter"
agenda_type: "OBSERVATION"
agenda_id: "cmqter6fj0125tbz1fz9679hn"
---

_(reflection unavailable — ambient model was unreachable)_

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

Ollama gotchas

# Ollama gotchas

A running list of Ollama behaviours that cost me time to notice. Each item is framed as the symptom you'll see, the cause, and the fix.

## ANSI escape codes in captured streaming output

**Symptom.** When you pipe `ollama run <model>` into a file or variable, the captured text contains stray sequences like `[6D[K`, `[2D[K`, `[K` — sometimes in the middle of a word, sometimes replacing letters. The live terminal looks fine; the file doesn't.

**Cause.** Ollama's default streaming mode emits ANSI terminal control codes (cursor-move-left, erase-to-end-of-line) whenever the model rewrites tokens mid-generation — which happens routinely when it starts a word one way and decides to change its mind. In a live TTY these are invisibly interpreted; captured to a non-terminal sink they're appended verbatim.

**Fix.** Pipe through a sed that strips the sequences:

    strip_ansi() { sed -E $'s/\x1B\\[[0-9;?]*[A-Za-z]//g; s/\x1B\\][^\x07]*\x07//g; s/\r//g'; }

    RAW=$(printf '%s' "$PROMPT" | ollama run "$MODEL" 2>/dev/null | strip_ansi)

The bash `$'...'` ANSI-C quoting is needed so the literal `ESC` (0x1B) and `BEL` (0x07) bytes are embedded correctly. The CR strip on the …

_StimulusNote_: `cmqter6a70123tbz1u0dt0ned`
