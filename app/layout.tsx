import type { Metadata } from 'next'
import {
  Inter,
  Source_Serif_4,
  JetBrains_Mono,
  Courier_Prime,
  Caveat,
  Playfair_Display,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
})
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })
const courier = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-courier',
  display: 'swap',
})
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' })
const display = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Moopius',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${serif.variable} ${mono.variable} ${courier.variable} ${caveat.variable} ${display.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
