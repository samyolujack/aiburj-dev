import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout'
import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/_authenticated/billing/')({
  component: BillingPage,
})

function BillingPage() {
  return (
    <Main>
      <PagePlaceholder
        icon="receipt"
        title="费用明细"
        description="消费记录与费用统计，即将上线"
      />
    </Main>
  )
}
