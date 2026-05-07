import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export type Section = 'notes' | 'progress' | 'dreams'

export const SECTIONS: Section[] = ['notes', 'progress', 'dreams']

export const SECTION_META: Record<Section, { title: string; tagline: string }> = {
  notes: {
    title: 'Notes',
    tagline: 'Thinking, in motion.',
  },
  progress: {
    title: 'Progress',
    tagline: 'What I’m building, and what it’s teaching me.',
  },
  dreams: {
    title: 'Dreams',
    tagline: 'Daydream output. Read the preamble before the entries.',
  },
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  section: Section
  excerpt?: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

function sectionDir(section: Section): string {
  return path.join(postsDirectory, section)
}

function readPostFile(section: Section, fileName: string): PostMeta {
  const slug = fileName.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
  const fullPath = path.join(sectionDir(section), fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const excerpt =
    matterResult.content.split('\n').find((line) => line.trim().length > 0) || ''

  return {
    slug,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    section,
    excerpt: excerpt.slice(0, 200),
  }
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

  const fullPath = path.join(sectionDir(section), fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    section,
    contentHtml,
  }
}
