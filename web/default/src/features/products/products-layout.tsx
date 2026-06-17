import { PublicLayout } from '@/components/layout'

type ProductsLayoutProps = { children: React.ReactNode }

export function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <PublicLayout showMainContainer={false}>
      {children}
    </PublicLayout>
  )
}
