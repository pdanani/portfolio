/**
 * Shared trigger for scroll reveals (Reveal, StaggerGroup): fire as soon as
 * any of the element crosses a line 12% up from the bottom of the viewport.
 *
 * Deliberately NOT a fraction of the element (`amount: 0.3` etc.). A
 * fraction threshold is unreachable for blocks taller than the viewport —
 * on an iPhone the About text + stickers is ~1000px, so after "About me"
 * landed on the section only ~200px of it showed, under the old 30%, and
 * nothing rendered until Safari's toolbar collapsed on the first scroll and
 * nudged it over. Viewport-relative means every block, whatever its height,
 * reveals the moment it's actually on screen.
 */
export const IN_VIEW = {
  amount: 'some',
  margin: '0px 0px -12% 0px',
} as const
