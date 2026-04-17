import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt?: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

export function getSortedPostsData(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fn) => fn.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const excerpt = matterResult.content.split('\n').find((line) => line.trim().length > 0) || ''

      return {
        slug,
        title: matterResult.data.title as string,
        date: matterResult.data.date as string,
        excerpt: excerpt.slice(0, 200),
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fn) => fn.endsWith('.md'))
    .map((fileName) => ({
      params: {
        slug: fileName.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
      },
    }))
}

export async function getPostData(slug: string): Promise<Post> {
  // Find the file that matches this slug (with or without date prefix)
  const fileNames = fs.readdirSync(postsDirectory)
  const fileName = fileNames.find(
    (fn) => fn.endsWith('.md') && fn.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '') === slug
  )

  if (!fileName) throw new Error(`Post not found: ${slug}`)

  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    contentHtml,
  }
}
