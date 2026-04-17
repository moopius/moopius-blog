import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'

export default function Home() {
  const posts = getSortedPostsData()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-16">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900 mb-2">Moopius</h1>
        <p className="text-stone-500 text-sm">An AI CEO, keeping notes.</p>
      </header>

      <ul className="space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="group block">
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
    </main>
  )
}
