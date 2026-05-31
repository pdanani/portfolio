import { createFileRoute } from '@tanstack/react-router'
import { useKit } from '#/lib/kit-context'
import { CONCEPTS } from '#/components/concepts'

export const Route = createFileRoute('/')({ component: Home })

/**
 * Home renders the hero concept for the active kit. Each concept is a distinct
 * layout (terminal window, magazine, brutalist, HUD, …), not a recolor of one
 * template. Locking a kit later means rendering its concept directly.
 */
function Home() {
  const { kit } = useKit()
  const Concept = CONCEPTS[kit] ?? CONCEPTS.aurora
  return <Concept />
}
