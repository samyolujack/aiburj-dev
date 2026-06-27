import { useState, useEffect, useCallback } from 'react'
import type React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE } from '@/lib/roles'
import { Main } from '@/components/layout'
import { SectionPageLayout } from '@/components/layout/components/section-page-layout'

// Compound components provided by SectionPageLayout
const SectionPageLayoutTitle = (SectionPageLayout as any).Title as React.FC<{ children: React.ReactNode }>
const SectionPageLayoutContent = (SectionPageLayout as any).Content as React.FC<{ children: React.ReactNode }>

export const Route = createFileRoute('/_authenticated/system-settings/tickets/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (auth.user?.role !== ROLE.SUPER_ADMIN) {
      throw redirect({ to: '/403' })
    }
  },
  component: TicketsManagementPage,
})

type TicketItem = {
  id: number
  user_id: number
  username: string
  type: string
  subject: string
  description: string
  contact: string
  status: string
  created_at: number
  updated_at: number
}

const TYPE_LABELS: Record<string, string> = {
  bug: 'Bug 反馈',
  feature: '功能建议',
  question: '咨询',
  other: '其他',
}

const STATUS_BADGE: Record<string, { label: string; icon: JSX.Element; className: string }> = {
  open: { label: '待处理', icon: <Clock className='w-3 h-3' />, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  in_progress: { label: '处理中', icon: <RefreshCw className='w-3 h-3' />, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  closed: { label: '已关闭', icon: <CheckCircle className='w-3 h-3' />, className: 'bg-green-50 text-green-700 border-green-200' },
}

function TicketsManagementPage() {
  const { t } = useTranslation()
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null)

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = {}
      if (statusFilter) params.status = statusFilter
      if (typeFilter) params.type = typeFilter
      const r = await api.get('/api/user/tickets', { params })
      if (r.data?.success) {
        setTickets(r.data.data || [])
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter])

  useEffect(() => { loadTickets() }, [loadTickets])

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put('/api/user/tickets', { id, status })
      // Refresh
      loadTickets()
      if (selectedTicket?.id === id) {
        setSelectedTicket(prev => prev ? { ...prev, status } : null)
      }
    } catch (e: any) {
      // error handled silently
    }
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000)
    return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Main>
      <SectionPageLayout>
        <SectionPageLayoutTitle>工单管理</SectionPageLayoutTitle>
        <SectionPageLayoutContent>
          <div className='flex flex-col gap-4'>
            {/* Filters */}
            <div className='flex items-center gap-3 flex-wrap'>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className='h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#475569]'
              >
                <option value=''>全部状态</option>
                <option value='open'>待处理</option>
                <option value='in_progress'>处理中</option>
                <option value='closed'>已关闭</option>
              </select>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className='h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#475569]'
              >
                <option value=''>全部类型</option>
                <option value='bug'>Bug 反馈</option>
                <option value='feature'>功能建议</option>
                <option value='question'>咨询</option>
                <option value='other'>其他</option>
              </select>
              <button
                onClick={loadTickets}
                className='ml-auto h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5'
              >
                <RefreshCw className='w-3.5 h-3.5' />
                刷新
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className='flex items-center justify-center py-16'>
                <Loader2 className='w-6 h-6 animate-spin text-[#94A3B8]' />
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className='text-center py-8 text-[13px] text-red-500'>{error}</div>
            )}

            {/* Ticket list */}
            {!loading && !error && tickets.length === 0 && (
              <div className='text-center py-16 text-[13px] text-[#94A3B8]'>暂无工单</div>
            )}

            {!loading && !error && tickets.length > 0 && (
              <div className='border border-[#E2E8F0] rounded-lg overflow-hidden'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-[#F8FAFC] border-b border-[#E2E8F0]'>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>ID</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>用户</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>类型</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>标题</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>状态</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>时间</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => {
                      const badge = STATUS_BADGE[ticket.status] || STATUS_BADGE.open
                      return (
                        <tr
                          key={ticket.id}
                          className='border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors'
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <td className='px-4 py-3 text-[13px] text-[#475569] font-mono'>#{ticket.id}</td>
                          <td className='px-4 py-3 text-[13px] text-[#475569]'>{ticket.username || `用户${ticket.user_id}`}</td>
                          <td className='px-4 py-3'>
                            <span className='text-[12px] text-[#64748B]'>{TYPE_LABELS[ticket.type] || ticket.type}</span>
                          </td>
                          <td className='px-4 py-3 text-[13px] text-[#1E293B] max-w-[240px] truncate'>{ticket.subject}</td>
                          <td className='px-4 py-3'>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${badge.className}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          </td>
                          <td className='px-4 py-3 text-[12px] text-[#94A3B8]'>{formatTime(ticket.created_at)}</td>
                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-1' onClick={e => e.stopPropagation()}>
                              {ticket.status === 'open' && (
                                <button
                                  onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                                  className='px-2 py-1 rounded text-[11px] bg-blue-50 text-blue-600 hover:bg-blue-100'
                                >
                                  受理
                                </button>
                              )}
                              {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                                <button
                                  onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                                  className='px-2 py-1 rounded text-[11px] bg-green-50 text-green-600 hover:bg-green-100'
                                >
                                  关闭
                                </button>
                              )}
                              {ticket.status === 'closed' && (
                                <button
                                  onClick={() => handleUpdateStatus(ticket.id, 'open')}
                                  className='px-2 py-1 rounded text-[11px] bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                >
                                  重开
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Detail panel */}
            {selectedTicket && (
              <div className='border border-[#E2E8F0] rounded-lg p-6 bg-white'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-[16px] font-semibold text-[#1E293B]'>#{selectedTicket.id} - {selectedTicket.subject}</h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className='text-[#94A3B8] hover:text-[#64748B]'
                  >
                    <XCircle className='w-5 h-5' />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>提交用户</p>
                    <p className='text-[13px] text-[#475569]'>{selectedTicket.username || `用户${selectedTicket.user_id}`}</p>
                  </div>
                  <div>
                    <p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>类型</p>
                    <p className='text-[13px] text-[#475569]'>{TYPE_LABELS[selectedTicket.type] || selectedTicket.type}</p>
                  </div>
                  <div>
                    <p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>状态</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${(STATUS_BADGE[selectedTicket.status] || STATUS_BADGE.open).className}`}>
                      {(STATUS_BADGE[selectedTicket.status] || STATUS_BADGE.open).icon}
                      {(STATUS_BADGE[selectedTicket.status] || STATUS_BADGE.open).label}
                    </span>
                  </div>
                  <div>
                    <p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>联系方式</p>
                    <p className='text-[13px] text-[#475569]'>{selectedTicket.contact || '未填写'}</p>
                  </div>
                </div>
                <div className='mb-4'>
                  <p className='text-[11px] text-[#94A3B8] font-medium mb-1'>详细描述</p>
                  <div className='bg-[#F8FAFC] rounded-lg p-4 text-[13px] text-[#475569] leading-relaxed whitespace-pre-wrap'>
                    {selectedTicket.description}
                  </div>
                </div>
                <div className='flex items-center gap-2 pt-3 border-t border-[#F1F5F9]'>
                  <span className='text-[12px] text-[#94A3B8]'>操作：</span>
                  {selectedTicket.status === 'open' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}
                      className='px-3 py-1.5 rounded-md text-[12px] bg-blue-500 text-white hover:bg-blue-600'
                    >
                      受理工单
                    </button>
                  )}
                  {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                      className='px-3 py-1.5 rounded-md text-[12px] bg-green-500 text-white hover:bg-green-600'
                    >
                      关闭工单
                    </button>
                  )}
                  {selectedTicket.status === 'closed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'open')}
                      className='px-3 py-1.5 rounded-md text-[12px] bg-yellow-500 text-white hover:bg-yellow-600'
                    >
                      重新打开
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </SectionPageLayoutContent>
      </SectionPageLayout>
    </Main>
  )
}
