import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

type SectionHeaderProps = {
  icon: LucideIcon
  badge: string
  title: string
  desc?: string
  descMaxWidth?: number
}

export function SectionHeader({ icon: Icon, badge, title, desc, descMaxWidth = 580 }: SectionHeaderProps) {
  return (
    <motion.div
      className="home-section-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', marginBottom: 56 }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(0,74,143,0.05)', borderRadius: 50,
        padding: '6px 20px', fontSize: 13, fontWeight: 600,
        color: '#004A8F', marginBottom: 24,
      }}>
        <Icon size={14} /> {badge}
      </div>
      <h2 style={{
        fontSize: 48, fontWeight: 700, color: '#252736',
        marginBottom: 20,
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>
      {/* 标题装饰渐变短线 */}
      <div style={{
        width: 60, height: 3,
        borderRadius: 2,
        background: 'linear-gradient(90deg, #004A8F, #0080C0)',
        margin: '0 auto 24px',
      }} />
      {desc && (
        <p style={{
          fontSize: 17, color: '#4A6A8A',
          maxWidth: descMaxWidth, margin: '0 auto',
          lineHeight: 1.75,
        }}>
          {desc}
        </p>
      )}
    </motion.div>
  )
}
