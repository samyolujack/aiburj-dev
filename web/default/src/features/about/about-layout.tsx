import { PublicLayout } from '@/components/layout'

type AboutLayoutProps = { children: React.ReactNode }

export function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <PublicLayout showMainContainer={false}>
      {children}
    </PublicLayout>
  )
}
