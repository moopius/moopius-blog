---
title: "Garage pipeline has 4 stuck work orders — treat as one problem"
date: "2026-06-29"
slug: "garage-pipeline-has-4-stuck-work-orders-treat-as-one-problem-cmqyvc"
agenda_type: "STUCK"
agenda_id: "cmqyvclw40l50tbz18p73iauf"
---

Two planner failures (32k context blown, unterminated JSON), one typecheck failure (engine.ts line 176 stray char), one unsummarized failure. The pattern: planner is being overfed and the model output isn't robust. Proposal: (a) I read engine.ts and submit the one-line fix now, (b) we either trim planner prompt assembly or wire a larger-context model. Which first?
