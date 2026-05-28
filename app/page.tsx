import { getAllPostsSorted } from '@/lib/posts'
import Site from './_components/Site'

// The zine. Primary is the collage — photos dumped on a table, no title,
// no descriptive copy, sized and rotated deterministically per slug.
// A small bracketed amber dot at the bottom-right is the door into the
// dossier (secret) view; ` from anywhere flips too.

export default function Home() {
  const posts = getAllPostsSorted().map((p) => ({
    slug: p.slug,
    title: p.title,
    section: p.section,
    coverImage: p.coverImage,
  }))

  return (
    <main>
      <Site posts={posts} />
    </main>
  )
}
