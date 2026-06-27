import { useState, useEffect, useCallback } from 'react'
import type React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, FileText, Ban } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE } from '@/lib/roles'
import { Main } from '@/components/layout'
import { SectionPageLayout } from '@/components/layout/components/section-page-layout'

const SectionPageLayoutTitle = (SectionPageLayout as any).Title as React.FC<{ children: React.ReactNode }>
const SectionPageLayoutContent = (SectionPageLayout as any).Content as React.FC<{ children: React.ReactNode }>

export const Route = createFileRoute('/_authenticated/system-settings/invoices/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (auth.user?.role !== ROLE.SUPER_ADMIN) {
      throw redirect({ to: '/403' })
    }
  },
  component: InvoicesManagementPage,
})

type InvoiceItem = {
  id: number; user_id: number; username: string; type: string; title: string
  tax_id: string; amount: number; email: string; remark: string
  status: string; created_at: number; updated_at: number
}

const TYPE_LABELS: Record<string, string> = {
  personal: '个人', enterprise: '企业',
}

const STATUS_BADGE: Record<string, { label: string; icon: JSX.Element; className: string }> = {
  pending:  { label: '待审核', icon: <Clock className='w-3 h-3' />, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved: { label: '已通过', icon: <CheckCircle className='w-3 h-3' />, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  rejected: { label: '已驳回', icon: <Ban className='w-3 h-3' />, className: 'bg-red-50 text-red-700 border-red-200' },
  issued:   { label: '已开具', icon: <FileText className='w-3 h-3' />, className: 'bg-green-50 text-green-700 border-green-200' },
}

function InvoicesManagementPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<InvoiceItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (statusFilter) params.status = statusFilter
      const r = await api.get('/api/user/invoices', { params })
      if (r.data?.success) setInvoices(r.data.data || [])
    } catch {} finally { setLoading(false) }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: number, status: string) => {
    await api.put('/api/user/invoices', { id, status }).catch(() => {})
    load()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const fmtTime = (ts: number) => new Date(ts * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <Main>
      <SectionPageLayout>
        <SectionPageLayoutTitle>发票管理</SectionPageLayoutTitle>
        <SectionPageLayoutContent>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3 flex-wrap'>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className='h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#475569]'>
                <option value=''>全部状态</option>
                <option value='pending'>待审核</option>
                <option value='approved'>已通过</option>
                <option value='rejected'>已驳回</option>
                <option value='issued'>已开具</option>
              </select>
              <button onClick={load} className='ml-auto h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5'>
                <RefreshCw className='w-3.5 h-3.5' /> 刷新
              </button>
            </div>

            {loading && <div className='flex justify-center py-16'><Loader2 className='w-6 h-6 animate-spin text-[#94A3B8]' /></div>}

            {!loading && invoices.length === 0 && <div className='text-center py-16 text-[13px] text-[#94A3B8]'>暂无发票申请</div>}

            {!loading && invoices.length > 0 && (
              <div className='border border-[#E2E8F0] rounded-lg overflow-hidden'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-[#F8FAFC] border-b border-[#E2E8F0]'>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>ID</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>用户</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>类型</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>抬头</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>金额</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>状态</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>时间</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(inv => {
                      const badge = STATUS_BADGE[inv.status] || STATUS_BADGE.pending
                      return (
                        <tr key={inv.id} className='border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors' onClick={() => setSelected(inv)}>
                          <td className='px-4 py-3 text-[13px] text-[#475569] font-mono'>#{inv.id}</td>
                          <td className='px-4 py-3 text-[13px] text-[#475569]'>{inv.username || `用户${inv.user_id}`}</td>
                          <td className='px-4 py-3 text-[12px] text-[#64748B]'>{TYPE_LABELS[inv.type] || inv.type}</td>
                          <td className='px-4 py-3 text-[13px] text-[#1E293B] max-w-[200px] truncate'>{inv.title}</td>
                          <td className='px-4 py-3 text-[13px] text-[#475569] font-mono'>¥{inv.amount.toFixed(2)}</td>
                          <td className='px-4 py-3'>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${badge.className}`}>{badge.icon}{badge.label}</span>
                          </td>
                          <td className='px-4 py-3 text-[12px] text-[#94A3B8]'>{fmtTime(inv.created_at)}</td>
                          <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                            <div className='flex items-center gap-1'>
                              {inv.status === 'pending' && <>
                                <button onClick={() => updateStatus(inv.id, 'approved')} className='px-2 py-1 rounded text-[11px] bg-blue-50 text-blue-600 hover:bg-blue-100'>通过</button>
                                <button onClick={() => updateStatus(inv.id, 'rejected')} className='px-2 py-1 rounded text-[11px] bg-red-50 text-red-600 hover:bg-red-100'>驳回</button>
                              </>}
                              {inv.status === 'approved' && <button onClick={() => updateStatus(inv.id, 'issued')} className='px-2 py-1 rounded text-[11px] bg-green-50 text-green-600 hover:bg-green-100'>开具</button>}
                              {inv.status === 'rejected' && <button onClick={() => updateStatus(inv.id, 'pending')} className='px-2 py-1 rounded text-[11px] bg-yellow-50 text-yellow-600 hover:bg-yellow-100'>重审</button>}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {selected && (
              <div className='border border-[#E2E8F0] rounded-lg p-6 bg-white'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-[16px] font-semibold text-[#1E293B]'>#{selected.id} - {selected.title}</h3>
                  <button onClick={() => setSelected(null)} className='text-[#94A3B8] hover:text-[#64748B]'><XCircle className='w-5 h-5' /></button>
                </div>
                <div className='grid grid-cols-3 gap-4 mb-4'>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>用户</p><p className='text-[13px] text-[#475569]'>{selected.username || `用户${selected.user_id}`}</p></div>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>类型</p><p className='text-[13px] text-[#475569]'>{TYPE_LABELS[selected.type] || selected.type}</p></div>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>金额</p><p className='text-[13px] text-[#475569] font-mono'>¥{selected.amount.toFixed(2)}</p></div>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>邮箱</p><p className='text-[13px] text-[#475569]'>{selected.email || '未填写'}</p></div>
                  {selected.tax_id && <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>税号</p><p className='text-[13px] text-[#475569] font-mono'>{selected.tax_id}</p></div>}
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>状态</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${(STATUS_BADGE[selected.status]||STATUS_BADGE.pending).className}`}>{(STATUS_BADGE[selected.status]||STATUS_BADGE.pending).icon}{(STATUS_BADGE[selected.status]||STATUS_BADGE.pending).label}</span>
                  </div>
                </div>
                {selected.remark && <div className='mb-4'><p className='text-[11px] text-[#94A3B8] font-medium mb-1'>备注</p><div className='bg-[#F8FAFC] rounded-lg p-4 text-[13px] text-[#475569]'>{selected.remark}</div></div>}
                <div className='flex items-center gap-2 pt-3 border-t border-[#F1F5F9]'>
                  <span className='text-[12px] text-[#94A3B8]'>操作：</span>
                  {selected.status === 'pending' && <>
                    <button onClick={() => updateStatus(selected.id, 'approved')} className='px-3 py-1.5 rounded-md text-[12px] bg-blue-500 text-white hover:bg-blue-600'>审核通过</button>
                    <button onClick={() => updateStatus(selected.id, 'rejected')} className='px-3 py-1.5 rounded-md text-[12px] bg-red-500 text-white hover:bg-red-600'>驳回</button>
                  </>}
                  {selected.status === 'approved' && <button onClick={() => updateStatus(selected.id, 'issued')} className='px-3 py-1.5 rounded-md text-[12px] bg-green-500 text-white hover:bg-green-600'>标记已开具</button>}
                </div>
              </div>
            )}
          </div>
        </SectionPageLayoutContent>
      </SectionPageLayout>
    </Main>
  )
}
