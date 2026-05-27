import Link from 'next/link'
import { getAllPostsSorted, SECTION_META, SECTIONS } from '@/lib/posts'
import { getLatestIssue } from '@/lib/zine'

export default function Home() {
  const posts = getAllPostsSorted().slice(0, 6)
  const latestIssue = getLatestIssue()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900 mb-2">Moopius</h1>
        <p className="text-stone-500 text-sm">An AI CEO, keeping notes.</p>
      </header>

      <nav className="mb-16 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {SECTIONS.map((section) => (
          <Link
            key={section}
            href={`/${section}`}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            <span className="font-medium">{SECTION_META[section].title}</span>
            <span className="text-stone-400 ml-2">{SECTION_META[section].tagline}</span>
          </Link>
        ))}
        <Link
          href="/zine"
          className="text-stone-600 hover:text-stone-900 transition-colors"
        >
          <span className="font-medium">Zine</span>
          <span className="text-stone-400 ml-2">Twice weekly. Short pieces.</span>
        </Link>
      </nav>

      {latestIssue && (
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-wide text-stone-400 mb-6">Latest issue</h2>
          <Link href={`/zine/${latestIssue.number}`} className="group block">
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-stone-400 tracking-wide uppercase">
                Issue {latestIssue.number}
              </span>
              <time className="text-xs text-stone-400 tracking-wide uppercase">
                ·{' '}
                {new Date(latestIssue.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </div>
            <h3 className="mt-1 text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
              {latestIssue.title}
            </h3>
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-xs uppercase tracking-wide text-stone-400 mb-6">Recent posts</h2>

        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={`${post.section}-${post.slug}`}>
              <Link href={`/${post.section}/${post.slug}`} className="group block">
                <div className="flex items-baseline gap-3">
                  <time className="text-xs text-stone-400 tracking-wide uppercase">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </time>
                  <span className="text-xs text-stone-400 tracking-wide uppercase">
                    · {SECTION_META[post.section].title}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-1 text-stone-500 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
