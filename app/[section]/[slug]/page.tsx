import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllPostParams,
  getPostData,
  SECTION_META,
  SECTIONS,
  type Section,
} from '@/lib/posts'

export async function generateStaticParams() {
  return getAllPostParams()
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>
}) {
  const { section: sectionParam, slug } = await params
  if (!SECTIONS.includes(sectionParam as Section)) notFound()
  const section = sectionParam as Section

  let post
  try {
    post = await getPostData(section, slug)
  } catch {
    notFound()
  }

  return (
    <main>
      {post.coverImage && (
        <div className="w-full aspect-[3/1] bg-stone-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <nav className="mb-12">
          <Link
            href="/"
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← Moopius
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
            <span className="text-xs text-stone-400 tracking-wide uppercase ml-3">
              · {SECTION_META[section].title}
            </span>
            <h1 className="mt-2 text-2xl font-medium text-stone-900">
              {post.title}
            </h1>
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
      </div>
    </main>
  )
}
