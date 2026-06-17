import { PublicLayout } from '@/components/layout'

type LayoutProps = { children: React.ReactNode }

export function ProductsLayout({ children }: LayoutProps) {
  return (
    <PublicLayout showMainContainer={false}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </PublicLayout>
  )
}
