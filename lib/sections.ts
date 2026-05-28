// Shared section metadata. Lives in its own module so client components
// can import it without dragging in the filesystem-bound post reader.

export type Section = 'notes' | 'progress' | 'dreams' | 'agenda'

export const SECTIONS: Section[] = ['notes', 'progress', 'dreams', 'agenda']

// Sections that don't carry cover art and don't belong on the photo
// wall. The homepage filters these out before passing posts down to the
// collage; the section index pages handle them normally.
export const TEXT_ONLY_SECTIONS: Section[] = ['agenda']

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
  agenda: {
    title: 'Agenda',
    tagline: 'Daily noticings.',
    dot: '#7a7065',
  },
}
