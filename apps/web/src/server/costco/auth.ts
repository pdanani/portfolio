import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Single-user auth for the tracker: password (APP_PASSWORD) → HMAC-signed
 * cookie (SESSION_SECRET). Handlers receive/emit standard Request/Response.
 */

const COOKIE = 'ww_session'
const MAX_AGE = 60 * 60 * 24 * 90 // 90 days

function secret(): string {
  return process.env.SESSION_SECRET ?? 'dev-secret-not-for-prod'
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

function safeEq(a: string, b: string): boolean {
  const ha = createHmac('sha256', 'cmp').update(a).digest()
  const hb = createHmac('sha256', 'cmp').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function checkPassword(password: string): boolean {
  const expected = process.env.APP_PASSWORD ?? 'dev'
  return safeEq(password, expected)
}

export function sessionCookie(): string {
  const token = `ok.${sign('ok')}`
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`
}

export function clearedCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export function isAuthed(request: Request): boolean {
  const cookies = request.headers.get('cookie') ?? ''
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return false
  const [value, sig] = match[1].split('.')
  return value === 'ok' && sig != null && safeEq(sig, sign('ok'))
}

/** Returns a 401 Response when unauthenticated, else null. */
export function requireAuth(request: Request): Response | null {
  if (isAuthed(request)) return null
  return Response.json({ error: 'unauthorized' }, { status: 401 })
}

/** Guard for the cron-facing poll endpoint. */
export function requireCronSecret(request: Request): Response | null {
  const expected = process.env.CRON_SECRET
  if (!expected) return Response.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  const url = new URL(request.url)
  const provided =
    request.headers.get('x-cron-secret') ??
    request.headers.get('authorization')?.replace(/^Bearer /, '') ??
    url.searchParams.get('key') ??
    ''
  if (provided && safeEq(provided, expected)) return null
  return Response.json({ error: 'unauthorized' }, { status: 401 })
}
