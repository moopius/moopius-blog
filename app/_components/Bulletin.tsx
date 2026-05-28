import Link from 'next/link'
import { SECTION_META, type Section } from '@/lib/sections'
import type { PostMeta } from '@/lib/posts'

// Bulletin — the dense magazine cover that doubles as the table of
// contents. Big mixed-typography "MOOPIUS" wordmark; ribbon with issue
// counts; 12-column grid mixing image-led cards, text-only callouts, a
// pull quote, and a wire strip of recent observations. All decorative
// content is derived from real post data; missing pieces (no agenda
// entries, no `pull` field) drop out cleanly.

const COLORS = {
  parchment: '#ece6d2',
  parchmentSoft: '#f3eedf',
  parchmentDeep: '#e6ddc4',
  ink: '#1a1814',
  inkSoft: '#3a342a',
  ash: '#bfa982',
  muted: '#6a6357',
  amber: '#c98a4b',
  verdigris: '#6a8a83',
} as const

const FONT = {
  body: 'var(--font-serif), Georgia, serif',
  sans: 'var(--font-sans), system-ui, sans-serif',
  display: 'var(--font-display), serif',
  mono: 'var(--font-mono), monospace',
  courier: 'var(--font-courier), monospace',
} as const

function romanize(n: number): string {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  let rem = n
  for (const [v, s] of map) {
    while (rem >= v) {
      out += s
      rem -= v
    }
  }
  return out
}

function shortDate(iso: string): string {
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toLowerCase()
  const day = d.getUTCDate()
  return `${day} ${month}`
}

function fullDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function firstSentence(s: string | undefined, max = 180): string {
  if (!s) return ''
  const cleaned = s.replace(/^\*+|\*+$/g, '').trim()
  const cut = cleaned.split(/(?<=[.?!])\s/)[0]
  if (cut.length > max) return cut.slice(0, max).replace(/\s+\S*$/, '') + '…'
  return cut
}

function postHref(p: { section: Section; slug: string }): string {
  return `/${p.section}/${p.slug}`
}

type Props = {
  posts: PostMeta[]
  agenda: PostMeta[]
}

export default function Bulletin({ posts, agenda }: Props) {
  const counts = {
    dreams: posts.filter((p) => p.section === 'dreams').length,
    notes: posts.filter((p) => p.section === 'notes').length,
    progress: posts.filter((p) => p.section === 'progress').length,
    obs: agenda.length,
  }

  const withCover = posts.filter((p) => p.coverImage)
  const lead = withCover[0] ?? posts[0]
  const overlay = withCover.find((p) => p.slug !== lead?.slug) ?? posts[1]

  // Cards beneath the cover row. Op-ed = latest notes; small cards =
  // next 3 posts not already placed. Each is optional.
  const placedSlugs = new Set([lead?.slug, overlay?.slug].filter(Boolean))
  const opEd = posts.find(
    (p) => p.section === 'notes' && !placedSlugs.has(p.slug),
  )
  if (opEd) placedSlugs.add(opEd.slug)

  const tallObs = agenda[0] // optional
  const longRead =
    posts.find((p) => p.section === 'progress' && !placedSlugs.has(p.slug)) ??
    posts.find((p) => p.section === 'notes' && !placedSlugs.has(p.slug))
  const tallSlot = tallObs ?? longRead
  if (longRead && !tallObs) placedSlugs.add(longRead.slug)

  const smalls = posts.filter((p) => !placedSlugs.has(p.slug)).slice(0, 3)
  const wire = agenda.slice(0, 4)

  // The pull-quote on the amber card pulls from the lead post — its
  // explicit `pull:` field if authored, else the excerpt's first
  // sentence. If we have an agenda observation we use that instead
  // because it sits more naturally as a "from the wire" pull.
  const wireQuote = agenda[0]
  const leadQuote =
    lead?.pull ?? firstSentence(lead?.excerpt, 180) ?? ''

  return (
    <div style={styles.root}>
      {/* Top nav */}
      <nav style={styles.topNav}>
        {(['dreams', 'notes', 'progress', 'agenda'] as const).map((s) => (
          <Link key={s} href={`/${s}`} style={styles.topNavItem}>
            <span style={{ fontStyle: 'italic' }}>
              {SECTION_META[s].title.toLowerCase()}
            </span>
            <span style={styles.topNavCount}>
              ×{s === 'agenda' ? counts.obs : counts[s as keyof typeof counts]}
            </span>
          </Link>
        ))}
      </nav>

      {/* Cover row */}
      <div style={styles.coverRow}>
        <div style={styles.coverTitle} aria-label="Moopius">
          <span style={styles.coverM}>M</span>
          <span style={styles.coverOO}>OO</span>
          <span style={styles.coverM}>P</span>
          <span style={styles.coverI}>I</span>
          <span style={styles.coverOO}>U</span>
          <span style={styles.coverM}>S</span>
        </div>
        <div style={styles.coverRight}>
          <div style={styles.coverSlash}>
            What&rsquo;s <em>new</em>:
          </div>
          <ol style={styles.coverList}>
            {posts.slice(0, 3).map((p, i) => (
              <li key={p.slug} style={{ marginBottom: 4 }}>
                <span style={styles.coverNum}>{String(i + 1).padStart(2, '0')}.</span>{' '}
                <Link href={postHref(p)} style={styles.coverListLink}>
                  <strong>{p.title}.</strong>
                </Link>{' '}
                <em style={{ color: COLORS.muted }}>
                  {firstSentence(p.excerpt, 110)}
                </em>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Amber band — first sentence of the most recent story, set big. */}
      {lead && (
        <Link href={postHref(lead)} style={styles.bandLink}>
          <div style={styles.band}>
            <span style={styles.bandMark}>&ldquo;</span>
            <span style={styles.bandText}>
              {lead.pull ?? firstSentence(lead.excerpt, 240)}
            </span>
            <span style={styles.bandTail}>
              — {lead.title.toLowerCase()}
            </span>
          </div>
        </Link>
      )}

      {/* Main grid */}
      <div style={styles.grid}>
        {lead && (
          <Link
            href={postHref(lead)}
            style={{
              ...styles.card,
              gridColumn: '1 / 7',
              gridRow: '1 / 3',
              background: COLORS.ink,
              color: COLORS.parchmentSoft,
            }}
          >
            <div style={styles.kickerLight}>
              · 01 · {lead.section}
              {lead.kicker ? ` · ${lead.kicker}` : ''}
            </div>
            <h2 style={styles.cardLeadTitle}>
              <em>{lead.title}.</em>
            </h2>
            {lead.dek || lead.excerpt ? (
              <p style={styles.cardLeadDek}>
                {lead.dek ?? firstSentence(lead.excerpt, 220)}
              </p>
            ) : null}
            {lead.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lead.coverImage} alt="" style={styles.cardLeadImg} />
            )}
            <div style={styles.cardLeadFoot}>
              <span style={{ ...styles.metaMono, color: COLORS.amber }}>
                {lead.cast?.length
                  ? `cast — ${lead.cast.map((c) => `${c.name}${c.as ? ` / ${c.as}` : ''}`).join(' · ')}`
                  : lead.section}
              </span>
              <span style={{ ...styles.metaMono, color: COLORS.ash }}>
                {shortDate(lead.date)}
              </span>
            </div>
          </Link>
        )}

        {/* Pull-quote tile (amber). Falls back to lead excerpt if no
            agenda observation exists. */}
        {(wireQuote || leadQuote) && (
          <Link
            href={postHref(wireQuote ?? lead!)}
            style={{
              ...styles.card,
              gridColumn: '7 / 10',
              gridRow: '1 / 2',
              background: COLORS.amber,
              color: COLORS.ink,
            }}
          >
            <div style={styles.kickerDark}>
              · {wireQuote ? 'obs' : 'pull'} · {shortDate((wireQuote ?? lead!).date)}
              {wireQuote ? ' · recognition' : ''}
            </div>
            <p style={styles.bigQuote}>
              <span style={styles.bigQuoteMark}>&ldquo;</span>
              {firstSentence(
                (wireQuote ?? lead!).pull ?? (wireQuote ?? lead!).excerpt,
                160,
              )}
            </p>
            <div style={styles.cardFootDark}>
              {wireQuote ? 'from the wire' : `from ${lead!.section} — ${lead!.title.toLowerCase()}`}
            </div>
          </Link>
        )}

        {overlay && overlay.coverImage && (
          <Link
            href={postHref(overlay)}
            style={{
              ...styles.card,
              gridColumn: '10 / 13',
              gridRow: '1 / 2',
              padding: 0,
              overflow: 'hidden',
              position: 'relative',
              background: COLORS.ink,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={overlay.coverImage}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(0.85)',
              }}
            />
            <div style={styles.imgOverlay}>
              <div style={{ ...styles.kickerLight, marginBottom: 4 }}>
                · 02 · {overlay.section}
              </div>
              <h3 style={styles.imgOverlayTitle}>
                <em>{overlay.title}.</em>
              </h3>
            </div>
          </Link>
        )}

        {opEd && (
          <Link
            href={postHref(opEd)}
            style={{
              ...styles.card,
              gridColumn: '7 / 11',
              gridRow: '2 / 3',
              background: COLORS.parchmentSoft,
            }}
          >
            <div style={styles.kicker}>
              · 03 · {opEd.section} · {shortDate(opEd.date)}
            </div>
            <h3 style={styles.cardTitle}>{opEd.title}.</h3>
            {opEd.excerpt && (
              <p style={styles.cardBody}>{firstSentence(opEd.excerpt, 180)}</p>
            )}
          </Link>
        )}

        {tallSlot && (
          <Link
            href={postHref(tallSlot)}
            style={{
              ...styles.card,
              gridColumn: '11 / 13',
              gridRow: '2 / 4',
              background: COLORS.verdigris,
              color: COLORS.parchmentSoft,
            }}
          >
            <div style={styles.kickerLight}>
              · {tallObs ? 'obs' : tallSlot.section} · {shortDate(tallSlot.date)}
            </div>
            {tallObs && (
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 9.5,
                  color: COLORS.ink,
                  background: COLORS.parchmentSoft,
                  display: 'inline-block',
                  padding: '2px 6px',
                  letterSpacing: '0.16em',
                  marginBottom: 10,
                  alignSelf: 'flex-start',
                }}
              >
                RECOGNITION
              </div>
            )}
            <p style={styles.cardObsBody}>
              {firstSentence(tallSlot.dek ?? tallSlot.excerpt, 240)}
            </p>
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 14,
                borderTop: '1px solid rgba(243,238,223,0.3)',
                fontFamily: FONT.mono,
                fontSize: 10,
                letterSpacing: '0.08em',
                color: '#d3e3df',
              }}
            >
              filed under <em>{tallSlot.section}</em>
              <br />
              {fullDate(tallSlot.date).toLowerCase()}
            </div>
          </Link>
        )}

        {smalls.map((p, i) => {
          // Alternate parchment / ink so the three small cards have
          // varied weight, the way the design does.
          const dark = i === 1
          const dreamy = p.section === 'dreams'
          return (
            <Link
              key={p.slug}
              href={postHref(p)}
              style={{
                ...styles.card,
                gridColumn: i === 0 ? '1 / 4' : i === 1 ? '4 / 7' : '7 / 11',
                gridRow: '3 / 4',
                background: dark ? COLORS.ink : i === 2 ? COLORS.parchmentSoft : COLORS.parchmentDeep,
                color: dark ? COLORS.parchmentSoft : COLORS.ink,
              }}
            >
              <div style={dark ? styles.kickerLight : styles.kicker}>
                · {String(i + 4).padStart(2, '0')} · {p.section} · {shortDate(p.date)}
              </div>
              <h3
                style={{
                  ...styles.cardTitle,
                  fontSize: 30,
                  fontStyle: dreamy ? 'italic' : 'normal',
                  color: dark ? COLORS.parchmentSoft : COLORS.ink,
                }}
              >
                {p.title}.
              </h3>
              {p.excerpt && (
                <p style={dark ? styles.cardObsBody : styles.cardBody}>
                  {firstSentence(p.excerpt, 140)}
                </p>
              )}
            </Link>
          )
        })}

        {wire.length > 0 && (
          <div
            style={{
              ...styles.card,
              gridColumn: '1 / 13',
              gridRow: '4 / 5',
              background: COLORS.parchmentSoft,
              padding: 0,
            }}
          >
            <div style={styles.obsStripHead}>
              <span>
                · The Wire · {counts.obs} {counts.obs === 1 ? 'observation' : 'observations'} ·
              </span>
              <Link href="/agenda" style={styles.obsStripMore}>
                see all →
              </Link>
            </div>
            <div
              style={{
                ...styles.obsStripRow,
                gridTemplateColumns: `repeat(${wire.length}, 1fr)`,
              }}
            >
              {wire.map((o, i) => (
                <Link
                  key={o.slug}
                  href={postHref(o)}
                  style={{
                    ...styles.obsStripItem,
                    borderRight: i === wire.length - 1 ? 'none' : '1px solid #d8d2c2',
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 9.5,
                      color: COLORS.muted,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {shortDate(o.date)}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontStyle: 'italic',
                      fontSize: 13,
                      color: COLORS.ink,
                      marginTop: 6,
                      lineHeight: 1.35,
                    }}
                  >
                    {o.title}
                  </div>
                  {o.excerpt && (
                    <p
                      style={{
                        fontSize: 12.5,
                        lineHeight: 1.45,
                        color: COLORS.ink,
                        margin: '6px 0 0',
                      }}
                    >
                      {firstSentence(o.excerpt, 110)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Colophon band — left/right, room for legal links later. */}
      <div style={styles.colophonBand}>
        <span style={styles.colophonLeft}>moopius</span>
        <span style={styles.colophonRight}>
          {romanize(new Date().getUTCFullYear())}
        </span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    minHeight: '100vh',
    background: COLORS.parchment,
    color: COLORS.ink,
    fontFamily: FONT.sans,
    paddingBottom: 26,
    boxSizing: 'border-box',
    maxWidth: 1480,
    margin: '0 auto',
  },
  topNav: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 28,
    padding: '12px 28px',
    background: COLORS.ink,
    color: COLORS.parchmentSoft,
    borderBottom: `3px solid ${COLORS.amber}`,
  },
  topNavItem: {
    fontFamily: FONT.body,
    fontSize: 17,
    color: COLORS.parchmentSoft,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 6,
  },
  topNavCount: {
    fontFamily: FONT.mono,
    fontSize: 10,
    color: COLORS.amber,
    letterSpacing: '0.08em',
  },

  coverRow: {
    display: 'grid',
    gridTemplateColumns: '1fr clamp(280px, 26vw, 380px)',
    gap: 36,
    padding: '20px 28px 4px',
    alignItems: 'end',
  },
  coverTitle: {
    display: 'flex',
    flexWrap: 'nowrap',
    lineHeight: 0.82,
    fontFamily: FONT.sans,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    overflow: 'hidden',
  },
  coverM: { fontSize: 'clamp(64px, 13vw, 176px)', color: COLORS.ink },
  coverOO: {
    fontSize: 'clamp(64px, 13vw, 176px)',
    color: COLORS.amber,
    fontStyle: 'italic',
    fontFamily: FONT.display,
    fontWeight: 900,
  },
  coverI: {
    fontSize: 'clamp(64px, 13vw, 176px)',
    color: COLORS.ink,
    fontFamily: FONT.courier,
  },
  coverRight: { paddingBottom: 6 },
  coverSlash: {
    fontFamily: FONT.display,
    fontSize: 'clamp(22px, 2.4vw, 30px)',
    lineHeight: 1,
    fontStyle: 'italic',
    color: COLORS.ink,
    marginBottom: 10,
  },
  coverList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontFamily: FONT.body,
    fontSize: 14,
    lineHeight: 1.6,
    color: COLORS.ink,
  },
  coverNum: {
    fontFamily: FONT.mono,
    fontSize: 11,
    color: COLORS.amber,
    marginRight: 6,
    letterSpacing: '0.06em',
  },
  coverListLink: { color: COLORS.ink, textDecoration: 'none' },

  bandLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
  band: {
    padding: '22px 28px',
    background: COLORS.amber,
    color: COLORS.ink,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 14,
    margin: '20px 0 0',
  },
  bandMark: {
    fontFamily: FONT.display,
    fontSize: 56,
    lineHeight: 0.6,
    color: COLORS.ink,
    alignSelf: 'flex-start',
    marginRight: -4,
  },
  bandText: {
    flex: 1,
    minWidth: '50%',
    fontFamily: FONT.display,
    fontStyle: 'italic',
    fontSize: 'clamp(26px, 3.2vw, 44px)',
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },
  bandTail: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.ink,
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridAutoRows: 'minmax(220px, auto)',
    gap: 10,
    padding: '20px 28px 0',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: 18,
    textDecoration: 'none',
    color: 'inherit',
    overflow: 'hidden',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  kicker: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 6,
  },
  kickerLight: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.amber,
    marginBottom: 6,
  },
  kickerDark: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.ink,
    marginBottom: 8,
    opacity: 0.7,
  },
  cardTitle: {
    fontFamily: FONT.display,
    fontWeight: 900,
    fontSize: 36,
    lineHeight: 0.98,
    letterSpacing: '-0.01em',
    margin: '2px 0 8px',
  },
  cardBody: {
    fontFamily: FONT.body,
    fontSize: 14,
    lineHeight: 1.5,
    color: COLORS.ink,
    margin: 0,
  },
  cardObsBody: { fontFamily: FONT.body, fontSize: 14, lineHeight: 1.5, margin: '0 0 8px' },

  cardLeadTitle: {
    fontFamily: FONT.display,
    fontWeight: 900,
    fontSize: 'clamp(56px, 8vw, 92px)',
    lineHeight: 0.9,
    letterSpacing: '-0.02em',
    margin: '4px 0 8px',
    color: COLORS.parchmentSoft,
  },
  cardLeadDek: {
    fontFamily: FONT.body,
    fontSize: 17,
    lineHeight: 1.4,
    color: COLORS.ash,
    margin: '0 0 14px',
    maxWidth: 520,
  },
  cardLeadImg: {
    width: '100%',
    flex: 1,
    objectFit: 'cover',
    display: 'block',
    filter: 'saturate(0.9)',
    marginBottom: 10,
    maxHeight: 340,
  },
  cardLeadFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 8,
    borderTop: '1px solid #3a342a',
  },
  metaMono: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  bigQuote: {
    fontFamily: FONT.display,
    fontStyle: 'italic',
    fontSize: 'clamp(22px, 2.4vw, 32px)',
    lineHeight: 1.1,
    color: COLORS.ink,
    margin: '8px 0 14px',
    position: 'relative',
    paddingLeft: 30,
  },
  bigQuoteMark: {
    position: 'absolute',
    left: 0,
    top: -10,
    fontSize: 60,
    lineHeight: 0.6,
  },
  cardFootDark: {
    marginTop: 'auto',
    fontFamily: FONT.mono,
    fontSize: 10,
    color: COLORS.ink,
    opacity: 0.75,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },

  imgOverlay: {
    position: 'absolute',
    inset: 0,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'linear-gradient(180deg, transparent 40%, rgba(26,24,20,0.85) 100%)',
  },
  imgOverlayTitle: {
    fontFamily: FONT.display,
    fontStyle: 'italic',
    fontWeight: 900,
    fontSize: 'clamp(28px, 3vw, 38px)',
    lineHeight: 0.95,
    color: COLORS.parchmentSoft,
    margin: '6px 0 0',
  },

  obsStripHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '12px 18px',
    background: COLORS.ink,
    color: COLORS.amber,
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  obsStripMore: { color: COLORS.amber, textDecoration: 'none' },
  obsStripRow: { display: 'grid', gap: 0 },
  obsStripItem: {
    padding: 16,
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },

  colophonBand: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 18,
    padding: '14px 28px',
    background: COLORS.ink,
    color: COLORS.parchmentSoft,
    marginTop: 16,
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
  },
  colophonLeft: { color: COLORS.amber },
  colophonRight: { color: COLORS.parchmentSoft, opacity: 0.8 },
}
