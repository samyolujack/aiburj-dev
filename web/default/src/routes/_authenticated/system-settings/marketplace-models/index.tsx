import { useState, useEffect, useCallback } from 'react'
import type React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Loader2, Search, Save, AlertCircle, CheckCircle2, Pencil } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE } from '@/lib/roles'
import { Main } from '@/components/layout'
import { SectionPageLayout } from '@/components/layout/components/section-page-layout'

const SP = SectionPageLayout as any
const SPT = SP.Title as React.FC<{ children: React.ReactNode }>
const SPC = SP.Content as React.FC<{ children: React.ReactNode }>

export const Route = createFileRoute('/_authenticated/system-settings/marketplace-models/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    if (auth.user?.role !== ROLE.SUPER_ADMIN) throw redirect({ to: '/403' })
  },
  component: MarketplaceModelsPage,
})

type MarketModel = {
  id: number; model_name: string; model_type: string; tags: string
  vendor_name: string; status: number; description: string
}

const MODEL_TYPES = ['', '对话', '生图', '嵌入', '重排序', '语音', '视频']

function MarketplaceModelsPage() {
  const [models, setModels] = useState<MarketModel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editType, setEditType] = useState('')
  const [editTags, setEditTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      const r = await api.get('/api/user/marketplace-models', { params })
      if (r.data?.success) setModels(r.data.data || [])
    } catch {} finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const startEdit = (m: MarketModel) => {
    setEditingId(m.id)
    setEditType(m.model_type || '')
    setEditTags(m.tags || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditType('')
    setEditTags('')
  }

  const saveEdit = async (id: number) => {
    setSaving(true)
    try {
      await api.put('/api/user/marketplace-models', {
        id,
        model_type: editType,
        tags: editTags,
      })
      setSavedId(id)
      setTimeout(() => setSavedId(null), 2000)
      // Update local state
      setModels(prev => prev.map(m => m.id === id ? { ...m, model_type: editType, tags: editTags } : m))
      cancelEdit()
    } catch {} finally { setSaving(false) }
  }

  // Stats
  const configuredCount = models.filter(m => m.model_type).length
  const missingTypeCount = models.filter(m => !m.model_type).length

  return (
    <Main>
      <SectionPageLayout>
        <SPT>市场模型管理</SPT>
        <SPC>
          <div className='space-y-4'>

            {/* Stats bar */}
            <div className='grid grid-cols-3 gap-3 mb-4'>
              <div className='bg-white rounded-lg border border-[#E2E8F0] p-4 text-center'>
                <p className='text-[22px] font-bold text-[#1E293B]'>{models.length}</p>
                <p className='text-[11px] text-[#94A3B8]'>模型总数</p>
              </div>
              <div className='bg-green-50 rounded-lg border border-green-200 p-4 text-center'>
                <p className='text-[22px] font-bold text-green-700'>{configuredCount}</p>
                <p className='text-[11px] text-green-600'>已配置类型</p>
              </div>
              <div className={`rounded-lg border p-4 text-center ${missingTypeCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                <p className={`text-[22px] font-bold ${missingTypeCount > 0 ? 'text-amber-700' : 'text-green-700'}`}>{missingTypeCount}</p>
                <p className={`text-[11px] ${missingTypeCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>待配置</p>
              </div>
            </div>

            {/* Search */}
            <div className='flex items-center gap-3'>
              <div className='relative flex-1 max-w-md'>
                <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]' />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='搜索模型名称...'
                  className='w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#475569] focus:outline-none focus:border-[#004A8F] focus:ring-1 focus:ring-[#004A8F20]'
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className='flex justify-center py-16'>
                <Loader2 className='w-6 h-6 animate-spin text-[#94A3B8]' />
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className='border border-[#E2E8F0] rounded-lg overflow-hidden'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-[#F8FAFC] border-b border-[#E2E8F0]'>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>模型名称</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>供应商</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>模型类型</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>Tags</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B]'>状态</th>
                      <th className='px-4 py-3 text-left text-[12px] font-medium text-[#64748B] w-[100px]'>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map(m => {
                      const isEditing = editingId === m.id
                      const justSaved = savedId === m.id
                      return (
                        <tr key={m.id} className={`border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors ${isEditing ? 'bg-[#EEF2FF]' : ''}`}>
                          <td className='px-4 py-3 text-[13px] text-[#1E293B] font-medium max-w-[200px] truncate' title={m.model_name}>
                            {m.model_name}
                          </td>
                          <td className='px-4 py-3 text-[12px] text-[#64748B]'>{m.vendor_name || '-'}</td>
                          <td className='px-4 py-3'>
                            {isEditing ? (
                              <select
                                value={editType}
                                onChange={e => setEditType(e.target.value)}
                                className='h-8 rounded border border-[#E2E8F0] px-2 text-[12px] text-[#475569] focus:outline-none focus:border-[#004A8F]'
                              >
                                {MODEL_TYPES.map(t => <option key={t} value={t}>{t || '未设置'}</option>)}
                              </select>
                            ) : (
                              m.model_type ? (
                                <span className='inline-flex items-center rounded border border-[#91CAFF] bg-[#E6F4FF] px-2 py-0.5 text-[11px] text-[#0958D9]'>
                                  {m.model_type}
                                </span>
                              ) : (
                                <span className='inline-flex items-center gap-1 text-[12px] text-amber-600'>
                                  <AlertCircle className='w-3 h-3' /> 未设置
                                </span>
                              )
                            )}
                          </td>
                          <td className='px-4 py-3'>
                            {isEditing ? (
                              <input
                                value={editTags}
                                onChange={e => setEditTags(e.target.value)}
                                placeholder='逗号分隔，如：旗舰全能,快速响应'
                                className='w-full h-8 rounded border border-[#E2E8F0] px-2 text-[12px] text-[#475569] focus:outline-none focus:border-[#004A8F]'
                              />
                            ) : (
                              <div className='flex flex-wrap gap-1 max-w-[200px]'>
                                {m.tags ? m.tags.split(/[,;，；]/).filter(Boolean).map((t, i) => (
                                  <span key={i} className='inline-flex items-center rounded border border-[#D3ADF7] bg-[#F9F0FF] px-1.5 py-0 text-[11px] text-[#531DAB]'>
                                    {t.trim()}
                                  </span>
                                )) : <span className='text-[12px] text-[#94A3B8]'>-</span>}
                              </div>
                            )}
                          </td>
                          <td className='px-4 py-3'>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${m.status === 1 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                              {m.status === 1 ? <CheckCircle2 className='w-3 h-3' /> : <AlertCircle className='w-3 h-3' />}
                              {m.status === 1 ? '启用' : '禁用'}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            {isEditing ? (
                              <div className='flex items-center gap-1'>
                                <button
                                  onClick={() => saveEdit(m.id)}
                                  disabled={saving}
                                  className='flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-[#004A8F] text-white hover:bg-[#003A6F] disabled:opacity-50'
                                >
                                  <Save className='w-3 h-3' />
                                  {saving ? '...' : '保存'}
                                </button>
                                <button onClick={cancelEdit} className='px-2 py-1 rounded text-[11px] text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9]'>取消</button>
                              </div>
                            ) : (
                              <div className='flex items-center gap-1'>
                                <button
                                  onClick={() => startEdit(m)}
                                  className='flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[#64748B] hover:text-[#004A8F] hover:bg-[#EEF2FF] transition-colors'
                                >
                                  <Pencil className='w-3 h-3' />
                                  编辑
                                </button>
                                {justSaved && (
                                  <CheckCircle2 className='w-4 h-4 text-green-500 animate-pulse' />
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {models.length === 0 && (
                  <div className='text-center py-12 text-[13px] text-[#94A3B8]'>暂无模型数据</div>
                )}
              </div>
            )}

          </div>
        </SPC>
      </SectionPageLayout>
    </Main>
  )
}
