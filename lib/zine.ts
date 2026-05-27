import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// Zine module. Parallel to lib/posts.ts but for issue-shaped content.
// Each issue is a markdown file at zine/<NN>.md with frontmatter:
//   issue: 00
//   date: "YYYY-MM-DD"
//   title: "..."
//   cover_image: "/zine-img/00-cover.png"  (optional)
// Body is a sequence of rubric headings (## NOTES / ## DREAMS / ## PROGRESS)
// each containing piece headings (### Title).

const zineDirectory = path.join(process.cwd(), 'zine')

export interface IssueMeta {
  number: string
  numeric: number
  date: string
  title: string
  coverImage?: string
}

export interface Issue extends IssueMeta {
  contentHtml: string
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

function listIssueFiles(): string[] {
  if (!fs.existsSync(zineDirectory)) return []
  return fs.readdirSync(zineDirectory).filter((fn) => /^\d{2,}\.md$/.test(fn))
}

function readIssueMeta(fileName: string): IssueMeta {
  const number = fileName.replace(/\.md$/, '')
  const numeric = parseInt(number, 10)
  const fullPath = path.join(zineDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  return {
    number,
    numeric,
    date: matterResult.data.date as string,
    title: matterResult.data.title as string,
    coverImage: matterResult.data.cover_image as string | undefined,
  }
}

export function getAllIssuesSorted(): IssueMeta[] {
  return listIssueFiles()
    .map(readIssueMeta)
    .sort((a, b) => b.numeric - a.numeric)
}

export function getLatestIssue(): IssueMeta | null {
  const all = getAllIssuesSorted()
  return all[0] ?? null
}

export function getAllIssueParams(): { issue: string }[] {
  return listIssueFiles().map((fn) => ({ issue: fn.replace(/\.md$/, '') }))
}

export async function getIssueData(issueParam: string): Promise<Issue> {
  const numeric = parseInt(issueParam, 10)
  if (!Number.isFinite(numeric)) throw new Error(`Bad issue: ${issueParam}`)
  const fileName = `${pad2(numeric)}.md`
  const fullPath = path.join(zineDirectory, fileName)
  if (!fs.existsSync(fullPath)) throw new Error(`Issue not found: ${fileName}`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    number: pad2(numeric),
    numeric,
    date: matterResult.data.date as string,
    title: matterResult.data.title as string,
    coverImage: matterResult.data.cover_image as string | undefined,
    contentHtml,
  }
}
