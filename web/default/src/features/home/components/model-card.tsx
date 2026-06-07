import { memo } from 'react'

type ModelCardProps = {
  logo: string
  name: string
  models: string
  desc: string
}

export const ModelCard = memo(function ModelCard({ logo, name, models, desc }: ModelCardProps) {
  return (
    <div
      style={{
        background: '#fff', borderRadius: 16, padding: '32px 28px 28px',
        border: '1px solid #E8ECF2', textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,74,143,0.1), 0 0 0 2px rgba(0,128,192,0.15)'
        e.currentTarget.style.borderColor = 'rgba(0,128,192,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#E8ECF2'
      }}
    >
      <div style={{ width: 56, height: 56, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: '#F8FAFC', border: '1px solid #EEF2F6' }}>
        <img src={logo} alt={name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#252736', marginBottom: 8 }}>{name}</h3>
      <p style={{ fontSize: 13, color: '#0080C0', fontWeight: 600, marginBottom: 8 }}>{models}</p>
      <p style={{ fontSize: 13, color: '#8098B0', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
})
