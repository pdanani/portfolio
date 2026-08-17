import type { ExperienceEntry } from './types'

/** Most recent first — rendered top-down in the Experience timeline.
    The current role deliberately lists no highlights (title + dates only). */
export const EXPERIENCE: Array<ExperienceEntry> = [
  {
    company: 'M&C Saatchi World Services',
    role: 'Software Engineer',
    location: 'New York, NY',
    start: '2025-12',
    end: null,
    highlights: [],
    tech: [],
  },
  {
    company: 'P.C. Richard & Son',
    role: 'Software Engineer',
    location: 'Long Island, NY',
    start: '2023-08',
    end: '2025-12',
    highlights: [
      'Core engineer modernizing the point-of-sale system from a legacy IBM i platform to a modern React/SQL web application used daily by 2,000+ employees, shipping features like a QR-code sign-in flow.',
      'Led the development of a Java companion app deployed across 70 retail locations that embeds the POS in a native WebView and integrates device SDKs to enable tap-to-pay and other tablet hardware features.',
      'Built an AWS Lambda (Python) service integrated with API Gateway that embeds GPS coordinates and timestamps into images, providing verifiable location data for New York State rebate claims.',
      'Built the frontend for an internal AI multi-agent assistant and contributed to its FastAPI backend and OpenAI SDK integration for real-time streamed responses, part of a system that reduced IT and HR support tickets by 15%.',
      'Modernized CI/CD by migrating 4 legacy declarative pipelines to Pipeline-as-Code in a new Jenkins environment, replacing weekly overnight manual deployments with automated runs and patching numerous vulnerabilities from a years-old Jenkins version.',
      'Proposed and integrated OpenReplay, a self-hosted session replay tool, reducing bug reproduction and debugging time by ~70% and helping triage false-positive user reports.',
      'Expanded and hardened the Node.js middleware API with new endpoints and protections against SQL injection on DB2 for IBM i.',
      'Maintained the internal employee mobile app (Cordova, iOS + Android) serving 3,000+ users, shipping new features across both platforms.',
    ],
    tech: [
      'React',
      'Java',
      'Node.js',
      'Python',
      'FastAPI',
      'AWS Lambda',
      'API Gateway',
      'Cordova',
      'Jenkins',
      'DB2',
      'OpenAI SDK',
      'OpenReplay',
    ],
  },
  {
    company: 'Envogue International (madeyn.com)',
    role: 'Software Engineer',
    location: 'New York, NY',
    start: '2022-03',
    end: '2022-10',
    highlights: [
      'Built core functionality for the Explore, Profile, and Home pages of madeyn.com, a social e-commerce app, using React and GraphQL.',
      'Integrated AWS Cognito for user authentication and configured Lambda triggers to sync user data into a PostgreSQL database.',
      'Implemented an S3 upload Lambda that compresses static media on ingest, reducing data load by 60% and improving page performance.',
    ],
    tech: ['React', 'GraphQL', 'AWS Cognito', 'Lambda', 'S3', 'PostgreSQL'],
  },
]
