import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout'
import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/_authenticated/invoice/')({
  component: InvoicePage,
})

function InvoicePage() {
  return (
    <Main>
      <PagePlaceholder
        icon="invoice"
        title="发票开具"
        description="在线申请发票，即将上线"
      />
    </Main>
  )
}
