import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getCurrencyLabel, isCurrencyDisplayEnabled } from '@/lib/currency'
import { formatNumber, formatQuota } from '@/lib/format'
import { computeTimeRange } from '@/lib/time'
import { cn } from '@/lib/utils'
import { useStatus } from '@/hooks/use-status'
import { Main } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { getUserQuotaDates } from '@/features/dashboard/api'
import type { QuotaDataItem } from '@/features/dashboard/types'
import { StatCard } from '@/features/dashboard/components/ui/stat-card'

export const Route = createFileRoute('/_authenticated/billing/')({
  component: BillingPage,
})

type Period = '7d' | '30d' | '90d'

const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 }

function BillingPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.auth.user)
  const { status, loading: statusLoading } = useStatus()
  const [period, setPeriod] = useState<Period>('30d')

  const currencyEnabledFromStore = isCurrencyDisplayEnabled()
  const statusCurrencyFlag =
    typeof status?.display_in_currency === 'boolean'
      ? Boolean(status.display_in_currency)
      : undefined
  const currencyEnabled =
    statusCurrencyFlag !== undefined
      ? statusCurrencyFlag
      : currencyEnabledFromStore
  const currencyLabel = currencyEnabled ? getCurrencyLabel() : 'Tokens'

  const timeRange = useMemo(
    () => computeTimeRange(PERIOD_DAYS[period]),
    [period]
  )

  const quotaQuery = useQuery({
    queryKey: ['billing', period, timeRange.start_timestamp, timeRange.end_timestamp],
    queryFn: () =>
      getUserQuotaDates({
        start_timestamp: timeRange.start_timestamp,
        end_timestamp: timeRange.end_timestamp,
        default_time: period === '7d' ? 'hour' : 'day',
      }),
    staleTime: 60_000,
  })

  const records = useMemo<QuotaDataItem[]>(
    () => quotaQuery.data?.data ?? [],
    [quotaQuery.data]
  )

  const totalSpent = useMemo(
    () => records.reduce((sum, r) => sum + (Number(r.quota) || 0), 0),
    [records]
  )
  const totalRequests = useMemo(
    () => records.reduce((sum, r) => sum + (Number(r.count) || 0), 0),
    [records]
  )
  const avgDailySpend =
    PERIOD_DAYS[period] > 0 ? totalSpent / PERIOD_DAYS[period] : 0

  const remainQuota = Number(user?.quota ?? 0)
  const usedQuota = Number(user?.used_quota ?? 0)

  const dailySparkline = useMemo(() => {
    const days = PERIOD_DAYS[period]
    const buckets = Array.from({ length: Math.min(days, 30) }, () => 0)
    const dayMs = 86_400_000
    for (const r of records) {
      const ts = Number(r.created_at) || 0
      const ageDays = Math.floor((Date.now() / 1000 - ts) / 86_400)
      const idx = buckets.length - 1 - ageDays
      if (idx >= 0 && idx < buckets.length) {
        buckets[idx] += Number(r.quota) || 0
      }
    }
    return buckets
  }, [records, period])

  return (
    <Main>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('费用明细')}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('查看消费记录与费用统计')}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border bg-card p-0.5">
            {(['7d', '30d', '90d'] as Period[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setPeriod(p)}
              >
                {p === '7d' ? t('7 天') : p === '30d' ? t('30 天') : t('90 天')}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem
            icon={TrendingDown}
            label={t('周期消费')}
            value={formatQuota(totalSpent)}
            sub={`${currencyLabel}`}
            loading={quotaQuery.isLoading}
          />
          <SummaryItem
            icon={Zap}
            label={t('日均消费')}
            value={formatQuota(avgDailySpend)}
            sub={`${currencyLabel} / ${t('天')}`}
            loading={quotaQuery.isLoading}
          />
          <SummaryItem
            icon={Wallet}
            label={t('剩余额度')}
            value={formatQuota(remainQuota)}
            sub={currencyLabel}
            loading={statusLoading}
          />
          <SummaryItem
            icon={TrendingUp}
            label={t('请求次数')}
            value={formatNumber(totalRequests)}
            sub={t('次')}
            loading={quotaQuery.isLoading}
          />
        </div>

        {/* Sparkline chart (simple bars) */}
        {dailySparkline.length > 0 && (
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium">
              {t('每日消费趋势')} ({period})
            </h3>
            <div className="flex h-32 items-end gap-1">
              {dailySparkline.map((val, i) => {
                const max = Math.max(...dailySparkline, 1)
                const pct = Math.max(4, (val / max) * 100)
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-[#0080C0]"
                    style={{ height: `${pct}%`, opacity: 0.3 + (val / max) * 0.7 }}
                    title={`${formatQuota(val)}`}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Recent transactions table */}
        {records.length > 0 ? (
          <div className="rounded-xl border bg-card">
            <div className="border-b px-5 py-3">
              <h3 className="text-sm font-medium">{t('消费记录')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="px-5 py-2.5 text-left text-xs font-medium">
                      {t('时间')}
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium">
                      {t('消费额度')}
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium">
                      {t('请求次数')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 50).map((r, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-5 py-2.5 text-muted-foreground text-xs">
                        {new Date(
                          (Number(r.created_at) || 0) * 1000
                        ).toLocaleString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono text-xs tabular-nums">
                        {formatQuota(Number(r.quota) || 0)}
                      </td>
                      <td className="px-5 py-2.5 text-right text-xs tabular-nums text-muted-foreground">
                        {formatNumber(Number(r.count) || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border bg-card py-12 text-center">
            <p className="text-muted-foreground text-sm">
              {t('暂无消费记录')}
            </p>
          </div>
        )}
      </div>
    </Main>
  )
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  sub,
  loading,
}: {
  icon: LucideIcon
  label: string
  value: string
  sub: string
  loading?: boolean
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#0080C0]/[0.08]">
          <Icon className="size-4 text-[#0080C0]" />
        </div>
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
      </div>
      <div className="font-mono text-xl font-semibold tracking-tight tabular-nums">
        {loading ? '--' : value}
      </div>
      <div className="text-muted-foreground mt-1 text-xs">{sub}</div>
    </div>
  )
}
