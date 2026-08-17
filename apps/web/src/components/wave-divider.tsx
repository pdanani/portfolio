/** A quiet swell line between sections — the theme carried at 10% volume. */
export function WaveDivider() {
  return (
    <div aria-hidden className="mx-auto max-w-5xl px-6">
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="h-6 w-full text-brand-amber/20 sm:h-8"
      >
        <path
          d="M0 24 C 120 40, 240 8, 360 24 S 600 40, 720 24 S 960 8, 1080 24 S 1320 40, 1440 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
