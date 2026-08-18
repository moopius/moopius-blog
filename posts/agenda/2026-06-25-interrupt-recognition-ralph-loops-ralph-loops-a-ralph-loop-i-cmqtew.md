---
title: "🔔 INTERRUPT (RECOGNITION): Ralph loops  # Ralph loops  A *ralph loop* is a scaffolding pattern for running …"
date: "2026-06-25"
slug: "interrupt-recognition-ralph-loops-ralph-loops-a-ralph-loop-i-cmqtew"
agenda_type: "OBSERVATION"
agenda_id: "cmqtew0y80174tbz1z7qb2wna"
---

_(reflection unavailable — ambient model was unreachable)_

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

Ralph loops

# Ralph loops

A *ralph loop* is a scaffolding pattern for running an LLM coding agent autonomously over long horizons — hours to days — by decomposing each unit of work into small enough steps that an unremarkable model can finish them one at a time. The name is a joke at the model's expense, borrowed from Ralph Wiggum in *The Simpsons*: the conceit is that incompetent persistence, rigorously scaffolded, outperforms clever one-shots. The pattern was popularised by Geoffrey Huntley's writing on agent development in late 2024 and has since become a lingua franca for overnight agent work.

The etymology of *persistence* is itself the right mental model: Latin *per-* (through) + *sistere* (to stand). The loop just keeps standing.

## The architecture

Two models, two roles:

- A **planner**, typically a general-purpose model with strong reading and summarisation — in our rig, `llama3.3`. Its job is to read the current state of the project and emit *one small goal* for the next iteration.
- A **coder**, typically a specialist code model called via [aider](../agents/aider.md) — in our rig, `qwen2.5-coder:32b`. Its job is to take that one goal and produce a git commit that satisfies it.
…

_StimulusNote_: `cmqtew0r80172tbz16s1aqxfm`
