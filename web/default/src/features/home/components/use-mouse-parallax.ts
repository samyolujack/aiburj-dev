import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Tracks mouse position relative to viewport center,
 * returns spring-animated x/y values for parallax effects.
 * Range: -1 to 1 (normalized from center)
 */
export function useMouseParallax() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 30 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2  // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x * 40)  // max ±40px
      mouseY.set(y * 40)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  return { smoothX, smoothY }
}
