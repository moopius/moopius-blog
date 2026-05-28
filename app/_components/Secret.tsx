'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { rng, hotspot } from '@/lib/hash'
import { SECTION_META } from '@/lib/sections'
import type { CollagePost } from './Collage'

type Slot = { x: number; y: number; w: number; rot: number; z: number }

// Mirrors the primary's pile in spirit. No frames, no tape — photos lifted
// off the table.
const SLOTS: Slot[] = [
  { x: 80,   y: 130, w: 380, rot: -3, z: 5  },
  { x: 400,  y: 110, w: 200, rot: 2,  z: 8  },
  { x: 560,  y: 170, w: 320, rot: -2, z: 6  },
  { x: 900,  y: 130, w: 250, rot: 4,  z: 4  },
  { x: 1110, y: 260, w: 280, rot: -5, z: 9  },
  { x: 110,  y: 580, w: 260, rot: 3,  z: 10 },
  { x: 350,  y: 660, w: 420, rot: -2, z: 3  },
  { x: 790,  y: 620, w: 180, rot: 5,  z: 11 },
  { x: 920,  y: 680, w: 340, rot: -3, z: 7  },
  { x: 1200, y: 580, w: 170, rot: 3,  z: 12 },
]

export default function Secret({
  posts,
  onExit,
}: {
  posts: CollagePost[]
  onExit: () => void
}) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?') setRevealed((r) => !r)
      if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  const placed = posts.map((p, i) => ({ post: p, slot: SLOTS[i % SLOTS.length] }))

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 1200,
        background:
          'radial-gradient(ellipse at 35% 30%, #1a1410 0%, #0c0a08 60%, #050402 100%)',
        overflow: 'hidden',
        color: '#e5d9c3',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(255,200,140,0.03) 0 1px, transparent 1px 3px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', inset: 0 }}>
        {placed.map(({ post, slot }) => (
          <SecretTile
            key={post.slug}
            post={post}
            slot={slot}
            revealed={revealed}
          />
        ))}
      </div>

      <button
        onClick={onExit}
        title="(back to the zine)"
        aria-label="Back to the zine"
        style={{
          position: 'absolute',
          right: 24,
          bottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          opacity: 0.7,
          zIndex: 300,
        }}
      >
        <span style={{ fontFamily: 'var(--font-courier), monospace', fontSize: 14, color: '#c98a4b' }}>[</span>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#c98a4b', display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-courier), monospace', fontSize: 14, color: '#c98a4b' }}>]</span>
      </button>

      <div
        style={{
          position: 'absolute',
          left: 24,
          bottom: 22,
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          color: '#5a4d3f',
          letterSpacing: '0.04em',
          zIndex: 300,
        }}
      >
        <kbd style={kbdStyle}>?</kbd> reveal &nbsp; <kbd style={kbdStyle}>esc</kbd> return
      </div>
    </div>
  )
}

const kbdStyle = {
  background: '#1f1a14',
  color: '#c98a4b',
  padding: '1px 5px',
  border: '1px solid #3a3025',
  fontFamily: 'inherit',
  fontSize: 10,
} as const

function SecretTile({
  post,
  slot,
  revealed,
}: {
  post: CollagePost
  slot: Slot
  revealed: boolean
}) {
  const sec = SECTION_META[post.section]
  const r = rng(post.slug + '-stile')
  const aspect = 0.62 + r() * 0.55
  const h = slot.w * aspect
  const hot = hotspot(post.slug)
  const restingTransform = `rotate(${slot.rot}deg)`
  const hoverTransform = `rotate(${slot.rot * 0.25}deg) translateY(-4px)`

  return (
    <div
      style={{
        position: 'absolute',
        left: slot.x,
        top: slot.y,
        width: slot.w,
        height: h,
        transform: restingTransform,
        zIndex: slot.z,
        overflow: 'hidden',
        boxShadow:
          '0 18px 36px -18px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.4)',
        transition: 'transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = hoverTransform
        e.currentTarget.style.zIndex = '100'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = restingTransform
        e.currentTarget.style.zIndex = String(slot.z)
      }}
    >
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'saturate(0.78) brightness(0.86)',
            display: 'block',
          }}
        />
      )}

      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 12,
          height: 12,
          borderRadius: 999,
          background: sec.dot,
          border: '2px solid rgba(12,10,8,0.85)',
          zIndex: 3,
        }}
      />

      <Link
        href={`/${post.section}/${post.slug}`}
        title={post.title}
        aria-label={post.title}
        style={{
          position: 'absolute',
          left: `${hot.x * 100}%`,
          top: `${hot.y * 100}%`,
          width: `${hot.w * 100}%`,
          height: `${hot.h * 100}%`,
          cursor: 'crosshair',
          outline: revealed ? '1.5px dashed #c98a4b' : 'none',
          background: revealed ? 'rgba(201,138,75,0.15)' : 'transparent',
        }}
      />
    </div>
  )
}
