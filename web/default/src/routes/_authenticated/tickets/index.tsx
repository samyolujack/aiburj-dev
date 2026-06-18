import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout'
import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/_authenticated/tickets/')({
  component: TicketsPage,
})

function TicketsPage() {
  return (
    <Main>
      <PagePlaceholder
        icon="ticket"
        title="工单反馈"
        description="提交反馈与问题工单，即将上线"
      />
    </Main>
  )
}
