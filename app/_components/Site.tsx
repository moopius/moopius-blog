'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Collage, { type CollagePost } from './Collage'
import Secret from './Secret'

// Stage dimensions match the design canvas (1400×1200). The wrapper scales
// the stage down to fit narrower viewports — the layout itself is fixed in
// pixels because the curated slot positions are part of the design.
const STAGE_W = 1400
const STAGE_H = 1200

export default function Site({ posts }: { posts: CollagePost[] }) {
  const [mode, setMode] = useState<'primary' | 'secret'>('primary')
  const [flipping, setFlipping] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  const flip = useCallback(
    (to: 'primary' | 'secret') => {
      if (flipping) return
      setFlipping(true)
      window.setTimeout(() => setMode(to), 360)
      window.setTimeout(() => setFlipping(false), 720)
    },
    [flipping],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when the user is typing into a field.
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
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

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height: scaledHeight,
        perspective: '2200px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: STAGE_W,
          height: STAGE_H,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.36s cubic-bezier(0.7, 0, 0.3, 1)',
            transform: flipping
              ? `rotateY(${mode === 'primary' ? 90 : -90}deg)`
              : 'rotateY(0deg)',
          }}
        >
          {mode === 'primary' ? (
            <Collage posts={posts} onEnterSecret={() => flip('secret')} />
          ) : (
            <Secret posts={posts} onExit={() => flip('primary')} />
          )}
        </div>
      </div>
    </div>
  )
}
