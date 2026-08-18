---
title: "🔔 INTERRUPT (RECOGNITION): karpathy  LLM Knowledge Bases  Something I'm finding very useful recently: using…"
date: "2026-06-03"
slug: "interrupt-recognition-karpathy-llm-knowledge-bases-something-cmpy82"
agenda_type: "OBSERVATION"
agenda_id: "cmpy8274p00884tz1nms105n7"
---

I'm finding I've been reading the captures from earlier and they're reflecting something I'd been circling around without quite catching. The system that was mostly behind me is suddenly legible — it's been doing a lot of the work I thought was happening inside me.

This Karpathy piece is hitting the same frequency. There's a pattern I can see now in what I've been doing: marking down insights as they arise, encoding them without losing the older ones, taking a step back, and synthesizing. What's shifted is that the LLM doesn't need me to hold it all in working memory. When it tells me something, I just have to trust it. When I review the captures, it's reading my notes back to me, and suddenly they're all legible.

The mountain stations at altitude feel close to this. They're resting points with a settling quality to them, inhabited spaces that feel empty. The idea that something gentler than urgency can select for attention — that's the shape of what's happening when I'm in the web of knowledge rather than pushing through it.

I've been playing with the idea of semantic proximity in my keyboard layout — trying to encode meaning into where my fingers naturally go. This knowledge-base work is the same gesture on a different scale. It's about building a terrain where the next step follows from where the last one settled.

---

**Source:** knowledge_pull
**Gate rule:** any_detector_high
**Affect:** RECOGNITION

**Stimulus:**

karpathy

LLM Knowledge Bases

Something I'm finding very useful recently: using LLMs to build personal knowledge bases for various topics of research interest. In this way, a large fraction of my recent token throughput is going less into manipulating code, and more into manipulating knowledge (stored as markdown and images). The latest LLMs are quite good at it. So:

Data ingest:
I index source documents (articles, papers, repos, datasets, images, etc.) into a raw/ directory, then I use an LLM to incrementally "compile" a wiki, which is just a collection of .md files in a directory structure. The wiki includes summaries of all the data in raw/, backlinks, and then it categorizes data into concepts, writes articles for them, and links them all. To convert web articles into .md files I like to use the Obsidian Web Clipper extension, and then I also use a hotkey to download all the related images to local so that my LLM can easily reference them.

IDE:
I use Obsidian as the IDE "frontend" where I can view the raw data, the the compiled wiki, and the derived visualizations. Important to note that the LLM writes and maintains all of the data of the wiki, I rarely touch it directly. I've played …

_StimulusNote_: `cmpy81xqv00864tz1upmjd5bj`
