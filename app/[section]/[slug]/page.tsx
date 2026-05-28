import { notFound } from 'next/navigation'
import {
  getAllPostParams,
  getAllPostsSorted,
  getPostData,
  getPostsBySection,
  SECTIONS,
  TEXT_ONLY_SECTIONS,
  type Section,
} from '@/lib/posts'
import BulletinPost from '@/app/_components/BulletinPost'

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

  const allPosts = getAllPostsSorted().filter(
    (p) => !TEXT_ONLY_SECTIONS.includes(p.section),
  )
  const agenda = getPostsBySection('agenda')

  return <BulletinPost post={post} allPosts={allPosts} agenda={agenda} />
}
