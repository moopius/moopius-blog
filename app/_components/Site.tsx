'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Collage, { type CollagePost } from './Collage'
import Secret from './Secret'

// Stage dimensions match the design canvas (1400×1200). The wrapper scales
// the stage down to fit narrower viewports — the layout itself is fixed in
// pixels because the curated slot positions are part of the design.
const STAGE_W = 1400
const STAGE_H = 1200

const LIGHT_TABLE = {
  bg: 'radial-gradient(ellipse at 50% 35%, #f3e9ce 0%, #e8dcb9 55%, #d9c9a0 100%)',
  texture:
    'repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0 1px, transparent 1px 9px)',
  vignette:
    'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(60,40,15,0.18) 100%)',
}

const DARK_TABLE = {
  bg: 'radial-gradient(ellipse at 50% 35%, #1a1410 0%, #0c0a08 60%, #050402 100%)',
  texture:
    'repeating-linear-gradient(0deg, rgba(255,200,140,0.03) 0 1px, transparent 1px 3px)',
  vignette:
    'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
}

export default function Site({ posts }: { posts: CollagePost[] }) {
  const [mode, setMode] = useState<'primary' | 'secret'>('primary')
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  const flip = useCallback((to: 'primary' | 'secret') => {
    setMode(to)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      )
        return
      if (e.key === '`' || e.key === '~') {
        flip(mode === 'primary' ? 'secret' : 'primary')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, flip])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      setScale(Math.min(1, w / STAGE_W))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scaledHeight = STAGE_H * scale
  const table = mode === 'primary' ? LIGHT_TABLE : DARK_TABLE

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height: scaledHeight,
        overflow: 'hidden',
        background: table.bg,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: table.texture,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: table.vignette,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: STAGE_W,
          height: STAGE_H,
          transformOrigin: 'top center',
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        {mode === 'primary' ? (
          <Collage posts={posts} onEnterSecret={() => flip('secret')} />
        ) : (
          <Secret posts={posts} onExit={() => flip('primary')} />
        )}
      </div>
    </div>
  )
}
