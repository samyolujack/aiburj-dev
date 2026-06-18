import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Copy, Gift, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { formatQuota } from '@/lib/format'
import { Main } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/activity/invites')({
  component: InvitesPage,
})

function InvitesPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.auth.user)

  const affCode = user?.aff_code ?? ''
  const affCount = Number(user?.aff_count ?? 0)
  const affQuota = Number(user?.aff_quota ?? 0)
  const affHistoryQuota = Number(user?.aff_history_quota ?? 0)
  const referralLink = affCode
    ? `${window.location.origin}/sign-up?aff=${affCode}`
    : ''

  const handleCopy = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink).then(() => {
      toast.success(t('已复制推荐链接'))
    })
  }

  return (
    <Main>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('邀请记录')}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('查看邀请详情与奖励记录')}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#0080C0]/[0.08]">
                <Users className="size-4 text-[#0080C0]" />
              </div>
              <span className="text-muted-foreground text-xs font-medium">
                {t('成功邀请')}
              </span>
            </div>
            <div className="font-mono text-xl font-semibold tabular-nums">
              {affCount}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">{t('人')}</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#0080C0]/[0.08]">
                <Gift className="size-4 text-[#0080C0]" />
              </div>
              <span className="text-muted-foreground text-xs font-medium">
                {t('累计奖励')}
              </span>
            </div>
            <div className="font-mono text-xl font-semibold tabular-nums">
              {formatQuota(affHistoryQuota)}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">{t('额度')}</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#0080C0]/[0.08]">
                <Gift className="size-4 text-[#0080C0]" />
              </div>
              <span className="text-muted-foreground text-xs font-medium">
                {t('可用奖励')}
              </span>
            </div>
            <div className="font-mono text-xl font-semibold tabular-nums">
              {formatQuota(affQuota)}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">{t('额度')}</div>
          </div>
        </div>

        {/* Referral link */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-3 text-sm font-medium">{t('我的推荐链接')}</h3>
          <div className="flex items-center gap-2">
            <code className="bg-muted flex-1 truncate rounded-lg px-3 py-2 text-sm">
              {referralLink || t('暂无推荐码')}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!affCode}
            >
              <Copy className="size-4" />
              <span className="ml-1.5">{t('复制')}</span>
            </Button>
          </div>
        </div>
      </div>
    </Main>
  )
}
