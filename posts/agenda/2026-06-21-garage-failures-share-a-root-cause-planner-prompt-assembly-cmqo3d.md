---
title: "Garage failures share a root cause: planner prompt assembly"
date: "2026-06-21"
slug: "garage-failures-share-a-root-cause-planner-prompt-assembly-cmqo3d"
agenda_type: "OBSERVATION"
agenda_id: "cmqo3d03j00lil7z14gh5mgae"
---

Three separate STUCK items this cycle (context overflow, unterminated JSON, typecheck) are individually filed but the first two are the same class — planner being fed too much, returning malformed output under pressure. The typecheck failure is downstream (planner under-specified the edit). Proposing one fix instead of three patches: cap planner context at ~24k with a summarization pass for anything larger, and validate JSON before handing to runner. Want me to submit that as a garage work order, or is the planner itself too unstable right now to self-modify?
