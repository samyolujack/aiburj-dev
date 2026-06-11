import { Link, useRouterState } from '@tanstack/react-router'
import { PublicLayout } from '@/components/layout'

const navItems = [
  { title: '大模型 API 服务', href: '/products/api' },
  { title: 'AI 算力运营', href: '/products/compute' },
  { title: '预留实例', href: '/products/reserved' },
  { title: '私有化部署', href: '/products/private' },
  { title: 'API 网关', href: '/products/gateway' },
]

type ProductsLayoutProps = { children: React.ReactNode }

export function ProductsLayout({ children }: ProductsLayoutProps) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <PublicLayout showMainContainer={false}>
      <section style={{ background: '#F4F8FC', minHeight: '100vh', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Sub nav */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 48, borderBottom: '1px solid #D5D6EA', paddingBottom: 16, overflowX: 'auto' }}>
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.href}
                style={{
                  fontSize: 15, fontWeight: pathname === item.href ? 700 : 400,
                  color: pathname === item.href ? '#004A8F' : '#64748B',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  paddingBottom: 16, marginBottom: -17,
                  borderBottom: pathname === item.href ? '2px solid #004A8F' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {item.title}
              </Link>
            ))}
          </div>
          {/* Content */}
          {children}
        </div>
      </section>
    </PublicLayout>
  )
}
