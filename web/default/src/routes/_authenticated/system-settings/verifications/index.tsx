import { useState, useEffect, useCallback } from 'react'
import type React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE } from '@/lib/roles'
import { Main } from '@/components/layout'
import { SectionPageLayout } from '@/components/layout/components/section-page-layout'

const SectionPageLayoutTitle = (SectionPageLayout as any).Title as React.FC<{ children: React.ReactNode }>
const SectionPageLayoutContent = (SectionPageLayout as any).Content as React.FC<{ children: React.ReactNode }>

export const Route = createFileRoute('/_authenticated/system-settings/verifications/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (auth.user?.role !== ROLE.SUPER_ADMIN) throw redirect({ to: '/403' })
  },
  component: VerificationsPage,
})

type VerificationItem = {
  id: number; user_id: number; username: string; real_name: string
  id_card_front: string; id_card_back: string; status: number
  review_msg: string; created_at: number; updated_at: number
}

const STATUS_MAP: Record<number, { label: string; icon: JSX.Element; className: string }> = {
  0: { label: '待审核', icon: <Clock className='w-3 h-3' />, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  1: { label: '已通过', icon: <CheckCircle className='w-3 h-3' />, className: 'bg-green-50 text-green-700 border-green-200' },
  2: { label: '已拒绝', icon: <XCircle className='w-3 h-3' />, className: 'bg-red-50 text-red-700 border-red-200' },
}

function VerificationsPage() {
  const [list, setList] = useState<VerificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<VerificationItem | null>(null)
  const [reviewMsg, setReviewMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (statusFilter !== '') params.status = statusFilter
      const r = await api.get('/api/user/verifications', { params })
      if (r.data?.success) setList(r.data.data || [])
    } catch {} finally { setLoading(false) }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const review = async (id: number, status: number, msg: string) => {
    await api.put('/api/user/verifications', { id, status, review_msg: msg }).catch(() => {})
    load()
    setSelected(null)
    setReviewMsg('')
  }

  const fmtTime = (ts: number) => new Date(ts * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <Main>
      <SectionPageLayout>
        <SectionPageLayoutTitle>实名认证审核</SectionPageLayoutTitle>
        <SectionPageLayoutContent>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3 flex-wrap'>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className='h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#475569]'>
                <option value=''>全部状态</option>
                <option value='0'>待审核</option>
                <option value='1'>已通过</option>
                <option value='2'>已拒绝</option>
              </select>
              <button onClick={load} className='ml-auto h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1.5'>
                <RefreshCw className='w-3.5 h-3.5' /> 刷新
              </button>
            </div>

            {loading && <div className='flex justify-center py-16'><Loader2 className='w-6 h-6 animate-spin text-[#94A3B8]' /></div>}

            {!loading && list.length === 0 && <div className='text-center py-16 text-[13px] text-[#94A3B8]'>暂无认证申请</div>}

            {!loading && list.length > 0 && (
              <div className='border border-[#E2E8F0] rounded-lg overflow-hidden'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-[#F8FAFC] border-b border-[#E2E8F0]'>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>ID</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>用户</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>真实姓名</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>状态</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>提交时间</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(v => {
                      const badge = STATUS_MAP[v.status] || STATUS_MAP[0]
                      return (
                        <tr key={v.id} className='border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors' onClick={() => setSelected(v)}>
                          <td className='px-4 py-3 text-[13px] text-[#475569] font-mono'>#{v.id}</td>
                          <td className='px-4 py-3 text-[13px] text-[#475569]'>{v.username || `用户${v.user_id}`}</td>
                          <td className='px-4 py-3 text-[13px] text-[#1E293B]'>{v.real_name}</td>
                          <td className='px-4 py-3'>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${badge.className}`}>{badge.icon}{badge.label}</span>
                          </td>
                          <td className='px-4 py-3 text-[12px] text-[#94A3B8]'>{fmtTime(v.created_at)}</td>
                          <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                            {v.status === 0 && (
                              <div className='flex items-center gap-1'>
                                <button onClick={() => { setSelected(v); setReviewMsg('') }} className='px-2 py-1 rounded text-[11px] bg-blue-50 text-blue-600 hover:bg-blue-100'>审核</button>
                              </div>
                            )}
                            {v.status !== 0 && <span className='text-[12px] text-[#94A3B8]'>{STATUS_MAP[v.status]?.label}</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Review panel */}
            {selected && (
              <div className='border border-[#E2E8F0] rounded-lg p-6 bg-white'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-[16px] font-semibold text-[#1E293B]'>#{selected.id} - {selected.real_name}</h3>
                  <button onClick={() => { setSelected(null); setReviewMsg('') }} className='text-[#94A3B8] hover:text-[#64748B]'><XCircle className='w-5 h-5' /></button>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>用户</p><p className='text-[13px] text-[#475569]'>{selected.username || `用户${selected.user_id}`}</p></div>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>真实姓名</p><p className='text-[13px] text-[#1E293B]'>{selected.real_name}</p></div>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>提交时间</p><p className='text-[13px] text-[#475569]'>{fmtTime(selected.created_at)}</p></div>
                  <div><p className='text-[11px] text-[#94A3B8] font-medium mb-0.5'>状态</p><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${(STATUS_MAP[selected.status]||STATUS_MAP[0]).className}`}>{(STATUS_MAP[selected.status]||STATUS_MAP[0]).icon}{(STATUS_MAP[selected.status]||STATUS_MAP[0]).label}</span></div>
                </div>

                {/* ID card images */}
                {(selected.id_card_front || selected.id_card_back) && (
                  <div className='grid grid-cols-2 gap-4 mb-4'>
                    {selected.id_card_front && (
                      <div><p className='text-[11px] text-[#94A3B8] font-medium mb-1'>身份证正面</p>
                        <img src={selected.id_card_front} alt='身份证正面' className='w-full max-h-[200px] object-contain rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]' />
                      </div>
                    )}
                    {selected.id_card_back && (
                      <div><p className='text-[11px] text-[#94A3B8] font-medium mb-1'>身份证背面</p>
                        <img src={selected.id_card_back} alt='身份证背面' className='w-full max-h-[200px] object-contain rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]' />
                      </div>
                    )}
                  </div>
                )}

                {selected.status === 0 && (
                  <div className='space-y-3 pt-3 border-t border-[#F1F5F9]'>
                    <textarea
                      value={reviewMsg}
                      onChange={e => setReviewMsg(e.target.value)}
                      placeholder='审核意见（选填，拒绝时建议填写原因）'
                      className='w-full h-20 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[13px] text-[#475569] resize-none focus:outline-none focus:border-[#004A8F] focus:ring-1 focus:ring-[#004A8F20]'
                    />
                    <div className='flex items-center gap-2'>
                      <button onClick={() => review(selected.id, 1, reviewMsg)} className='px-4 py-2 rounded-md text-[13px] bg-green-500 text-white hover:bg-green-600 font-medium'>审核通过</button>
                      <button onClick={() => review(selected.id, 2, reviewMsg)} className='px-4 py-2 rounded-md text-[13px] bg-red-500 text-white hover:bg-red-600 font-medium'>拒绝</button>
                    </div>
                  </div>
                )}
                {selected.status !== 0 && selected.review_msg && (
                  <div className='pt-3 border-t border-[#F1F5F9]'>
                    <p className='text-[11px] text-[#94A3B8] font-medium mb-1'>审核意见</p>
                    <p className='text-[13px] text-[#475569]'>{selected.review_msg}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </SectionPageLayoutContent>
      </SectionPageLayout>
    </Main>
  )
}
