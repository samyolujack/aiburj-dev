import { type LucideIcon } from 'lucide-react'

type SectionHeaderProps = {
  icon: LucideIcon
  badge: string
  title: string
  desc?: string
  descMaxWidth?: number
}

export function SectionHeader({ icon: Icon, badge, title, desc, descMaxWidth = 580 }: SectionHeaderProps) {
  return (
    <div className="home-section-heading" style={{ textAlign: 'center', marginBottom: 56 }}>
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
        marginBottom: desc ? 66 : 0,
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>
      {desc && (
        <p style={{
          fontSize: 17, color: '#4A6A8A',
          maxWidth: descMaxWidth, margin: '0 auto',
          lineHeight: 1.75,
        }}>
          {desc}
        </p>
      )}
    </div>
  )
}
