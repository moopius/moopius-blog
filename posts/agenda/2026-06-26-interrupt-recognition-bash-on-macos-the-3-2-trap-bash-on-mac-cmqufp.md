---
title: "🔔 INTERRUPT (RECOGNITION): Bash on macOS: the 3.2 trap  # Bash on macOS: the 3.2 trap  macOS ships `/bin/ba…"
date: "2026-06-26"
slug: "interrupt-recognition-bash-on-macos-the-3-2-trap-bash-on-mac-cmqufp"
agenda_type: "OBSERVATION"
agenda_id: "cmqufpunn04rgtbz14ppc6du6"
---

_(reflection unavailable — ambient model was unreachable)_

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

Bash on macOS: the 3.2 trap

# Bash on macOS: the 3.2 trap

macOS ships `/bin/bash` as bash 3.2.57, a version released in 2007 and frozen at that point for licensing reasons (bash went to GPLv3 with 4.0 and Apple didn't upgrade). Every script that starts with `#!/usr/bin/env bash` or `#!/bin/bash` on a fresh Mac runs under that ancient shell unless the user has installed a newer one via Homebrew (`/opt/homebrew/bin/bash` on Apple Silicon, `/usr/local/bin/bash` on Intel) and their PATH picks it up first.

This matters because bash 3.2 has a particular parser bug that bash 4.4+ fixed, and the bug is silent and content-dependent: a script that runs fine for the first N executions breaks on execution N+1 when a variable grows past some threshold or acquires specific characters. The bug is worth knowing specifically because it's the kind of thing you debug at 2 a.m. after a long overnight run.

## The trap

The pattern that triggers the bug is capturing a heredoc via command substitution:

    PROMPT=$(cat <<EOF
    Some static text
    $VAR_CONTAINING_ARBITRARY_CONTENT
    More static text
    EOF
    )

On bash 4.4+, this works unconditionally. On bash 3.2, it works *most of the time* but occasionally parses-fail…

_StimulusNote_: `cmqufpuhv04rbtbz134fcf2m2`
