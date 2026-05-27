import Link from 'next/link'
import { getAllPostsSorted, SECTION_META, type PostMeta } from '@/lib/posts'
import { getAllIssuesSorted, type IssueMeta } from '@/lib/zine'

// Unified "piece" shape. Both blog posts and zine issues land in the same
// wall, distinguished by `kind`. Posts are features (long, standalone);
// issues are collections (short pieces, twice-weekly). The grid renders
// them as one continuous collage.
type Piece =
  | {
      kind: 'post'
      slug: string
      title: string
      date: string
      url: string
      coverImage?: string
      section: string
    }
  | {
      kind: 'issue'
      slug: string
      title: string
      date: string
      url: string
      coverImage?: string
      issueNumber: string
    }

function asPostPiece(p: PostMeta): Piece {
  return {
    kind: 'post',
    slug: p.slug,
    title: p.title,
    date: p.date,
    url: `/${p.section}/${p.slug}`,
    coverImage: p.coverImage,
    section: SECTION_META[p.section].title,
  }
}

function asIssuePiece(i: IssueMeta): Piece {
  return {
    kind: 'issue',
    slug: i.number,
    title: i.title,
    date: i.date,
    url: `/zine/${i.number}`,
    coverImage: i.coverImage,
    issueNumber: i.number,
  }
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function Home() {
  const pieces: Piece[] = [
    ...getAllPostsSorted().map(asPostPiece),
    ...getAllIssuesSorted().map(asIssuePiece),
  ].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <main>
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-3xl tracking-tight text-stone-900 font-medium">Moopius</h1>
      </header>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {pieces.map((p) => (
            <PieceTile key={`${p.kind}-${p.slug}`} piece={p} />
          ))}
        </div>
      </section>
    </main>
  )
}

function PieceTile({ piece }: { piece: Piece }) {
  return (
    <Link
      href={piece.url}
      className="group block mb-6 break-inside-avoid"
    >
      <div className="overflow-hidden bg-stone-100 border border-stone-200">
        {piece.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={piece.coverImage}
            alt=""
            className="w-full h-auto object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="aspect-[3/2] relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_1px,transparent_10px)]" />
            <span className="text-stone-300 text-5xl italic font-serif select-none">
              {piece.kind === 'issue' ? piece.issueNumber : '·'}
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-mono">
          {piece.kind === 'issue' ? `Issue ${piece.issueNumber}` : piece.section}
          <span className="mx-2 text-stone-300">·</span>
          {fmtDate(piece.date)}
        </div>
        <h2 className="mt-1 text-stone-900 leading-snug group-hover:text-stone-600 transition-colors">
          {piece.title}
        </h2>
      </div>
    </Link>
  )
}
