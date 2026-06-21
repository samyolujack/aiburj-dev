import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Search, X } from 'lucide-react'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authenticated/models/')({
  component: ModelMarketplace,
})

type ModelInfo = { id: string; channel_id: number; channel_name: string; enabled: boolean }

// ── Parse model metadata ──────────────────────────────────────────────────

const PROVIDER_LOGO: Record<string, string> = {
  'DeepSeek 官方': 'deepseek',
  '通义千问': 'alibabacloud',
  '硅基流动': 'siliconflow',
}
const PROVIDER_ACCENT: Record<string, string> = {
  'DeepSeek 官方': '#4D6BFE', '硅基流动': '#7C3AED',
  '通义千问': '#F59E0B', '智谱AI': '#3B82F6', 'Headroom压缩': '#F43F5E',
}

function parseModel(id: string) {
  const l = id.toLowerCase()
  const t: string[] = []
  if (l.includes('tools') || l.includes('function')) t.push('Tools')
  if (l.includes('reason') || l.includes('think') || l.includes('r1')) t.push('推理模型')
  if (l.includes('vision') || l.includes('vl') || l.includes('image') || l.includes('kolors')) t.push('视觉')
  if (l.includes('coder') || l.includes('code')) t.push('Coder')
  if (l.includes('moe')) t.push('MoE')
  const m = id.match(/(\d+)k/i); if (m) t.push(m[1] + 'K')
  const b = id.match(/(\d+)b/i); if (b) t.push(b[1] + 'B')
  if (l.includes('turbo')) t.push('Turbo')
  if (l.includes('flash')) t.push('Flash')
  if (l.includes('pro')) t.push('Pro')
  const provider = id.includes('/') ? id.split('/')[0] : ''
  const short = id.split('/').pop() || id
  const desc = provider ? `${provider} 提供的大语言模型` : 'AI 大语言模型'
  return { tags: t.slice(0, 6), provider, short, desc }
}

// ── Brand Logo component ──────────────────────────────────────────────────

function BrandLogo({ name, size = 26 }: { name: string; size?: number }) {
  const slug = Object.entries(PROVIDER_LOGO).find(([k]) => name.toLowerCase().includes(k.toLowerCase()))?.[1]
  const color = (Object.entries(PROVIDER_ACCENT).find(([k]) => name.toLowerCase().includes(k.toLowerCase()))?.[1] || '#64748B').replace('#', '')

  if (slug) {
    return <img src={`https://cdn.simpleicons.org/${slug}/${color}`} alt={name}
      width={size} height={size} className="rounded-md object-contain shrink-0 bg-white p-0.5" />
  }
  const initials = name.replace(/[a-zA-Z]/g, '').slice(0, 2) || name.slice(0, 2)
  return <div className="flex items-center justify-center rounded-md text-white text-[10px] font-bold shrink-0"
    style={{ width: size, height: size, backgroundColor: `#${color}` }}>{initials}</div>
}

// ── Type filters ──────────────────────────────────────────────────────────

const TYPES = ['全部', '推理模型', '视觉', 'Coder', 'Tools', 'MoE']

function FilterBar({ active, onSelect }: { active: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground mr-1">类型</span>
      {TYPES.map(t => (
        <button key={t} onClick={() => onSelect(t)}
          className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
            active === t
              ? 'bg-[#EEF2FF] text-[#4D6BFE] dark:bg-[#1b2340] dark:text-blue-400 font-medium shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}>
          {t}
        </button>
      ))}
    </div>
  )
}

// ── Model Card ────────────────────────────────────────────────────────────

function ModelCard({ model }: { model: ModelInfo }) {
  const info = useMemo(() => parseModel(model.id), [model.id])

  return (
    <div className="group cursor-pointer rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-border">
      {/* Header: logo + model name + provider */}
      <div className="flex items-start gap-3 mb-3">
        <BrandLogo name={model.channel_name} size={32} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[13px] leading-[1.3] break-words">{model.id}</h3>
          <p className="text-[11px] text-muted-foreground mt-1">{model.channel_name}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground/70 leading-[1.5] mb-3 line-clamp-2">
        {info.desc}
      </p>

      {/* Tags */}
      {info.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {info.tags.map(t => (
            <span key={t} className="inline-flex items-center rounded-md border bg-muted/50 dark:bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

function ModelMarketplace() {
  const { t } = useTranslation()
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
    } catch { /* empty */ } finally { setLoading(false) }
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
      <div className="p-6 md:p-8">
        {/* Search */}
        <div className="relative max-w-sm mb-5">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="请输入模型名称"
            className="pl-9 pr-8 h-9 rounded-lg" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
        </div>

        {/* Filters */}
        <FilterBar active={typeFilter} onSelect={setTypeFilter} />

        {/* Divider */}
        <hr className="my-5" />

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}

        {!loading && Object.entries(grouped).map(([channel, channelModels]) => (
          <section key={channel} className="mb-12">
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-5">
              <BrandLogo name={channel} size={22} />
              <h3 className="font-semibold text-[15px]">{channel}</h3>
              <span className="text-[12px] text-muted-foreground/60">{channelModels.length}</span>
            </div>

            {/* Card grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channelModels.map(m => <ModelCard key={`${m.channel_id}-${m.id}`} model={m} />)}
            </div>
          </section>
        ))}
      </div>
    </Main>
  )
}
