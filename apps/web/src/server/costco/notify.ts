/** Push notifications via ntfy (https://ntfy.sh) — topic string is the shared secret. */

export interface NtfyOptions {
  title?: string
  tags?: Array<string>
  priority?: 1 | 2 | 3 | 4 | 5
  clickUrl?: string
}

export function alertsConfigured(): boolean {
  return Boolean(process.env.NTFY_TOPIC)
}

export async function sendPush(
  message: string,
  opts: NtfyOptions = {},
): Promise<boolean> {
  const topic = process.env.NTFY_TOPIC
  if (!topic) return false
  const server = (process.env.NTFY_SERVER ?? 'https://ntfy.sh').replace(
    /\/$/,
    '',
  )
  const headers: Record<string, string> = {}
  // Header values must be Latin1 — emoji live in the body, not the title.
  if (opts.title)
    headers['X-Title'] = opts.title.replace(/[^\x20-\x7E]/g, '').trim()
  if (opts.tags?.length) headers['X-Tags'] = opts.tags.join(',')
  if (opts.priority) headers['X-Priority'] = String(opts.priority)
  if (opts.clickUrl) headers['X-Click'] = opts.clickUrl
  try {
    const res = await fetch(`${server}/${topic}`, {
      method: 'POST',
      headers,
      body: message,
    })
    return res.ok
  } catch {
    return false
  }
}
