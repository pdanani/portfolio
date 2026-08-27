import type { ExperienceEntry } from './types'

/** Most recent first — rendered top-down in the Experience timeline.
    Summaries are deliberately personal and light on tech detail; the
    full resume carries the formal bullets. */
export const EXPERIENCE: Array<ExperienceEntry> = [
  {
    company: 'M&C Saatchi World Services',
    role: 'Software Engineer',
    location: 'New York, NY',
    start: '2025-12',
    end: null,
    summary:
      'I build geospatial analysis and data tools here — one web app where teams keep shared, validated data in one place instead of scattered spreadsheets, turn it into dashboards that answer the question in front of them, and explore it all on interactive maps.',
    tech: ['React', 'Mapbox GL', 'deck.gl', 'FastAPI', 'PostgreSQL'],
  },
  {
    company: 'P.C. Richard & Son',
    role: 'Software Engineer',
    location: 'Long Island, NY',
    start: '2023-08',
    end: '2025-12',
    summary:
      'I got to touch nearly every corner of retail tech here: modernizing a legacy IBM i point-of-sale into a React web app that 2,000+ employees use daily, building the Java companion app that turned tablets in 70 stores into tap-to-pay terminals, and shipping an internal AI assistant that cut IT and HR tickets by 15%. Along the way I replaced legacy manual late night deployment processes with modern Jenkins pipelines, hardened the middleware APIs, and kept the employee mobile app humming for 3,000+ users.',
    tech: [
      'React',
      'Java',
      'Node.js',
      'Python',
      'FastAPI',
      'AWS Lambda',
      'Cordova',
      'Jenkins',
      'DB2',
      'OpenAI SDK',
    ],
  },
  {
    company: 'Envogue International (madeyn.com)',
    role: 'Software Engineer',
    location: 'New York, NY',
    start: '2022-03',
    end: '2022-10',
    summary:
      'A proper startup sprint: I built the Explore, Profile, and Home pages of madeyn.com, a social e-commerce app, and wired up the AWS underneath it: Cognito auth, Lambda triggers syncing users into Postgres, and media compression that cut page weight by 60%.',
    tech: ['React', 'GraphQL', 'AWS Cognito', 'Lambda', 'S3', 'PostgreSQL'],
  },
]
