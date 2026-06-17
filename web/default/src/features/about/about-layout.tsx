import { PublicLayout } from '@/components/layout'

type LayoutProps = { children: React.ReactNode }

export function AboutLayout({ children }: LayoutProps) {
  return (
    <PublicLayout showMainContainer={false}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </PublicLayout>
  )
}
