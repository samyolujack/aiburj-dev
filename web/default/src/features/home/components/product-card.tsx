import { memo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { t } from 'i18next'

type ProductCardProps = {
  title: string
  desc: string
  img: string
  tag: string
  href: string
  index: number
}

export const ProductCard = memo(function ProductCard({ title, desc, img, tag, href, index }: ProductCardProps) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        background: '#fff', borderRadius: 18,
        padding: index < 3 ? '44px 34px 40px' : '36px 28px',
        border: '1px solid #D5D6EA',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,74,143,0.08), 0 4px 12px rgba(0,74,143,0.04)'
        e.currentTarget.style.borderColor = 'rgba(0,74,143,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#D5D6EA'
      }}
      onClick={() => navigate({ to: href })}
    >
      <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,74,143,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 22, borderRadius: 12, overflow: 'hidden', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F7FF' }}>
          <img src={img} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#004A8F', background: 'rgba(0,74,143,0.06)', padding: '4px 14px', borderRadius: 6, display: 'inline-block', marginBottom: 14 }}>{tag}</span>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#252736', marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#4A6A8A', lineHeight: 1.8, marginBottom: 18 }}>{desc}</p>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#004A8F', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {t("了解更多")} <ChevronRight size={15} />
        </span>
      </div>
    </div>
  )
})
