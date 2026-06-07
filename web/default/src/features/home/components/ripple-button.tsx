import { useState, useCallback, type MouseEvent, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type RippleButtonProps = {
  children: ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: (e: MouseEvent) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
}

type Ripple = { id: number; x: number; y: number }

let rippleId = 0

export function RippleButton({ children, style, className, onClick, onMouseEnter, onMouseLeave }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = useCallback((e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++rippleId
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)
    onClick?.(e)
  }, [onClick])

  return (
    <button
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        border: 'none', cursor: 'pointer',
        ...style,
      }}
      className={className}
    >
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: r.x - 10,
              top: r.y - 10,
              width: 20, height: 20,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  )
}
