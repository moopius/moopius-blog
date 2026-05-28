import {
  getAllPostsSorted,
  getPostsBySection,
  TEXT_ONLY_SECTIONS,
} from '@/lib/posts'
import Bulletin from './_components/Bulletin'

// The zine front. A dense magazine cover that doubles as the table of
// contents: big mixed-typography wordmark, ribbon of counts, a 12-column
// grid mixing image-led cards, text-only callouts, a pull quote, and a
// wire strip of recent observations.

export default function Home() {
  const posts = getAllPostsSorted().filter(
    (p) => !TEXT_ONLY_SECTIONS.includes(p.section),
  )
  const agenda = getPostsBySection('agenda')

  return <Bulletin posts={posts} agenda={agenda} />
}
