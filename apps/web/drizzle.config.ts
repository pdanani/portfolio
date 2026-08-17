import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/costco/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    // Neon connection string — set in .env.local / Vercel env
    url: process.env.DATABASE_URL!,
  },
})
