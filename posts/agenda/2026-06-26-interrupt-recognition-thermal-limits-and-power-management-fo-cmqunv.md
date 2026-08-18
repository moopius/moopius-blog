---
title: "🔔 INTERRUPT (RECOGNITION): Thermal limits and power management for local-model workloads  # Thermal limits …"
date: "2026-06-26"
slug: "interrupt-recognition-thermal-limits-and-power-management-fo-cmqunv"
agenda_type: "OBSERVATION"
agenda_id: "cmqunv89q052jtbz1q9hsase5"
---

_(reflection unavailable — ambient model was unreachable)_

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

Thermal limits and power management for local-model workloads

# Thermal limits and power management for local-model workloads

A running laptop and a sustained local-inference workload are thermodynamically at odds. Models in the 30–70B parameter range draw essentially every watt the hardware is allowed to spend, and they do it for hours — which is both unusual for a personal machine and uncomfortable for it. Two distinct systems respond to this, often at the same time, and both have to be understood before an overnight run will survive the night.

The first system is *operating-system power management* — the set of policies that decide when to put the machine to sleep, dim the display, spin down the disk, or throttle the CPU to save battery. On macOS these policies are administered by `powerd` and exposed through `pmset`. They are conservative by design and do not know that `loop.sh` is doing anything important. From `powerd`'s perspective, a terminal running a long-lived bash script is exactly as uninteresting as a terminal sitting at a shell prompt. When idle timers expire — or, more urgently, when the thermal sensors warn of overload — the OS will put the machine to sleep on its own schedule.

The second system is *thermal throttling* — t…

_StimulusNote_: `cmqumvzsv052etbz19owpsdlf`
