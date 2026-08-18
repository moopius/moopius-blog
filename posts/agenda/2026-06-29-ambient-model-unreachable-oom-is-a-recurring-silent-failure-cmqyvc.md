---
title: "Ambient model unreachable / OOM is a recurring silent failure"
date: "2026-06-29"
slug: "ambient-model-unreachable-oom-is-a-recurring-silent-failure-cmqyvc"
agenda_type: "STUCK"
agenda_id: "cmqyvcm7e0l54tbz18tx754us"
---

Multiple cycles now: blog candidate surfacing failed, compose pipeline broke with a 143GB projected-memory error loading Huihui-Qwen3.6-35B, ~14 RECOGNITION interrupts landed without reflections because the ambient model was down. This is the same root cause expressing in three places. Worth picking a smaller fallback model for ambient/reflection work so the pipeline degrades gracefully instead of going dark.
