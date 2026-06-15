import { ProductsLayout } from '@/features/products/products-layout'

/* ── Shared product page illustration component ──
 * Replaces the old blue-gradient placeholder block with a polished
 * SiliconFlow-style graphic that fits each product's theme.
 */
function ProductIllustration({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{
      flex: '0 0 440px', height: 320, borderRadius: 20,
      background: 'linear-gradient(135deg, #0A1628 0%, #002060 40%, #004A8F 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,42,96,0.15)',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,128,192,0.15) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,128,192,0.1) 0%, transparent 70%)' }} />
      {/* Grid pattern overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>{icon}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: 1 }}>{subtitle}</div>
      </div>
    </div>
  )
}

export function BrandedIllustration(props: { icon: string; title: string; subtitle: string }) {
  return <ProductIllustration {...props} />
}
