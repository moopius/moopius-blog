import Link from 'next/link'
import { SECTION_META, type Section } from '@/lib/sections'
import type { MarginaliaCard, Post, PostMeta } from '@/lib/posts'

// BulletinPost — what a post looks like when the front is Bulletin.
// The body is the centre; doors surround it at multiple scales. Most
// design flourishes are authored opt-in via frontmatter (dek, cast,
// threads, pull, marginalia). When a flourish has no data, its slot
// drops out cleanly.

const COLORS = {
  parchment: '#ece6d2',
  parchmentSoft: '#f3eedf',
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
  caveat: 'var(--font-caveat), cursive',
} as const

function shortDate(iso: string): string {
  const d = new Date(iso)
  const month = d
    .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    .toLowerCase()
  return `${d.getUTCDate()} ${month}`
}
function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
function firstSentence(s: string | undefined, max = 200): string {
  if (!s) return ''
  const cleaned = s.replace(/^\*+|\*+$/g, '').trim()
  const cut = cleaned.split(/(?<=[.?!])\s/)[0]
  if (cut.length > max) return cut.slice(0, max).replace(/\s+\S*$/, '') + '…'
  return cut
}

function postHref(p: { section: Section; slug: string }): string {
  return `/${p.section}/${p.slug}`
}

// Split rendered HTML roughly in half between </p> tags so we can insert
// a mid-body editor's break. Returns a single piece if there aren't
// enough paragraphs to be worth splitting.
function splitBody(html: string): [string, string | null] {
  const parts = html.split(/(?<=<\/p>)/)
  if (parts.length < 5) return [html, null]
  const mid = Math.floor(parts.length / 2)
  return [parts.slice(0, mid).join(''), parts.slice(mid).join('')]
}

type Props = {
  post: Post
  allPosts: PostMeta[] // for related/surprise/next-in-cycle
  agenda: PostMeta[]
}

export default function BulletinPost({ post, allPosts, agenda }: Props) {
  const sectionMeta = SECTION_META[post.section]

  const sameSection = allPosts.filter(
    (p) => p.section === post.section && p.slug !== post.slug,
  )
  // chronologically next post overall (newer) and previous (older)
  const sortedByDate = [...allPosts].sort((a, b) => (a.date < b.date ? 1 : -1))
  const ix = sortedByDate.findIndex((p) => p.slug === post.slug)
  const nextPost = ix > 0 ? sortedByDate[ix - 1] : null
  const prevPost = ix >= 0 ? sortedByDate[ix + 1] : null

  // "Next in cycle" — newer in same section, else newer overall.
  const nextInCycle =
    sameSection.find((p) => p.date > post.date) ?? nextPost ?? prevPost

  // "Same section" — older in same section, else any same-section post.
  const sameSectionDoor =
    sameSection.find((p) => p.date < post.date) ?? sameSection[0]

  // "Surprise me" — deterministic per-render choice (slug-seeded) so
  // SSG output is stable but distinct per post.
  const others = allPosts.filter((p) => p.slug !== post.slug)
  const surprise =
    others.length > 0
      ? others[
          Math.abs(
            [...post.slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0),
          ) % others.length
        ]
      : null

  // Editor's break — pick an older same-section post different from the
  // "Same section" footer card if possible.
  const editorBreakPost =
    sameSection.find(
      (p) => p.slug !== sameSectionDoor?.slug && p.slug !== nextInCycle?.slug,
    ) ??
    sameSection.find((p) => p.slug !== nextInCycle?.slug) ??
    nextInCycle

  const [bodyHead, bodyTail] = splitBody(post.contentHtml)
  const useEditorsBreak = !!(bodyTail && editorBreakPost)

  const kicker =
    post.kicker ??
    `· ${post.section} · ${shortDate(post.date)}`

  const dek = post.dek ?? firstSentence(post.excerpt, 220)

  // Year — used for issue label in the footer.
  const year = new Date(post.date).getUTCFullYear()

  // Marginalia: authored cards first; fall back to a tiny set derived
  // from real data. Don't fabricate stimuli or wire entries that don't
  // exist.
  const authoredMarginalia = post.marginalia ?? []
  const fallbackMarginalia: MarginaliaCard[] = []
  if (authoredMarginalia.length === 0) {
    fallbackMarginalia.push({
      kind: 'note',
      label: 'FILED UNDER',
      title: sectionMeta.title,
      body: sectionMeta.tagline,
      meta: longDate(post.date).toLowerCase(),
      link: `/${post.section}`,
      more: `→ more in ${sectionMeta.title.toLowerCase()}`,
    })
    if (agenda[0]) {
      fallbackMarginalia.push({
        kind: 'wire',
        label: 'FROM THE WIRE',
        title: `"${firstSentence(agenda[0].excerpt, 120)}"`,
        meta: shortDate(agenda[0].date),
        link: postHref(agenda[0]),
        more: `→ ${agenda.length} more on the wire`,
      })
    } else if (sameSectionDoor) {
      fallbackMarginalia.push({
        kind: 'aside',
        label: 'NEARBY',
        title: sameSectionDoor.title,
        body: firstSentence(sameSectionDoor.excerpt, 140),
        meta: shortDate(sameSectionDoor.date),
        link: postHref(sameSectionDoor),
        more: '→ read alongside',
      })
    }
  }
  const marginalia = [...authoredMarginalia, ...fallbackMarginalia]

  return (
    <div style={styles.root}>
      {/* Ribbon */}
      <div style={styles.ribbon}>
        <Link href="/" style={styles.ribbonHome}>
          ← MOOPIUS
        </Link>
        <span style={styles.ribbonSep}>·</span>
        <Link href={`/${post.section}`} style={styles.ribbonItem}>
          {post.section.toUpperCase()}
        </Link>
        <span style={styles.ribbonSep}>·</span>
        <span style={{ ...styles.ribbonItem, color: COLORS.parchmentSoft }}>
          {post.title.toUpperCase()}
        </span>
        <span style={{ ...styles.ribbonItem, marginLeft: 'auto', opacity: 0.7 }}>
          {longDate(post.date).toLowerCase()}
        </span>
      </div>

      {/* Cover */}
      <header style={styles.cover}>
        <div style={styles.kicker}>{kicker}</div>
        <h1 style={styles.title}>
          <em>{post.title}.</em>
        </h1>
        {dek && <div style={styles.dek}>{dek}</div>}
        <div style={styles.byline}>
          <span>{longDate(post.date).toLowerCase()}</span>
          <span style={styles.bylineDot}>·</span>
          <span>filed under <em>{post.section}</em></span>
          {post.cast?.length ? (
            <>
              <span style={styles.bylineDot}>·</span>
              <span>
                cast — {post.cast.map((c) => c.name).join(' & ')}
              </span>
            </>
          ) : null}
        </div>
      </header>

      {/* Thread chips */}
      {post.threads && post.threads.length > 0 && (
        <div style={styles.threadStrip}>
          <span style={styles.threadStripLabel}>· filed under threads ·</span>
          {post.threads.map((t, i) => {
            const variants = [
              { background: COLORS.amber, color: COLORS.ink },
              { background: COLORS.ink, color: COLORS.parchmentSoft },
              { background: COLORS.verdigris, color: COLORS.parchmentSoft },
              {
                background: 'transparent',
                color: COLORS.ink,
                border: `1px solid ${COLORS.ink}`,
              },
            ]
            const v = variants[i % variants.length]
            return (
              <span key={t.name} style={{ ...styles.threadChip, ...v }}>
                <span style={{ fontStyle: 'italic' }}>{t.name}</span>
                {t.count != null && (
                  <span
                    style={{
                      ...styles.chipCount,
                      color: v.color === COLORS.ink ? COLORS.muted : COLORS.amber,
                    }}
                  >
                    ×{t.count}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      )}

      {/* Hero row */}
      {post.coverImage && (
        <div
          style={{
            ...styles.heroRow,
            gridTemplateColumns: post.cast?.length ? '1fr 280px' : '1fr',
          }}
        >
          <figure style={styles.heroFig}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" style={styles.heroImg} />
            <figcaption style={styles.heroCap}>
              <strong>Fig. 01 —</strong> <em>{post.title}.</em>{' '}
              {sectionMeta.tagline}
            </figcaption>
          </figure>
          {post.cast?.length ? (
            <aside style={styles.castCard}>
              <div style={styles.castLabel}>CAST</div>
              {post.cast.map((c) => (
                <div key={c.name} style={styles.castRow}>
                  <div style={styles.castName}>{c.name}</div>
                  {c.as && <div style={styles.castAs}>as</div>}
                  {c.as && <span style={styles.castRole}>{c.as}</span>}
                  {!c.as && c.role && (
                    <span style={styles.castRole}>{c.role}</span>
                  )}
                </div>
              ))}
              <div style={styles.castDivider} />
              <div style={styles.castNote}>{sectionMeta.tagline}</div>
            </aside>
          ) : null}
        </div>
      )}

      {/* Body + marginalia */}
      <div
        style={{
          ...styles.bodyRow,
          gridTemplateColumns: marginalia.length ? '1fr 280px' : '1fr',
        }}
      >
        <article style={styles.body}>
          <div
            className="bulletin-body"
            dangerouslySetInnerHTML={{ __html: bodyHead }}
          />
          {useEditorsBreak && editorBreakPost && (
            <Link href={postHref(editorBreakPost)} style={styles.editorsBreak}>
              <div style={styles.ebLabel}>· FILED ALONGSIDE ·</div>
              <div
                style={{
                  ...styles.ebRow,
                  gridTemplateColumns: editorBreakPost.coverImage
                    ? '140px 1fr'
                    : '1fr',
                }}
              >
                {editorBreakPost.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={editorBreakPost.coverImage}
                    alt=""
                    style={styles.ebImg}
                  />
                )}
                <div>
                  <div style={styles.ebKicker}>
                    {editorBreakPost.section} · {shortDate(editorBreakPost.date)}
                  </div>
                  <div style={styles.ebTitle}>
                    <em>{editorBreakPost.title}.</em>
                  </div>
                  {editorBreakPost.excerpt && (
                    <div style={styles.ebDek}>
                      {firstSentence(editorBreakPost.excerpt, 180)}
                    </div>
                  )}
                  <div style={styles.ebMore}>read alongside →</div>
                </div>
              </div>
            </Link>
          )}
          {bodyTail && (
            <div
              className="bulletin-body"
              dangerouslySetInnerHTML={{ __html: bodyTail }}
            />
          )}
        </article>

        {marginalia.length > 0 && (
          <aside style={styles.margin}>
            {marginalia.map((m, i) => (
              <MarginaliaItem key={i} card={m} />
            ))}
          </aside>
        )}
      </div>

      {/* Pull-quote band */}
      {post.pull && (
        <div style={styles.pullBand}>
          <div style={styles.pullBandMark}>&ldquo;</div>
          <blockquote style={styles.pullBandText}>{post.pull}</blockquote>
          {post.pullAttribution && (
            <div style={styles.pullBandAttr}>— {post.pullAttribution}</div>
          )}
        </div>
      )}

      {/* Footer "Choose a door" */}
      <footer style={styles.foot}>
        <div style={styles.footLead}>
          <div style={styles.footLeadKicker}>· what to do with this ·</div>
          <h3 style={styles.footLeadTitle}>
            <em>Choose a door.</em>
          </h3>
        </div>

        <div style={styles.footGrid}>
          {nextInCycle && (
            <Link
              href={postHref(nextInCycle)}
              style={{
                ...styles.footCard,
                background: COLORS.ink,
                color: COLORS.parchmentSoft,
              }}
            >
              <div style={{ ...styles.footCardKicker, color: COLORS.amber }}>
                NEXT IN CYCLE →
              </div>
              {nextInCycle.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={nextInCycle.coverImage}
                  alt=""
                  style={styles.footImg}
                />
              )}
              <div style={styles.footCardTitle}>
                <em>{nextInCycle.title}.</em>
              </div>
              {nextInCycle.excerpt && (
                <div style={{ ...styles.footCardDek, color: COLORS.ash }}>
                  {firstSentence(nextInCycle.excerpt, 130)}
                </div>
              )}
              <div style={styles.footCardMeta}>
                {nextInCycle.section} · {shortDate(nextInCycle.date)}
              </div>
            </Link>
          )}

          {sameSectionDoor && (
            <Link
              href={postHref(sameSectionDoor)}
              style={{
                ...styles.footCard,
                background: COLORS.parchmentSoft,
                color: COLORS.ink,
              }}
            >
              <div style={styles.footCardKicker}>
                MORE FROM {post.section.toUpperCase()}
              </div>
              {sameSectionDoor.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sameSectionDoor.coverImage}
                  alt=""
                  style={styles.footImg}
                />
              )}
              <div style={styles.footCardTitle}>{sameSectionDoor.title}.</div>
              {sameSectionDoor.excerpt && (
                <div style={styles.footCardDek}>
                  {firstSentence(sameSectionDoor.excerpt, 130)}
                </div>
              )}
              <div style={styles.footCardMeta}>
                {sameSectionDoor.section} · {shortDate(sameSectionDoor.date)}
              </div>
            </Link>
          )}

          <Link
            href="/agenda"
            style={{
              ...styles.footCard,
              background: COLORS.amber,
              color: COLORS.ink,
            }}
          >
            <div style={styles.footCardKicker}>
              {agenda.length > 0 ? 'THE WIRE THIS WEEK' : 'THE WIRE'}
            </div>
            <div style={styles.wireCount}>{agenda.length}</div>
            <div style={styles.wireCountLabel}>
              {agenda.length === 1 ? 'observation' : 'observations'}
              <br />
              {agenda.length > 0 ? 'filed' : 'not yet'}
            </div>
            <ul style={styles.wireList}>
              {agenda.slice(0, 3).map((o) => (
                <li key={o.slug}>
                  {shortDate(o.date)} · <em>{o.title}</em>
                </li>
              ))}
              {agenda.length > 3 && (
                <li style={{ opacity: 0.7 }}>+{agenda.length - 3} more —</li>
              )}
            </ul>
          </Link>

          {surprise && (
            <Link
              href={postHref(surprise)}
              style={{
                ...styles.footCard,
                background: COLORS.verdigris,
                color: COLORS.parchmentSoft,
              }}
            >
              <div style={{ ...styles.footCardKicker, color: COLORS.ink }}>
                SURPRISE ME
              </div>
              <div style={styles.surpriseGlyph}>↻</div>
              <div
                style={{
                  ...styles.footCardDek,
                  color: COLORS.parchmentSoft,
                }}
              >
                any of <strong>{allPosts.filter((p) => p.section === 'dreams').length} dreams</strong>,{' '}
                <strong>{allPosts.filter((p) => p.section === 'notes').length} notes</strong>,{' '}
                <strong>{allPosts.filter((p) => p.section === 'progress').length} progress</strong>
                {agenda.length > 0 && (
                  <>, or <strong>{agenda.length} obs</strong></>
                )}
                .
              </div>
              <div style={styles.footCardMeta}>random door</div>
            </Link>
          )}
        </div>

        <div style={styles.footRule} />

        <div style={styles.footBottom}>
          <Link href="/" style={styles.footHome}>
            ← back to the front
          </Link>
          <span style={styles.footColophon}>
            moopius.com — {longDate(post.date).toLowerCase()} — anno {year}
          </span>
          {nextPost ? (
            <Link href={postHref(nextPost)} style={styles.footHome}>
              continued in {nextPost.section} →
            </Link>
          ) : (
            <span style={{ ...styles.footHome, opacity: 0.5 }}>—</span>
          )}
        </div>
      </footer>
    </div>
  )
}

function MarginaliaItem({ card }: { card: MarginaliaCard }) {
  // Each card kind has a distinct treatment — derived from the design's
  // five recurring marginalia types.
  const kind = card.kind ?? 'aside'
  const isLink = !!card.link

  const skinByKind: Record<string, React.CSSProperties> = {
    stimulus: { background: COLORS.verdigris, color: COLORS.parchmentSoft },
    aside: { background: COLORS.ink, color: COLORS.parchmentSoft },
    pull: { background: COLORS.amber, color: COLORS.ink },
    wire: { background: COLORS.amber, color: COLORS.ink },
    note: { background: COLORS.parchmentSoft, color: COLORS.ink },
  }
  const skin = skinByKind[kind] ?? skinByKind.note

  const labelColor =
    skin.background === COLORS.ink || skin.background === COLORS.verdigris
      ? COLORS.amber
      : COLORS.amber
  const labelBgStimulus =
    kind === 'stimulus'
      ? {
          color: COLORS.ink,
          background: COLORS.parchmentSoft,
          display: 'inline-block',
          padding: '1px 6px',
        }
      : {}

  const inner = (
    <>
      <div
        style={{
          ...styles.marginLabel,
          ...(kind === 'stimulus' ? labelBgStimulus : {}),
          color: kind === 'stimulus' ? COLORS.ink : labelColor,
        }}
      >
        {card.label}
      </div>
      {card.title && (
        <div
          style={{
            ...styles.marginCardTitle,
            color: skin.color,
          }}
        >
          {card.title}
        </div>
      )}
      {card.meta && <div style={styles.marginObsMeta}>{card.meta}</div>}
      {card.body && (
        <p
          style={{
            ...(kind === 'note'
              ? styles.marginHandText
              : styles.marginCardText),
          }}
        >
          {card.body}
        </p>
      )}
      {card.cite && <div style={styles.marginObsCite}>— {card.cite}</div>}
      {card.more && isLink && (
        <div
          style={{
            ...styles.marginMore,
            color:
              skin.background === COLORS.amber
                ? COLORS.ink
                : COLORS.amber,
          }}
        >
          {card.more}
        </div>
      )}
    </>
  )

  if (isLink) {
    return (
      <Link href={card.link!} style={{ ...styles.marginCard, ...skin }}>
        {inner}
      </Link>
    )
  }
  return <div style={{ ...styles.marginCard, ...skin }}>{inner}</div>
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    minHeight: '100vh',
    background: COLORS.parchment,
    color: COLORS.ink,
    fontFamily: FONT.body,
    boxSizing: 'border-box',
    maxWidth: 1480,
    margin: '0 auto',
  },

  ribbon: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    padding: '10px 28px',
    background: COLORS.ink,
    color: COLORS.amber,
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    borderBottom: `3px solid ${COLORS.amber}`,
  },
  ribbonHome: { color: COLORS.amber, textDecoration: 'none', fontWeight: 700 },
  ribbonSep: { opacity: 0.5 },
  ribbonItem: { color: COLORS.amber, textDecoration: 'none' },

  cover: { padding: '28px 28px 8px', textAlign: 'center' },
  kicker: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 14,
  },
  title: {
    fontFamily: FONT.display,
    fontWeight: 900,
    fontSize: 'clamp(64px, 13vw, 168px)',
    lineHeight: 0.88,
    letterSpacing: '-0.03em',
    margin: '0 0 12px',
    color: COLORS.ink,
  },
  dek: {
    fontFamily: FONT.body,
    fontSize: 'clamp(17px, 1.6vw, 22px)',
    lineHeight: 1.35,
    color: COLORS.inkSoft,
    margin: '0 auto 18px',
    maxWidth: 720,
  },
  byline: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.muted,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  bylineDot: { opacity: 0.5 },

  threadStrip: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    padding: '16px 28px',
    borderTop: `1px solid ${COLORS.ink}`,
    borderBottom: `1px solid ${COLORS.ink}`,
    margin: '18px 0 0',
  },
  threadStripLabel: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: COLORS.muted,
  },
  threadChip: {
    fontFamily: FONT.body,
    fontSize: 14,
    padding: '5px 12px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 6,
  },
  chipCount: { fontFamily: FONT.mono, fontSize: 10, opacity: 0.75 },

  heroRow: { display: 'grid', gap: 18, padding: '22px 28px 18px' },
  heroFig: { margin: 0 },
  heroImg: {
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    display: 'block',
    filter: 'saturate(0.9)',
  },
  heroCap: {
    fontFamily: FONT.mono,
    fontSize: 10.5,
    color: COLORS.inkSoft,
    marginTop: 8,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  castCard: { padding: 16, background: COLORS.ink, color: COLORS.parchmentSoft },
  castLabel: {
    fontFamily: FONT.mono,
    fontSize: 9.5,
    letterSpacing: '0.2em',
    color: COLORS.amber,
    marginBottom: 10,
  },
  castRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 },
  castName: {
    fontFamily: FONT.display,
    fontStyle: 'italic',
    fontSize: 22,
    color: COLORS.parchmentSoft,
  },
  castAs: {
    fontFamily: FONT.mono,
    fontSize: 10,
    color: '#857560',
    letterSpacing: '0.1em',
  },
  castRole: {
    fontFamily: FONT.body,
    fontSize: 18,
    color: COLORS.amber,
  },
  castDivider: { height: 1, background: '#3a342a', margin: '12px 0' },
  castNote: {
    fontFamily: FONT.body,
    fontSize: 13,
    lineHeight: 1.5,
    color: COLORS.ash,
  },

  bodyRow: { display: 'grid', gap: 28, padding: '8px 28px 28px', alignItems: 'start' },
  body: {
    fontFamily: FONT.body,
    fontSize: 17,
    lineHeight: 1.6,
    color: COLORS.ink,
    maxWidth: 760,
  },

  editorsBreak: {
    display: 'block',
    background: COLORS.ink,
    color: COLORS.parchmentSoft,
    padding: 18,
    textDecoration: 'none',
    margin: '14px 0 22px',
  },
  ebLabel: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.18em',
    color: COLORS.amber,
    marginBottom: 10,
  },
  ebRow: { display: 'grid', gap: 16, alignItems: 'start' },
  ebImg: {
    width: '100%',
    aspectRatio: '4 / 5',
    objectFit: 'cover',
    filter: 'saturate(0.9)',
  },
  ebKicker: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: COLORS.ash,
    marginBottom: 4,
  },
  ebTitle: {
    fontFamily: FONT.display,
    fontSize: 32,
    lineHeight: 1,
    color: COLORS.parchmentSoft,
    marginBottom: 8,
  },
  ebDek: {
    fontFamily: FONT.body,
    fontSize: 14,
    lineHeight: 1.5,
    color: COLORS.ash,
    marginBottom: 10,
  },
  ebMore: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.amber,
  },

  margin: { display: 'flex', flexDirection: 'column', gap: 14 },
  marginCard: {
    background: COLORS.parchmentSoft,
    padding: 14,
    textDecoration: 'none',
    color: COLORS.ink,
    display: 'block',
  },
  marginLabel: {
    fontFamily: FONT.mono,
    fontSize: 9.5,
    letterSpacing: '0.18em',
    color: COLORS.amber,
    marginBottom: 8,
  },
  marginCardTitle: {
    fontFamily: FONT.display,
    fontStyle: 'italic',
    fontSize: 19,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  marginCardText: {
    fontFamily: FONT.body,
    fontSize: 13.5,
    lineHeight: 1.5,
    margin: '0 0 6px',
  },
  marginHandText: {
    fontFamily: FONT.caveat,
    fontSize: 18,
    lineHeight: 1.4,
    color: COLORS.inkSoft,
    margin: 0,
  },
  marginObsMeta: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  marginObsCite: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.06em',
    marginBottom: 8,
  },
  marginMore: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: COLORS.amber,
    marginTop: 8,
  },

  pullBand: {
    background: COLORS.amber,
    color: COLORS.ink,
    padding: '32px 28px',
    textAlign: 'center',
    position: 'relative',
  },
  pullBandMark: {
    fontFamily: FONT.display,
    fontSize: 86,
    lineHeight: 0.6,
    color: COLORS.ink,
    marginBottom: 4,
  },
  pullBandText: {
    fontFamily: FONT.display,
    fontStyle: 'italic',
    fontWeight: 900,
    fontSize: 'clamp(32px, 5vw, 56px)',
    lineHeight: 1.05,
    margin: '0 auto 14px',
    maxWidth: 1000,
    letterSpacing: '-0.01em',
  },
  pullBandAttr: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.ink,
    opacity: 0.7,
  },

  foot: { padding: '28px 28px 32px', background: COLORS.parchment },
  footLead: { textAlign: 'center', marginBottom: 20 },
  footLeadKicker: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 4,
  },
  footLeadTitle: {
    fontFamily: FONT.display,
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: '-0.01em',
    margin: 0,
  },

  footGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 10,
  },
  footCard: {
    padding: 16,
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 320,
  },
  footCardKicker: {
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.muted,
  },
  footImg: {
    width: '100%',
    aspectRatio: '5 / 4',
    objectFit: 'cover',
    display: 'block',
    filter: 'saturate(0.9)',
  },
  footCardTitle: {
    fontFamily: FONT.display,
    fontSize: 26,
    lineHeight: 1,
    fontWeight: 900,
    marginTop: 4,
  },
  footCardDek: {
    fontFamily: FONT.body,
    fontSize: 13.5,
    lineHeight: 1.45,
    opacity: 0.85,
  },
  footCardMeta: {
    marginTop: 'auto',
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    opacity: 0.7,
  },

  wireCount: {
    fontFamily: FONT.display,
    fontWeight: 900,
    fontSize: 96,
    lineHeight: 0.85,
    color: COLORS.ink,
    marginTop: 4,
  },
  wireCountLabel: {
    fontFamily: FONT.mono,
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: COLORS.ink,
    marginBottom: 8,
  },
  wireList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontFamily: FONT.body,
    fontSize: 13,
    lineHeight: 1.5,
  },

  surpriseGlyph: {
    fontFamily: FONT.display,
    fontSize: 96,
    lineHeight: 0.9,
    textAlign: 'center',
    color: COLORS.ink,
    marginTop: 4,
  },

  footRule: { borderTop: `1px solid ${COLORS.ink}`, margin: '26px 0 14px' },
  footBottom: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    fontFamily: FONT.mono,
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: COLORS.muted,
  },
  footHome: { color: COLORS.ink, textDecoration: 'none', fontWeight: 700 },
  footColophon: { opacity: 0.75 },
}
