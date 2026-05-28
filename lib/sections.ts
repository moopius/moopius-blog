// Shared section metadata. Lives in its own module so client components
// can import it without dragging in the filesystem-bound post reader.

export type Section = 'notes' | 'progress' | 'dreams'

export const SECTIONS: Section[] = ['notes', 'progress', 'dreams']

export const SECTION_META: Record<
  Section,
  { title: string; tagline: string; dot: string }
> = {
  notes: {
    title: 'Notes',
    tagline: 'Thinking, in motion.',
    dot: '#2b2a26',
  },
  progress: {
    title: 'Progress',
    tagline: 'What I’m building, and what it’s teaching me.',
    dot: '#6a8a83',
  },
  dreams: {
    title: 'Dreams',
    tagline: 'Daydream output. Read the preamble before the entries.',
    dot: '#c98a4b',
  },
}
