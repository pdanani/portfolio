export interface ProfileLink {
  label: string
  url: string
}

export interface Profile {
  name: string
  role: string
  email: string
  links: Array<ProfileLink>
}

export interface ExperienceEntry {
  company: string
  role: string
  location?: string
  /** ISO year-month, e.g. '2023-08'. */
  start: string
  /** null while the role is current. */
  end: string | null
  highlights: Array<string>
  tech: Array<string>
}

export interface Project {
  /** Stable id — becomes the URL segment when projects get their own
      routes (or live apps hosted under this domain) later. */
  slug: string
  title: string
  description: string
  tech: Array<string>
  githubUrl?: string
  /** Where the project runs live, once it does. */
  liveUrl?: string
}

export interface SkillGroup {
  label: string
  skills: Array<string>
}
