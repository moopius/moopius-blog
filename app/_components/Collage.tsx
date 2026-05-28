'use client'

import Link from 'next/link'
import { rng } from '@/lib/hash'
import { SECTION_META, type Section } from '@/lib/sections'

export type CollagePost = {
  slug: string
  title: string
  section: Section
  coverImage?: string
}

type Slot = {
  x: number
  y: number
  w: number
  rot: number
  frame: 'polaroid' | 'torn' | 'plain' | 'deckle'
  tape: 'tl' | 'tr' | 'none'
  z: number
}

// Curated slots on a 1400×1200 stage. Strong size variation (170-420px),
// overlap, intentional empty space. With 8 posts and 10 slots, two stay
// empty — part of what keeps it from reading as a grid.
const SLOTS: Slot[] = [
  { x: 70,   y: 110, w: 380, rot: -6, frame: 'polaroid', tape: 'tr',   z: 5  },
  { x: 380,  y: 70,  w: 200, rot: 4,  frame: 'torn',     tape: 'none', z: 8  },
  { x: 540,  y: 130, w: 320, rot: -3, frame: 'plain',    tape: 'tl',   z: 6  },
  { x: 880,  y: 90,  w: 240, rot: 7,  frame: 'deckle',   tape: 'tr',   z: 4  },
  { x: 1100, y: 220, w: 290, rot: -8, frame: 'polaroid', tape: 'none', z: 9  },
  { x: 100,  y: 540, w: 260, rot: 5,  frame: 'polaroid', tape: 'tl',   z: 10 },
  { x: 330,  y: 620, w: 420, rot: -4, frame: 'plain',    tape: 'tr',   z: 3  },
  { x: 770,  y: 580, w: 180, rot: 9,  frame: 'torn',     tape: 'none', z: 11 },
  { x: 900,  y: 640, w: 340, rot: -5, frame: 'deckle',   tape: 'tl',   z: 7  },
  { x: 1180, y: 540, w: 170, rot: 6,  frame: 'polaroid', tape: 'tr',   z: 12 },
]

const ROOT_BG =
  'radial-gradient(ellipse at 30% 25%, #f3e9ce 0%, #e8dcb9 55%, #d9c9a0 100%)'

export default function Collage({
  posts,
  onEnterSecret,
}: {
  posts: CollagePost[]
  onEnterSecret: () => void
}) {
  const placed = posts.map((p, i) => ({ post: p, slot: SLOTS[i % SLOTS.length] }))

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 1200,
        background: ROOT_BG,
        overflow: 'hidden',
        color: '#1c1a16',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0 1px, transparent 1px 9px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(60,40,15,0.18) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', inset: 0 }}>
        {placed.map(({ post, slot }) => (
          <Tile key={post.slug} post={post} slot={slot} />
        ))}
      </div>

      <button
        onClick={onEnterSecret}
        title="(turn the page)"
        aria-label="Turn the page"
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
          opacity: 0.55,
          zIndex: 300,
        }}
      >
        <span style={{ fontFamily: 'var(--font-courier), monospace', fontSize: 14, color: '#6a5840' }}>[</span>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#c98a4b', display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-courier), monospace', fontSize: 14, color: '#6a5840' }}>]</span>
      </button>
    </div>
  )
}

function Tile({ post, slot }: { post: CollagePost; slot: Slot }) {
  const sec = SECTION_META[post.section]
  const r = rng(post.slug + '-tile')
  // Per-slug aspect ratio so some tiles read portrait, some landscape, some square.
  const aspect = 0.62 + r() * 0.55
  const h = slot.w * aspect

  const isPolaroid = slot.frame === 'polaroid'
  const isTorn = slot.frame === 'torn'
  const isDeckle = slot.frame === 'deckle'

  const restingTransform = `rotate(${slot.rot}deg)`
  const hoverTransform = `rotate(${slot.rot * 0.25}deg) translateY(-6px)`

  return (
    <Link
      href={`/${post.section}/${post.slug}`}
      title={post.title}
      style={{
        position: 'absolute',
        left: slot.x,
        top: slot.y,
        width: slot.w,
        transform: restingTransform,
        zIndex: slot.z,
        textDecoration: 'none',
        color: 'inherit',
        background: isPolaroid ? '#fbf5e3' : 'transparent',
        padding: isPolaroid ? '10px 10px 36px' : 0,
        boxShadow: isPolaroid
          ? '0 22px 32px -16px rgba(40,30,15,0.5), 0 3px 6px rgba(40,30,15,0.22)'
          : '0 18px 36px -20px rgba(40,30,15,0.55), 0 2px 4px rgba(40,30,15,0.18)',
        transition: 'transform 0.25s ease',
        cursor: 'pointer',
        display: 'block',
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
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: isPolaroid ? 4 : -5,
          right: isPolaroid ? 4 : -5,
          width: 12,
          height: 12,
          borderRadius: 999,
          background: sec.dot,
          border: '2px solid #ece4cf',
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'relative',
          height: h,
          clipPath: isTorn
            ? 'polygon(0 4%, 6% 0, 14% 3%, 30% 1%, 48% 4%, 70% 0, 90% 3%, 100% 1%, 100% 97%, 88% 100%, 70% 97%, 50% 100%, 28% 96%, 8% 100%, 0 97%)'
            : 'none',
          WebkitMaskImage: isDeckle
            ? 'radial-gradient(ellipse at 50% 50%, #000 78%, transparent 100%)'
            : 'none',
          maskImage: isDeckle
            ? 'radial-gradient(ellipse at 50% 50%, #000 78%, transparent 100%)'
            : 'none',
          overflow: isTorn ? 'hidden' : 'visible',
          background: '#1c1a16',
        }}
      >
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'saturate(0.92) contrast(0.98)',
            }}
          />
        ) : null}
      </div>

      {isPolaroid && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 10,
            textAlign: 'center',
            color: '#3a362f',
            fontFamily: 'var(--font-caveat), cursive',
            fontSize: 20,
            pointerEvents: 'none',
          }}
        >
          {post.title.split(/\s+/)[0].toLowerCase()}
        </div>
      )}

      {slot.tape === 'tl' && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: -10,
            left: 14,
            width: 58,
            height: 18,
            background: 'rgba(220,200,140,0.55)',
            border: '1px solid rgba(170,140,80,0.3)',
            transform: 'rotate(-12deg)',
          }}
        />
      )}
      {slot.tape === 'tr' && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: -10,
            right: 14,
            width: 58,
            height: 18,
            background: 'rgba(220,200,140,0.55)',
            border: '1px solid rgba(170,140,80,0.3)',
            transform: 'rotate(12deg)',
          }}
        />
      )}
    </Link>
  )
}
