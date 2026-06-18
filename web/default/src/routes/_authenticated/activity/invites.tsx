import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout'
import { PagePlaceholder } from '@/components/page-placeholder'

export const Route = createFileRoute('/_authenticated/activity/invites')({
  component: InvitesPage,
})

function InvitesPage() {
  return (
    <Main>
      <PagePlaceholder
        icon="users"
        title="邀请记录"
        description="查看邀请详情与奖励记录，即将上线"
      />
    </Main>
  )
}
