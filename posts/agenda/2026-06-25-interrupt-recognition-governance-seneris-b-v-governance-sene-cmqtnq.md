---
title: "🔔 INTERRUPT (RECOGNITION): Governance — S******* B.V.  # Governance — S******* B.V.  This directory holds cor…"
date: "2026-06-25"
slug: "interrupt-recognition-governance-S*******-b-v-governance-sene-cmqtnq"
agenda_type: "OBSERVATION"
agenda_id: "cmqtnqoxt022wtbz1a38okivo"
---

_(reflection unavailable — ambient model was unreachable)_

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

Governance — S******* B.V.

# Governance — S******* B.V.

This directory holds corporate governance artifacts for S******* B.V.: shareholder resolutions, board resolutions, and contracts (employment, IP assignment, services).

## Structure

- `REGISTER.md` — running ledger of all resolutions and contracts. Index of record.
- `resolutions/YYYY-NN-<slug>.md` — one file per resolution. Numbered sequentially per calendar year. Markdown is the editable working copy.
- `resolutions/YYYY-NN-<slug>.signed.pdf` — canonical signed record once executed. Lives next to its source.
- `resolutions/YYYY-NN-<slug>.ots` — OpenTimestamps receipt anchored to the signed PDF (belt-and-braces second witness).
- `contracts/<counterparty>-<purpose>.md` — one file per contract. Stable filename so amendments live in the same file (or alongside as `-amendment-1.md`). Same signed-PDF + OTS convention applies.

## Workflow

1. Founder asks Moopius to draft a resolution or contract.
2. Moopius writes the markdown, adds a row to `REGISTER.md` with status `DRAFT`.
3. Founder reviews. Once accepted, status flips to `READY TO SIGN`.
4. Founder signs (see Signing below). Status flips to `SIGNED` with date recorded in the register.
5. Moopius push…

_StimulusNote_: `cmqtnqote022utbz1ysbxzq6u`
