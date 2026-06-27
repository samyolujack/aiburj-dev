import { useState, useCallback, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpDown, Search } from 'lucide-react'
import { Main } from '@/components/layout'
import { ModelCard } from '@/features/pricing/components/model-card'
import { usePricingData } from '@/features/pricing/hooks/use-pricing-data'
import { filterAndSortModels, parseTags } from '@/features/pricing/lib/filters'
import type { PricingModel } from '@/features/pricing/types'

export const Route = createFileRoute('/_authenticated/models/')({
  component: ModelMarketplace,
})

const MODEL_TYPES = ['全部', '对话', '生图', '嵌入', '重排序', '语音', '视频']

function detectModelTypeByName(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('image') || lower.includes('kolors')) return '生图'
  if (lower.includes('video') || lower.includes('wan') || lower.includes('cogvideo')) return '视频'
  if (lower.includes('embed')) return '嵌入'
  if (lower.includes('rerank')) return '重排序'
  if (lower.includes('cosyvoice') || lower.includes('speech') || lower.includes('audio') || lower.includes('tts') || lower.includes('voice')) return '语音'
  return '对话'
}

// ── Filter chips ─────────────────────────────────────────────────────────

function ChipGroup({ label, items, active, onSelect }: {
  label: string; items: string[]; active: string; onSelect: (t: string) => void
}) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-[13px] font-medium text-[#64748B] mr-1'>{label}</span>
      {items.map(t => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`text-[13px] px-3 py-1 rounded-md transition-colors ${
            active === t
              ? 'bg-[#EEF2FF] text-[#4D6BFE] font-medium'
              : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#334155]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────

function ModelMarketplace() {
  const { models, isLoading, priceRate, usdExchangeRate } = usePricingData()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('全部')
  const [sortDesc, setSortDesc] = useState(false)

  const handleModelClick = useCallback((_modelName: string) => {}, [])

  const filtered = useMemo(() => {
    let list = models || []
    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        (m.model_name || '').toLowerCase().includes(q) ||
        (m.vendor_name || '').toLowerCase().includes(q) ||
        (m.model_type || '').toLowerCase().includes(q)
      )
    }
    // Type filter
    if (typeFilter !== '全部') {
      list = list.filter(m => {
        const mt = m.model_type || detectModelTypeByName(m.model_name || '')
        return mt === typeFilter
      })
    }
    // Sort alphabetically
    list = [...list].sort((a, b) => (a.model_name || '').localeCompare(b.model_name || ''))
    if (sortDesc) list.reverse()
    return list
  }, [models, search, typeFilter, sortDesc])

  return (
    <Main>
      {/* Full page light background */}
      <div className='min-h-full overflow-auto'>
        <div className='px-4 py-12 w-full'>
        {/* Header */}
        <div className='text-center mb-10'>
          <h2 className='text-[28px] font-bold text-[#1E293B] mb-2'>模型广场</h2>
          <p className='text-[14px] text-[#94A3B8]'>
            1 个 API，3 行代码，50+ 国产主流模型轻松调用
          </p>
        </div>

        {/* Search */}
        <div className='mx-auto max-w-[600px] h-10 mb-8 flex items-center bg-white rounded-lg border border-[#E2E8F0] px-3 shadow-sm'>
          <Search className='w-4 h-4 text-[#94A3B8] shrink-0' />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='搜索模型名称、模型厂商、应用场景'
            className='border-0 shadow-none bg-transparent h-full flex-1 text-[14px] focus:outline-none px-2'
          />
          {search && (
            <button onClick={() => setSearch('')} className='text-[#94A3B8] hover:text-[#64748B] text-lg'>
              ×
            </button>
          )}
        </div>

        {/* Filters */}
        <div className='flex flex-col gap-3 mb-8'>
          <ChipGroup label='模型类型' items={MODEL_TYPES} active={typeFilter} onSelect={setTypeFilter} />
          <div className='flex justify-end'>
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className={`flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-md transition-colors ${
                sortDesc ? 'bg-[#EEF2FF] text-[#4D6BFE] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#334155]'
              }`}
            >
              <ArrowUpDown className='w-3.5 h-3.5' />
              {sortDesc ? '倒序' : '默认排序'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className='flex items-center justify-center py-20'>
            <div className='w-6 h-6 animate-spin border-2 border-[#4D6BFE] border-t-transparent rounded-full' />
          </div>
        )}

        {/* Model grid */}
        {!isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {filtered.map((model: PricingModel) => (
              <ModelCard
                key={model.model_name}
                model={model}
                tokenUnit='M'
                priceRate={priceRate}
                usdExchangeRate={usdExchangeRate}
                onClick={() => handleModelClick(model.model_name)}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className='text-center py-16 text-[#94A3B8]'>
            <p className='text-[14px]'>未找到匹配的模型</p>
          </div>
        )}
      </div>
      </div>
    </Main>
  )
}
