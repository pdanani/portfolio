/**
 * Lightweight CSS aurora background (replaces the old Three.js/Vanta waves).
 * All animation lives in styles.css (GPU transforms) and freezes under
 * prefers-reduced-motion via the global safety net. Pure decoration.
 */
export function Aurora() {
  return (
    <div aria-hidden className="aurora">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
      <div className="aurora__grain" />
    </div>
  )
}
