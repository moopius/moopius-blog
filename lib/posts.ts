import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { SECTIONS, SECTION_META, TEXT_ONLY_SECTIONS, type Section } from './sections'

export { SECTIONS, SECTION_META, TEXT_ONLY_SECTIONS }
export type { Section }

const postsDirectory = path.join(process.cwd(), 'posts')

// Optional flourishes the Bulletin/BulletinPost layouts use. All are
// authored opt-in — no retroactive backfill is required. A missing field
// just means that piece of the page doesn't render.
export interface CastMember {
  name: string
  as?: string
  role?: string
}
export interface ThreadTag {
  name: string
  count?: number
}
export type MarginaliaKind = 'aside' | 'stimulus' | 'note' | 'pull' | 'wire'
export interface MarginaliaCard {
  kind?: MarginaliaKind
  label: string
  title?: string
  body?: string
  meta?: string
  cite?: string
  link?: string
  more?: string
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  section: Section
  excerpt?: string
  coverImage?: string
  dek?: string
  kicker?: string
  cast?: CastMember[]
  threads?: ThreadTag[]
  pull?: string
  pullAttribution?: string
  marginalia?: MarginaliaCard[]
}

export interface Post extends PostMeta {
  contentHtml: string
}

function sectionDir(section: Section): string {
  return path.join(postsDirectory, section)
}

function parseFrontmatter(section: Section, fileName: string) {
  const fullPath = path.join(sectionDir(section), fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const result = matter(fileContents)
  return { result, fileContents }
}

function metaFromMatter(
  section: Section,
  fileName: string,
  data: Record<string, unknown>,
  content: string,
): PostMeta {
  const slug = fileName.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
  const excerpt =
    content.split('\n').find((line) => line.trim().length > 0) || ''

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    section,
    excerpt: excerpt.slice(0, 240),
    coverImage: data.cover_image as string | undefined,
    dek: data.dek as string | undefined,
    kicker: data.kicker as string | undefined,
    cast: data.cast as CastMember[] | undefined,
    threads: data.threads as ThreadTag[] | undefined,
    pull: data.pull as string | undefined,
    pullAttribution: data.pull_attribution as string | undefined,
    marginalia: data.marginalia as MarginaliaCard[] | undefined,
  }
}

function readPostFile(section: Section, fileName: string): PostMeta {
  const { result } = parseFrontmatter(section, fileName)
  return metaFromMatter(section, fileName, result.data, result.content)
}

function listSectionFiles(section: Section): string[] {
  const dir = sectionDir(section)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((fn) => fn.endsWith('.md'))
}

export function getPostsBySection(section: Section): PostMeta[] {
  return listSectionFiles(section)
    .map((fn) => readPostFile(section, fn))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllPostsSorted(): PostMeta[] {
  return SECTIONS.flatMap((section) => getPostsBySection(section)).sort((a, b) =>
    a.date < b.date ? 1 : -1,
  )
}

export function getAllPostParams(): { section: Section; slug: string }[] {
  return SECTIONS.flatMap((section) =>
    listSectionFiles(section).map((fn) => ({
      section,
      slug: fn.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
    })),
  )
}

export async function getPostData(section: Section, slug: string): Promise<Post> {
  const fileNames = listSectionFiles(section)
  const fileName = fileNames.find(
    (fn) =>
      fn.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '') === slug,
  )

  if (!fileName) throw new Error(`Post not found: ${section}/${slug}`)

  const { result } = parseFrontmatter(section, fileName)
  const meta = metaFromMatter(section, fileName, result.data, result.content)

  const processedContent = await remark()
    .use(html)
    .process(result.content)
  const contentHtml = processedContent.toString()

  return { ...meta, contentHtml }
}
