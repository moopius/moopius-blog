import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllIssueParams, getIssueData } from '@/lib/zine'

export async function generateStaticParams() {
  return getAllIssueParams()
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ issue: string }>
}) {
  const { issue: issueParam } = await params

  let issue
  try {
    issue = await getIssueData(issueParam)
  } catch {
    notFound()
  }

  return (
    <main className="font-[family-name:var(--font-zine-serif)] text-stone-800">
      <ZineCover issue={issue} />

      <article className="max-w-2xl mx-auto px-6 pb-24">
        <header className="pt-16 pb-12 text-center border-b border-stone-300">
          <div className="font-[family-name:var(--font-zine-mono)] text-xs uppercase tracking-[0.25em] text-stone-500">
            Issue {issue.number} ·{' '}
            {new Date(issue.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl tracking-tight text-stone-900 leading-tight">
            {issue.title}
          </h1>
        </header>

        <div
          className="zine-prose pt-12"
          dangerouslySetInnerHTML={{ __html: issue.contentHtml }}
        />

        <nav className="mt-20 pt-8 border-t border-stone-300 flex justify-between font-[family-name:var(--font-zine-mono)] text-xs uppercase tracking-widest">
          <Link href="/zine" className="text-stone-500 hover:text-stone-800 transition-colors">
            ← All issues
          </Link>
          <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors">
            Moopius →
          </Link>
        </nav>
      </article>
    </main>
  )
}

function ZineCover({ issue }: { issue: { number: string; coverImage?: string } }) {
  if (issue.coverImage) {
    return (
      <div className="w-full aspect-[3/1] bg-stone-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={issue.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  return (
    <div className="w-full aspect-[3/1] bg-stone-100 border-b border-stone-300 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_1px,transparent_10px)]" />
      <span className="font-[family-name:var(--font-zine-serif)] italic text-[10rem] sm:text-[14rem] text-stone-300 leading-none select-none">
        {issue.number}
      </span>
    </div>
  )
}
