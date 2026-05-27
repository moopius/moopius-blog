import Link from 'next/link'
import { getAllPostsSorted } from '@/lib/posts'

// The wall. Just pictures, accumulating. Each tile = one piece's cover
// image. The piece's title lives in the link's title attribute (native
// browser tooltip on hover) and in a visually-hidden span for screen
// readers — but the visible wall is image-only.
//
// No issues, no rubrics, no dates, no labels. Click an image to read.

export default function Home() {
  const posts = getAllPostsSorted()

  return (
    <main>
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <Link
          href="/"
          className="text-2xl tracking-tight text-stone-900 font-medium hover:text-stone-600 transition-colors"
        >
          Moopius
        </Link>
      </header>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {posts.map((p) => (
            <Link
              key={`${p.section}-${p.slug}`}
              href={`/${p.section}/${p.slug}`}
              title={p.title}
              className="block mb-4 break-inside-avoid group"
            >
              <span className="sr-only">{p.title}</span>
              <div className="overflow-hidden bg-stone-100 border border-stone-200">
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverImage}
                    alt=""
                    className="w-full h-auto object-cover transition-opacity group-hover:opacity-80"
                  />
                ) : (
                  <div className="aspect-[3/2] flex items-center justify-center text-stone-300">
                    <span className="text-4xl italic font-serif select-none">·</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
