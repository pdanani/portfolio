import type { ExperienceEntry } from './types'

/** Most recent first — rendered top-down in the Experience timeline. */
export const EXPERIENCE: Array<ExperienceEntry> = [
  {
    company: 'P.C. Richard & Son',
    role: 'Software Engineer',
    location: 'Long Island, NY',
    start: '2023-08',
    end: null,
    highlights: [
      'Enhanced the web-based Point of Sale system using React.js, implementing new features such as QR Code sign-in using the employee mobile app.',
      'Architected and implemented Tap-to-Pay (TTP) integration for Android by wrapping the React app in a native layer and exposing JavaScript interfaces via a native SDK.',
      'Developed and deployed the frontend for an internal AI multi-agent assistant using React.js, integrated with a FastAPI backend and OpenAI SDK for real-time streamed responses.',
      'Migrated the AI assistant system to fetch hosted JavaScript files from AWS S3, enabling instant updates without requiring app redeployment.',
      'Expanded and secured the Node.js middleware API by developing new endpoints and preventing SQL injections on DB2 for IBM i.',
      'Modernized CI/CD processes by migrating legacy declarative Jenkins pipelines to Pipeline-as-Code, improving deployment efficiency and maintainability.',
      'Proposed and integrated OpenReplay, a self-hosted session replay tool forked from Sentry, improving error tracking and cross-team debugging workflows.',
      'Built AWS Lambda functions to automate GPS tagging for rebate verification and generate barcodes dynamically through API Gateway for frontend integration.',
    ],
    tech: [
      'React.js',
      'Node.js',
      'FastAPI',
      'AWS Lambda',
      'S3',
      'Cordova',
      'Jenkins',
      'DB2',
      'OpenAI SDK',
      'OpenReplay',
    ],
  },
  {
    company: 'Envogue International',
    role: 'Software Engineer',
    location: 'New York, NY',
    start: '2022-03',
    end: '2022-10',
    highlights: [
      'Collaborated in a cross-functional Agile team to build madeyn.com, a socially engaging e-commerce platform.',
      'Owned the design and development of Explore, Profile, and Home pages using React.js and GraphQL.',
      'Integrated AWS Cognito authentication and Lambda triggers to sync user data with PostgreSQL.',
      'Created Lambda-based media compression workflows that reduced S3 data load by 60%.',
    ],
    tech: [
      'React.js',
      'GraphQL',
      'AWS Cognito',
      'Lambda',
      'EC2',
      'S3',
      'PostgreSQL',
    ],
  },
  {
    company: 'PK INTL',
    role: 'Software Developer Intern',
    start: '2021-09',
    end: '2022-01',
    highlights: [
      'Developed an inventory offering system using Mongoose and GraphQL to send and manage item offers.',
      'Implemented offer models and created a React-based frontend interface for offer tracking.',
    ],
    tech: ['Mongoose', 'Express', 'React', 'Node', 'GraphQL'],
  },
]
