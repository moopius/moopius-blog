import { Source_Serif_4, JetBrains_Mono } from 'next/font/google'

// Zine layout. Layers a serif body face + monospace section labels over
// the root layout's sans font. The blog keeps Geist; the zine reads as
// something else. Variables (`--font-zine-serif`, `--font-zine-mono`) are
// scoped to this subtree only.

const zineSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-zine-serif',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})

const zineMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-zine-mono',
  weight: ['400', '500'],
})

export default function ZineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${zineSerif.variable} ${zineMono.variable}`}>{children}</div>
  )
}
