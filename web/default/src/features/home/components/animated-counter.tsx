import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type AnimatedCounterProps = {
  value: string   // e.g. "16+", "99.9%", "100%"
  duration?: number
}

export function AnimatedCounter({ value, duration = 1.8 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [displayValue, setDisplayValue] = useState(value)
  const [started, setStarted] = useState(false)

  // Parse numeric part and suffix
  const match = value.match(/^([\d.]+)(.*)$/)
  const numericPart = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (!inView || started) return
    setStarted(true)
    setDisplayValue('0')
    const steps = 40
    const interval = (duration * 1000) / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numericPart * eased
      // Handle decimal places
      if (numericPart % 1 !== 0) {
        setDisplayValue(current.toFixed(1) + suffix)
      } else {
        setDisplayValue(Math.floor(current) + suffix)
      }
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      }
    }, interval)
    return () => clearInterval(timer)
  }, [inView, numericPart, suffix, duration, value])

  return (
    <motion.span
      ref={ref}
      style={{
        fontSize: 44, fontWeight: 900,
        background: 'linear-gradient(135deg, #004A8F, #0080C0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.span>
  )
}
