import { useEffect, useState } from 'react'
import { X, Mail, Shield, Key, Ticket, FileText, Coins, Calendar, Clock, TrendingUp, User as UserIcon } from 'lucide-react'
import { api } from '@/lib/api'

interface UserDetailData {
  user: {
    id: number; username: string; email: string; display_name: string
    role: number; status: number; quota: number; used_quota: number
    request_count: number; group: string; created_at: number; last_login: number
  }
  verified: boolean
  verification: { real_name: string; status: number } | null
  ticket_total: number; ticket_open: number
  invoice_total: number; invoice_pending: number
  key_count: number
  recent_consumption: number; total_consumption: number
}

interface UserDetailDrawerProps {
  userId: number | null
  onClose: () => void
}

const ROLE_LABELS: Record<number, string> = {
  1: '普通用户', 10: '管理员', 100: '超级管理员',
}

export function UserDetailDrawer({ userId, onClose }: UserDetailDrawerProps) {
  const [data, setData] = useState<UserDetailData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    api.get(`/api/user/${userId}/detail`).then(r => {
      if (r.data?.success) setData(r.data.data)
    }).finally(() => setLoading(false))
  }, [userId])

  if (!userId) return null

  const u = data?.user
  const role = u ? (ROLE_LABELS[u.role] || '未知') : ''
  const statusText = u?.status === 1 ? '已启用' : '已禁用'

  return (
    <div className='fixed inset-0 z-50 flex justify-end'>
      <div className='absolute inset-0 bg-black/20' onClick={onClose} />

      <div className='relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E8F0]'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#004A8F] to-[#0066CC] text-white font-bold text-lg'>
              {u?.display_name?.[0] || u?.username?.[0] || '?'}
            </div>
            <div>
              <h3 className='text-[16px] font-semibold text-[#1E293B]'>
                {u?.display_name || u?.username || `用户#${userId}`}
              </h3>
              <p className='text-[12px] text-[#94A3B8]'>{role} · {statusText}</p>
            </div>
          </div>
          <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#64748B] transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {loading && (
          <div className='flex items-center justify-center py-20'>
            <div className='w-8 h-8 border-2 border-[#004A8F] border-t-transparent rounded-full animate-spin' />
          </div>
        )}

        {!loading && data && (
          <div className='px-6 py-6 space-y-5'>

            {/* Quick stats grid */}
            <div className='grid grid-cols-2 gap-3'>
              <StatCard icon={<Coins className='w-4 h-4' />} label='余额/额度' value={`¥${((data.user.quota || 0) / 10000).toFixed(2)}`} color='blue' />
              <StatCard icon={<TrendingUp className='w-4 h-4' />} label='累计消费' value={`¥${((data.total_consumption || 0) / 10000).toFixed(2)}`} color='purple' />
              <StatCard icon={<Calendar className='w-4 h-4' />} label='近30天消费' value={`¥${((data.recent_consumption || 0) / 10000).toFixed(2)}`} color='amber' />
              <StatCard icon={<Key className='w-4 h-4' />} label='API 密钥' value={`${data.key_count || 0}`} color='green' />
            </div>

            {/* Basic info */}
            <Section title='基本信息' icon={<UserIcon className='w-4 h-4' />}>
              <InfoRow label='用户名' value={u?.username || '-'} />
              <InfoRow label='邮箱' value={u?.email || '-'} />
              <InfoRow label='分组' value={u?.group || 'default'} />
              <InfoRow label='角色' value={role} />
              <InfoRow label='注册时间' value={u?.created_at ? new Date(u.created_at * 1000).toLocaleString('zh-CN') : '-'} />
              <InfoRow label='最后登录' value={u?.last_login ? new Date(u.last_login * 1000).toLocaleString('zh-CN') : '从未登录'} />
            </Section>

            {/* Verification */}
            <Section title='实名认证' icon={<Shield className='w-4 h-4' />}>
              {data.verification ? (
                <>
                  <InfoRow label='真实姓名' value={data.verification.real_name} />
                  <InfoRow label='状态' value={
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${data.verification.status === 1 ? 'bg-green-50 text-green-700 border border-green-200' : data.verification.status === 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {data.verification.status === 1 ? '✓ 已认证' : data.verification.status === 0 ? '⏳ 待审核' : '✗ 未通过'}
                    </span>
                  } />
                </>
              ) : (
                <p className='text-[13px] text-[#94A3B8] py-2'>未提交实名认证</p>
              )}
            </Section>

            {/* Tickets & Invoices */}
            <Section title='工单与发票' icon={<Ticket className='w-4 h-4' />}>
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-[#F8FAFC] rounded-lg p-3 text-center'>
                  <p className='text-[22px] font-bold text-[#475569]'>{data.ticket_total}</p>
                  <p className='text-[11px] text-[#94A3B8]'>工单总数</p>
                  {data.ticket_open > 0 && <p className='text-[11px] text-amber-600 mt-0.5'>待处理: {data.ticket_open}</p>}
                </div>
                <div className='bg-[#F8FAFC] rounded-lg p-3 text-center'>
                  <p className='text-[22px] font-bold text-[#475569]'>{data.invoice_total}</p>
                  <p className='text-[11px] text-[#94A3B8]'>发票总数</p>
                  {data.invoice_pending > 0 && <p className='text-[11px] text-amber-600 mt-0.5'>待处理: {data.invoice_pending}</p>}
                </div>
              </div>
            </Section>

          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3 text-[13px] font-semibold text-[#475569]'>
        <span className='text-[#64748B]'>{icon}</span>
        {title}
      </div>
      <div className='bg-[#F8FAFC] rounded-xl p-4 space-y-2'>
        {children}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between py-1'>
      <span className='text-[12px] text-[#94A3B8]'>{label}</span>
      <span className='text-[13px] text-[#475569] font-medium'>{value}</span>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-[#EEF2FF] text-[#4D6BFE]',
    green: 'bg-[#ECFDF5] text-[#059669]',
    amber: 'bg-[#FFFBEB] text-[#D97706]',
    purple: 'bg-[#F5F3FF] text-[#7C3AED]',
  }
  return (
    <div className={`rounded-xl p-4 ${colors[color] || colors.blue} bg-opacity-50`}>
      <div className='flex items-center gap-2 mb-2'>
        {icon}
        <span className='text-[11px] font-medium opacity-70'>{label}</span>
      </div>
      <p className='text-[18px] font-bold'>{value}</p>
    </div>
  )
}
