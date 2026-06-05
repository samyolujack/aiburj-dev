import { Link, useRouterState } from '@tanstack/react-router'
import { PublicLayout } from '@/components/layout'

const navItems = [
  { title: '公司介绍', href: '/about' },
  { title: '品牌理念', href: '/about/brand' },
  { title: '资讯动态', href: '/about/news' },
]

type AboutLayoutProps = { children: React.ReactNode }

export function AboutLayout({ children }: AboutLayoutProps) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <PublicLayout showMainContainer={false}>
      <section style={{ background: '#F4F8FC', minHeight: '100vh', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Sub nav */}
          <div style={{ display: 'flex', gap: 40, marginBottom: 48, borderBottom: '1px solid #D5D6EA', paddingBottom: 16 }}>
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.href}
                style={{
                  fontSize: 16, fontWeight: pathname === item.href ? 700 : 400,
                  color: pathname === item.href ? '#004A8F' : '#64748B',
                  textDecoration: 'none',
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
