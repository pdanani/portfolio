import { useState } from 'react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiError, costcoApi } from '#/lib/costco/api'

export const Route = createFileRoute('/costco')({
  head: () => ({
    meta: [
      { title: 'Warehouse Watch — Costco tracker' },
      {
        name: 'description',
        content:
          'Live Costco prices, deals, and per-warehouse stock — a subscription-free tracker built into this site.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: CostcoLayout,
})

const tabs = [
  { to: '/costco', label: 'Inventory', exact: true },
  { to: '/costco/warehouses', label: 'Warehouses', exact: false },
  { to: '/costco/alerts', label: 'Alerts', exact: false },
] as const

function CostcoLayout() {
  const session = useQuery({
    queryKey: ['costco', 'session'],
    queryFn: async () => {
      try {
        await costcoApi.me()
        return true
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return false
        throw err
      }
    },
    retry: false,
    staleTime: Infinity,
  })

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-24 sm:px-6">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
              Warehouse&nbsp;Watch
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              Costco tracker
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Live prices, deals, and real per-warehouse stock — no subscription, no login to
              Costco.
            </p>
          </div>
          <Link
            to="/"
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← portfolio
          </Link>
        </header>

        {session.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : session.data === false ? (
          <LoginCard />
        ) : (
          <>
            <nav className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1 w-fit">
              {tabs.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  activeOptions={{ exact: t.exact }}
                  activeProps={{ className: 'bg-secondary text-foreground' }}
                  inactiveProps={{ className: 'text-muted-foreground hover:text-foreground' }}
                  className="rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </nav>
            <Outlet />
          </>
        )}
      </div>
    </main>
  )
}

function LoginCard() {
  const queryClient = useQueryClient()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await costcoApi.login(password)
      queryClient.setQueryData(['costco', 'session'], true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-16 flex w-full max-w-sm flex-col gap-3 rounded-xl border border-border bg-card p-6"
    >
      <h2 className="font-display text-lg font-semibold">Sign in</h2>
      <p className="text-sm text-muted-foreground">This tool is private — one password.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={busy || !password}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
