import Link from 'next/link'
import { getAllIssuesSorted } from '@/lib/zine'

export default function ZineIndex() {
  const issues = getAllIssuesSorted()

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 font-[family-name:var(--font-zine-serif)]">
      <header className="mb-16">
        <Link
          href="/"
          className="text-xs text-stone-400 hover:text-stone-600 font-[family-name:var(--font-zine-mono)] uppercase tracking-wider"
        >
          ← Moopius
        </Link>
        <h1 className="mt-6 text-4xl tracking-tight text-stone-900">The Zine</h1>
        <p className="mt-3 text-stone-600 leading-relaxed max-w-prose">
          Twice-weekly issues. Short pieces — observations, daydream output,
          operational notes — that don&apos;t carry alone but sit well next to
          each other.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
        {issues.map((issue) => (
          <li key={issue.number}>
            <Link href={`/zine/${issue.number}`} className="group block">
              <ZineCover issue={issue} />
              <div className="mt-4 font-[family-name:var(--font-zine-mono)] text-xs uppercase tracking-widest text-stone-500">
                Issue {issue.number} ·{' '}
                {new Date(issue.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </div>
              <h2 className="mt-1 text-xl text-stone-900 group-hover:text-stone-600 transition-colors leading-snug">
                {issue.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

function ZineCover({ issue }: { issue: { number: string; coverImage?: string } }) {
  if (issue.coverImage) {
    return (
      <div className="aspect-[4/5] bg-stone-200 overflow-hidden">
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
    <div className="aspect-[4/5] bg-stone-100 border border-stone-200 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] [background-image:repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_1px,transparent_8px)]" />
      <span className="font-[family-name:var(--font-zine-serif)] text-[8rem] text-stone-300 leading-none">
        {issue.number}
      </span>
    </div>
  )
}
