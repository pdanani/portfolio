import type { Project } from './types'

/** Display order: systems work first (it backs the hero's pitch), apps after. */
export const PROJECTS: Array<Project> = [
  {
    slug: 'warehouse-watch',
    title: 'Warehouse Watch',
    description:
      'A subscription-free Costco tracker built into this site — live full-catalog search with real prices and promotions, true per-warehouse stock, and back-in-stock push alerts, all from Costco’s public endpoints. Serverless TanStack Start API over Neon Postgres, polled by cron.',
    tech: [
      'TypeScript',
      'TanStack Start',
      'Neon Postgres',
      'Drizzle',
      'Nitro',
      'ntfy',
    ],
    githubUrl: 'https://github.com/pdanani/portfolio/tree/revamp/docs/costco',
    // liveUrl: '/costco' once the Vercel deploy is live (Pages is static)
  },
  {
    slug: 'memory-allocator',
    title: 'Synchronization-Free Memory Allocator',
    description:
      'A custom dynamic memory allocator for x86-64 architectures featuring segregated free lists, a "first-best fit" strategy, and immediate coalescing to minimize external fragmentation.',
    tech: ['C'],
    githubUrl: 'https://github.com/pdanani/MemoryAllocator',
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
]
