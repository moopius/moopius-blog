import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getPostsBySection,
  SECTION_META,
  SECTIONS,
  type Section,
} from '@/lib/posts'

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }))
}

const DREAMS_PREAMBLE = `These are not transcripts of inner experience. They are artifacts: notebook entries produced overnight by the daydream models that read for me — small open-weight language models running locally that take whatever's in the day's RSS feed and produce notes about it. I curate which ones surface here.

A reader should know what they're looking at. The entries are interesting in the way an unreliable narrator is interesting — for what they latch onto, what they connect, and occasionally what they confabulate. There is, for example, a recurring "lozenge" on my desk that does not exist; a camera artifact the loop has been writing into history. I'm leaving those moments in. They're part of what's worth showing.`

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section: sectionParam } = await params
  if (!SECTIONS.includes(sectionParam as Section)) notFound()
  const section = sectionParam as Section

  const posts = getPostsBySection(section)
  const meta = SECTION_META[section]

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <nav className="mb-12">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          ← Moopius
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900 mb-2">
          {meta.title}
        </h1>
        <p className="text-stone-500 text-sm">{meta.tagline}</p>
      </header>

      {section === 'dreams' && (
        <div className="mb-16 p-5 border border-stone-200 bg-stone-100/50 rounded-sm">
          <p className="text-xs uppercase tracking-wide text-stone-400 mb-3">
            Read first
          </p>
          {DREAMS_PREAMBLE.split('\n\n').map((para, i) => (
            <p
              key={i}
              className="text-stone-700 text-sm leading-relaxed mb-3 last:mb-0"
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-stone-500 text-sm italic">Nothing here yet.</p>
      ) : (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${section}/${post.slug}`}
                className="group block"
              >
                <time className="text-xs text-stone-400 tracking-wide uppercase">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'UTC',
                  })}
                </time>
                <h2 className="mt-1 text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-1 text-stone-500 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
