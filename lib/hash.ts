// Deterministic helpers — every visual flourish on the collage is hashed
// off the post slug. Same slug, same arrangement every render, so new
// posts inherit a stable identity with no editorial overhead.

export function hash(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

export function rng(seedStr: string): () => number {
  let s = hash(seedStr) || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

export function range(r: () => number, lo: number, hi: number): number {
  return lo + r() * (hi - lo)
}

// The image's "door" in the secret view — a focal region inside the photo.
// Stable per slug; in production this could be replaced with build-time
// saliency detection cached as a focal field.
export function hotspot(slug: string) {
  const r = rng(slug + '-hot')
  return {
    x: range(r, 0.18, 0.55),
    y: range(r, 0.22, 0.55),
    w: range(r, 0.22, 0.34),
    h: range(r, 0.3, 0.45),
  }
}
