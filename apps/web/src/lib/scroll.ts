import type { MouseEvent } from 'react'

/**
 * Smooth-scrolls to an in-page anchor without leaving a #hash in the URL.
 * A stale hash makes the browser re-scroll to it on every reload, fighting
 * the router's scroll restoration (a visible glide-and-rebound). Without
 * JS the anchor falls back to the browser's default jump; honours
 * prefers-reduced-motion.
 */
export function scrollToAnchor(event: MouseEvent<HTMLAnchorElement>) {
  const id = event.currentTarget.getAttribute('href')?.slice(1)
  const target = id ? document.getElementById(id) : null
  if (!target) return // unknown target: let the browser handle it
  event.preventDefault()
  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  })
}
