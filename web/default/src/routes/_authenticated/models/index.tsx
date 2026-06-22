import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Search, X } from 'lucide-react'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authenticated/models/')({
  component: ModelMarketplace,
})

type ModelInfo = { id: string; channel_id: number; channel_name: string; enabled: boolean }

interface ParsedModel {
  tags: string[]
  provider: string
  short: string
  desc: string
}

// ── Logo maps ────────────────────────────────────────────────────────────

const ICON_SLUG: Record<string, string> = {
  'DeepSeek 官方': 'deepseek',
  '通义千问': 'alibabacloud',
  '硅基流动': 'siliconflow',
}
const ACCENT: Record<string, string> = {
  'DeepSeek 官方': '#4D6BFE', '硅基流动': '#7C3AED',
  '通义千问': '#F59E0B', '智谱AI': '#3B82F6', 'Headroom压缩': '#F43F5E',
}

// ── Parse model ──────────────────────────────────────────────────────────

function parseModel(id: string): ParsedModel {
  const lower = id.toLowerCase()
  const tags: string[] = []
  if (lower.includes('tools') || lower.includes('function')) tags.push('Tools')
  if (lower.includes('reason') || lower.includes('think') || lower.includes('r1')) tags.push('推理模型')
  if (lower.includes('vision') || lower.includes('vl') || lower.includes('image') || lower.includes('kolors')) tags.push('视觉')
  if (lower.includes('coder') || lower.includes('code')) tags.push('Coder')
  if (lower.includes('moe')) tags.push('MoE')
  const m = id.match(/(\d+)k/i); if (m) tags.push(m[1] + 'K')
  const b = id.match(/(\d+)b/i); if (b) tags.push(b[1] + 'B')
  if (lower.includes('turbo')) tags.push('Turbo')
  if (lower.includes('flash')) tags.push('Flash')
  if (lower.includes('pro')) tags.push('Pro')

  const provider = id.includes('/') ? id.split('/')[0] : ''
  const short = id.split('/').pop() || id
  const desc = provider ? `${provider} 提供的大语言模型` : 'AI 大语言模型'
  return { tags: tags.slice(0, 6), provider, short, desc }
}

// ── Brand Logo ───────────────────────────────────────────────────────────

function BrandLogo({ name, size = 24 }: { name: string; size?: number }) {
  const entry = Object.entries(ICON_SLUG).find(([k]) => name.toLowerCase().includes(k.toLowerCase()))
  const color = (Object.entries(ACCENT).find(([k]) => name.toLowerCase().includes(k.toLowerCase()))?.[1] || '#64748B').replace('#', '')

  if (entry) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${entry[1]}/${color}`}
        alt={name}
        width={size}
        height={size}
        className="rounded-lg object-contain shrink-0"
      />
    )
  }
  const initials = name.replace(/[a-zA-Z]/g, '').slice(0, 2) || name.slice(0, 2)
  return (
    <div
      className="flex items-center justify-center rounded-lg text-white text-[10px] font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: `#${color}` }}
    >
      {initials}
    </div>
  )
}

// ── Filter pills ─────────────────────────────────────────────────────────

const TYPES = ['全部', '推理模型', '视觉', 'Coder', 'Tools', 'MoE']

function FilterBar({ active, onSelect }: { active: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground mr-1">类型</span>
      {TYPES.map(t => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
            active === t
              ? 'bg-[#EEF2FF] text-[#4D6BFE] dark:text-blue-400 font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// ── Model Card ───────────────────────────────────────────────────────────

function ModelCard({ model }: { model: ModelInfo }) {
  const info = useMemo(() => parseModel(model.id), [model.id])

  return (
    <div className="group cursor-pointer rounded-xl border border-[#E8ECF4] bg-[#EBF2FF] p-5 transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5">
      {/* Brand identity */}
      <div className="flex items-center gap-3 mb-4">
        <BrandLogo name={model.channel_name} size={32} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[14px] leading-snug break-words">
            {model.id}
          </h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {model.channel_name}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-muted-foreground/60 leading-relaxed mb-4 line-clamp-2">
        {info.desc}
      </p>

      {/* Tags */}
      {info.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {info.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-[#E2E8F0] bg-white px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────

function ModelMarketplace() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('全部')

  useEffect(() => { loadModels() }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const r = await api.get('/api/user/marketplace/models')
      if (r.data?.success) setModels(r.data.data || [])
    } catch { /* */ } finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    let list = models
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m => m.id.toLowerCase().includes(q) || m.channel_name.toLowerCase().includes(q))
    }
    if (typeFilter !== '全部') list = list.filter(m => parseModel(m.id).tags.includes(typeFilter))
    return list
  }, [models, search, typeFilter])

  const grouped = useMemo(() => {
    const g: Record<string, ModelInfo[]> = {}
    for (const m of filtered) { if (!g[m.channel_name]) g[m.channel_name] = []; g[m.channel_name].push(m) }
    return g
  }, [filtered])

  return (
    <Main>
      <div className="p-6 md:p-8 bg-white min-h-full">
        {/* Search */}
        <div className="relative max-w-sm mb-5">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="请输入模型名称"
            className="pl-9 pr-8 h-9 rounded-lg bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <FilterBar active={typeFilter} onSelect={setTypeFilter} />

        <hr className="my-5 border-[#E2E8F0]" />

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading &&
          Object.entries(grouped).map(([channel, channelModels]) => (
            <section key={channel} className="mb-12">
              {/* Section header */}
              <div className="flex items-center gap-2.5 mb-5">
                <BrandLogo name={channel} size={22} />
                <h3 className="font-semibold text-[15px]">{channel}</h3>
                <span className="text-[12px] text-muted-foreground/50">
                  {channelModels.length}
                </span>
              </div>

              {/* Card grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {channelModels.map(m => (
                  <ModelCard key={`${m.channel_id}-${m.id}`} model={m} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </Main>
  )
}
