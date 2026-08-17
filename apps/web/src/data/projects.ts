import type { Project } from './types'

/** Display order: systems work first (it backs the hero's pitch), apps after. */
export const PROJECTS: Array<Project> = [
  {
    slug: 'memory-allocator',
    title: 'Synchronization-Free Memory Allocator',
    description:
      'A custom dynamic memory allocator for x86-64 architectures featuring segregated free lists, a "first-best fit" strategy, and immediate coalescing to minimize external fragmentation.',
    tech: ['C'],
    githubUrl: 'https://github.com/pdanani/MemoryAllocator',
  },
  {
    slug: 'dns-dig-tool',
    title: 'DNS Dig Tool',
    description:
      'A recursive DNS resolver that iteratively contacts root, TLD, and authoritative servers to resolve domain names from scratch.',
    tech: ['Python'],
    githubUrl: 'https://github.com/pdanani/DNSDigTool',
  },
  {
    slug: 'shipstation-workflow',
    title: 'ShipStation Workflow App',
    description:
      'A React and GraphQL workflow app integrating e-commerce data — reduced shipping errors by 75% through employee-ID-linked packages and role-based permissions.',
    tech: ['React', 'Node', 'PostgreSQL', 'Apollo', 'GraphQL'],
    githubUrl: 'https://github.com/pdanani/ShipStationWorkflow',
  },
  {
    slug: 'marvins-studio',
    title: "Marvin's Studio",
    description:
      'A collaborative playlist maker and music player that allows users to share, fork, and explore new songs weekly via the "Genre of the Week" feature.',
    tech: ['JavaScript', 'React', 'Node', 'Express', 'GraphQL', 'Mongoose'],
    githubUrl: 'https://github.com/pdanani/Marvins-Studio',
  },
  {
    slug: 'gesture-swiping-decoder',
    title: 'Gesture Swiping Decoder',
    description:
      'A gesture-based word prediction system using the SHARK2 algorithm, implemented in Python with NumPy and Flask for swipe gesture recognition and multi-stage pruning.',
    tech: ['Python', 'Flask', 'NumPy'],
    // TODO: the old data had a placeholder repo URL for this one — add the
    // real link (the card shows no GitHub action until then)
  },
  {
    slug: 'songoff',
    title: 'SongOff',
    description:
      'A daily song voting app that lets users choose among four daily picks, tallying votes to determine a "Song of the Day" stored in the database.',
    tech: ['React', 'Node', 'PostgreSQL'],
    githubUrl: 'https://github.com/pdanani/songoff',
  },
  {
    slug: 'gologolo',
    title: 'GoLogoLo',
    description:
      'A MERN stack logo creation app that allows users to design shapes, text, import images, and export logos as .png files for web use.',
    tech: ['MongoDB', 'Express', 'React', 'Node'],
    githubUrl: 'https://github.com/pdanani/GoLogoLo-MERN-',
  },
]
