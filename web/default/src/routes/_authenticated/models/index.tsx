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

// ── Tag parser ───────────────────────────────────────────────────────────

function parseInfo(id: string) {
  const l = id.toLowerCase()
  const t: string[] = []
  if (l.includes('tools') || l.includes('function')) t.push('Tools')
  if (l.includes('reason') || l.includes('think') || l.includes('r1')) t.push('推理模型')
  if (l.includes('vision') || l.includes('vl') || l.includes('image') || l.includes('kolors')) t.push('视觉')
  if (l.includes('code') || l.includes('coder')) t.push('Coder')
  if (l.includes('moe')) t.push('MoE')
  const ctx = id.match(/(\d+)k/i); if (ctx) t.push(ctx[1] + 'K')
  const r = id.match(/(\d+)b/i); if (r) t.push(r[1] + 'B')
  if (l.includes('turbo')) t.push('Turbo')
  if (l.includes('flash')) t.push('Flash')
  return { tags: t.slice(0, 5), short: id.split('/').pop() || id }
}

// ── Brand Logo ───────────────────────────────────────────────────────────

function BrandLogo({ name, size = 22 }: { name: string; size?: number }) {
  const key = name.toLowerCase()
  const slug = key.includes('deepseek') ? 'deepseek'
    : key.includes('通义') || key.includes('qwen') ? 'alibabacloud'
    : key.includes('硅基') || key.includes('silicon') ? 'siliconflow'
    : ''
  const color = key.includes('deepseek') ? '4D6BFE'
    : key.includes('硅基') ? '7C3AED'
    : key.includes('通义') || key.includes('qwen') ? 'F59E0B'
    : key.includes('智谱') || key.includes('zhipu') ? '3B82F6'
    : '64748B'

  if (slug) return <img src={`https://cdn.simpleicons.org/${slug}/${color}`} alt={name}
    width={size} height={size} className="rounded-md object-contain shrink-0" />
  const initials = name.replace(/[a-zA-Z]/g, '').slice(0, 2) || name.slice(0, 2)
  return <div className="flex items-center justify-center rounded-md text-white text-[10px] font-bold shrink-0"
    style={{ width: size, height: size, backgroundColor: `#${color}` }}>{initials}</div>
}

// ── Provider accent colours ──────────────────────────────────────────────

const ACCENT: Record<string, string> = {
  'DeepSeek 官方': '#4D6BFE', '硅基流动': '#7C3AED', '通义千问': '#F59E0B',
  '智谱AI': '#3B82F6', 'Headroom压缩': '#F43F5E',
}

// ── Model Card ───────────────────────────────────────────────────────────

function ModelCard({ model }: { model: ModelInfo }) {
  const info = useMemo(() => parseInfo(model.id), [model.id])
  const accent = ACCENT[model.channel_name] || '#94A3B8'

  return (
    <div className="group cursor-pointer rounded-xl border bg-card p-4 transition-all duration-150 hover:shadow-md hover:border-border">
      <div className="flex items-start gap-3 mb-3">
        <BrandLogo name={model.channel_name} size={28} />
        <div className="min-w-0">
          <h3 className="font-semibold text-[13px] leading-snug truncate">{model.id}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{model.channel_name}</p>
        </div>
      </div>
      {info.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {info.tags.map(t => (
            <span key={t} className="inline-flex items-center rounded border bg-white/60 dark:bg-black/20 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Type filter buttons ──────────────────────────────────────────────────

const TYPES = ['全部', '推理模型', '视觉', 'Coder', 'Tools', 'MoE']

function TypeFilter({ active, onSelect }: { active: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      <span className="text-[11px] text-muted-foreground mr-1">类型</span>
      {TYPES.map(t => (
        <button key={t} onClick={() => onSelect(t)}
          className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
            active === t ? 'bg-[#EEF2FF] text-[#4D6BFE] dark:bg-[#1b2340] dark:text-blue-400 font-medium' : 'text-muted-foreground hover:bg-muted'
          }`}>
          {t}
        </button>
      ))}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────

function ModelMarketplace() {
  const { t } = useTranslation()
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('全部')

  useEffect(() => { loadModels() }, [])

  const loadModels = async () => {
    setLoading(true)
    try { const r = await api.get('/api/user/marketplace/models'); if (r.data?.success) setModels(r.data.data || []) }
    catch { /* */ } finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    let list = models
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m => m.id.toLowerCase().includes(q) || m.channel_name.toLowerCase().includes(q))
    }
    if (typeFilter !== '全部') list = list.filter(m => parseInfo(m.id).tags.includes(typeFilter))
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
        {/* Search + filters */}
        <div className="relative max-w-sm mb-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="请输入模型名称"
            className="pl-9 pr-8 h-9 rounded-lg" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
        </div>
        <TypeFilter active={typeFilter} onSelect={setTypeFilter} />

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}

        {!loading && Object.entries(grouped).map(([channel, channelModels]) => (
          <section key={channel} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <BrandLogo name={channel} size={24} />
              <h3 className="font-semibold text-sm">{channel}</h3>
              <span className="text-[11px] text-muted-foreground">{channelModels.length}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {channelModels.map(m => <ModelCard key={`${m.channel_id}-${m.id}`} model={m} />)}
            </div>
          </section>
        ))}
      </div>
    </Main>
  )
}
