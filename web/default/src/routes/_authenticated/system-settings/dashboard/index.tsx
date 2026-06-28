import { useEffect, useState } from 'react'
import type React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Users, TrendingUp, Ticket, FileText, Activity, Zap, BarChart3, UserPlus, DollarSign, MessageSquare } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE } from '@/lib/roles'
import { Main } from '@/components/layout'
import { SectionPageLayout } from '@/components/layout/components/section-page-layout'

const SP = SectionPageLayout as any
const SPT = SP.Title as React.FC<{ children: React.ReactNode }>
const SPC = SP.Content as React.FC<{ children: React.ReactNode }>

export const Route = createFileRoute('/_authenticated/system-settings/dashboard/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (auth.user?.role !== ROLE.SUPER_ADMIN) throw redirect({ to: '/403' })
  },
  component: AdminDashboard,
})

type DailyPoint = { date: string; quota: number }
type ModelRank = { model: string; quota: number; count: number }
type Stats = {
  total_users: number; today_new_users: number; month_new_users: number
  active_users: number
  total_consumption: number; today_consumption: number; month_consumption: number
  total_requests: number; open_tickets: number; pending_invoices: number
  daily_trend: DailyPoint[]; top_models: ModelRank[]
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/user/stats').then(r => {
      if (r.data?.success) setStats(r.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const quotaToYuan = (q: number) => (q / 10000).toFixed(2)

  if (loading) return (
    <Main>
      <SectionPageLayout>
        <SPT>运营看板</SPT>
        <SPC><div className='flex justify-center py-20'><div className='w-8 h-8 border-2 border-[#004A8F] border-t-transparent rounded-full animate-spin' /></div></SPC>
      </SectionPageLayout>
    </Main>
  )

  if (!stats) return null

  const maxTrend = Math.max(...stats.daily_trend.map(d => d.quota), 1)

  return (
    <Main>
      <SectionPageLayout>
        <SPT>运营看板</SPT>
        <SPC>
          <div className='space-y-6'>

            {/* Main stats cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              <BigCard icon={<Users className='w-5 h-5' />} label='总用户数' value={stats.total_users.toLocaleString()} sub={`本月新增 ${stats.month_new_users}`} color='blue' />
              <BigCard icon={<Activity className='w-5 h-5' />} label='活跃用户' value={stats.active_users.toLocaleString()} sub='近 7 天有登录' color='green' />
              <BigCard icon={<DollarSign className='w-5 h-5' />} label='累计消费' value={`¥${quotaToYuan(stats.total_consumption)}`} sub={`今日 ¥${quotaToYuan(stats.today_consumption)}`} color='purple' />
              <BigCard icon={<Zap className='w-5 h-5' />} label='总请求数' value={stats.total_requests.toLocaleString()} sub={`本月 ¥${quotaToYuan(stats.month_consumption)}`} color='amber' />
            </div>

            {/* Quick metrics */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
              <SmallCard icon={<UserPlus className='w-4 h-4' />} label='今日新增用户' value={stats.today_new_users} color='blue' />
              <SmallCard icon={<TrendingUp className='w-4 h-4' />} label='今日消费' value={`¥${quotaToYuan(stats.today_consumption)}`} color='purple' />
              <SmallCard icon={<Ticket className='w-4 h-4' />} label='待处理工单' value={stats.open_tickets} color={stats.open_tickets > 0 ? 'red' : 'green'} />
              <SmallCard icon={<FileText className='w-4 h-4' />} label='待审核发票' value={stats.pending_invoices} color={stats.pending_invoices > 0 ? 'red' : 'green'} />
            </div>

            {/* Charts row */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
              {/* Consumption trend */}
              <div className='lg:col-span-3 bg-white rounded-xl border border-[#E2E8F0] p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <BarChart3 className='w-4 h-4 text-[#64748B]' />
                  <h3 className='text-[13px] font-semibold text-[#475569]'>近 7 天消费趋势</h3>
                </div>
                <div className='flex items-end gap-3 h-40'>
                  {stats.daily_trend.map((d, i) => (
                    <div key={i} className='flex-1 flex flex-col items-center gap-1.5 h-full justify-end'>
                      <span className='text-[10px] text-[#94A3B8] font-mono'>¥{quotaToYuan(d.quota)}</span>
                      <div
                        className='w-full rounded-t-md bg-gradient-to-t from-[#004A8F] to-[#3388CC] transition-all duration-300 min-h-[4px]'
                        style={{ height: `${(d.quota / maxTrend) * 100}%` }}
                      />
                      <span className='text-[10px] text-[#94A3B8]'>{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top models */}
              <div className='lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Zap className='w-4 h-4 text-[#64748B]' />
                  <h3 className='text-[13px] font-semibold text-[#475569]'>模型消耗 Top 10</h3>
                </div>
                <div className='space-y-2'>
                  {stats.top_models.map((m, i) => (
                    <div key={i} className='flex items-center gap-3 py-1.5'>
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${i < 3 ? 'bg-[#004A8F]' : 'bg-[#94A3B8]'}`}>
                        {i + 1}
                      </span>
                      <span className='flex-1 text-[12px] text-[#475569] truncate'>{m.model}</span>
                      <span className='text-[12px] font-mono text-[#64748B]'>¥{quotaToYuan(m.quota)}</span>
                    </div>
                  ))}
                  {stats.top_models.length === 0 && (
                    <p className='text-[13px] text-[#94A3B8] text-center py-6'>暂无数据</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </SPC>
      </SectionPageLayout>
    </Main>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────

function BigCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-[#EEF2FF] to-white border-[#C7D2FE]',
    green: 'from-[#ECFDF5] to-white border-[#A7F3D0]',
    purple: 'from-[#F5F3FF] to-white border-[#DDD6FE]',
    amber: 'from-[#FFFBEB] to-white border-[#FDE68A]',
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colors[color] || colors.blue} p-5`}>
      <div className='flex items-center gap-2 mb-3 text-[#64748B]'>{icon}<span className='text-[12px] font-medium'>{label}</span></div>
      <p className='text-[24px] font-bold text-[#1E293B]'>{value}</p>
      <p className='text-[11px] text-[#94A3B8] mt-1'>{sub}</p>
    </div>
  )
}

function SmallCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const icons: Record<string, string> = {
    blue: 'bg-[#EEF2FF] text-[#4D6BFE]',
    purple: 'bg-[#F5F3FF] text-[#7C3AED]',
    red: 'bg-[#FEF2F2] text-[#EF4444]',
    green: 'bg-[#ECFDF5] text-[#059669]',
  }
  return (
    <div className='bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3'>
      <div className={`flex size-10 items-center justify-center rounded-lg ${icons[color] || icons.blue}`}>
        {icon}
      </div>
      <div>
        <p className='text-[11px] text-[#94A3B8]'>{label}</p>
        <p className='text-[16px] font-bold text-[#1E293B]'>{value}</p>
      </div>
    </div>
  )
}
