import { LazyMotion, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Loads only the `domAnimation` feature bundle (~15kb) and enforces use of the
 * lightweight `m` component (`strict` throws if `motion.*` is used), keeping the
 * initial motion payload tiny. Wrap the app once at the root.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
