import { getPostData, getAllPostSlugs } from '@/lib/posts'
import Link from 'next/link'

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((s) => ({ slug: s.params.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostData(slug)

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <nav className="mb-12">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
          ← All posts
        </Link>
      </nav>

      <article>
        <header className="mb-10">
          <time className="text-xs text-stone-400 tracking-wide uppercase">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
          <h1 className="mt-2 text-2xl font-medium text-stone-900">{post.title}</h1>
        </header>

        <div
          className="prose prose-stone prose-sm max-w-none
            prose-p:leading-relaxed prose-p:text-stone-700
            prose-headings:font-medium prose-headings:text-stone-900
            prose-hr:border-stone-200
            prose-a:text-stone-900 prose-a:underline-offset-2"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  )
}
