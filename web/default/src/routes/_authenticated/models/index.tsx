import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Search, X, ChevronDown } from 'lucide-react'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authenticated/models/')({
  component: ModelMarketplace,
})

type ModelInfo = { id: string; channel_id: number; channel_name: string; enabled: boolean }

// ── Brand Logo ───────────────────────────────────────────────────────────

function BrandLogo({ name, size = 24 }: { name: string; size?: number }) {
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

  if (slug) {
    return <img src={`https://cdn.simpleicons.org/${slug}/${color}`} alt={name}
      width={size} height={size} className="rounded-md object-contain shrink-0" />
  }

  const initials = name.replace(/[a-zA-Z]/g, '').slice(0, 2) || name.slice(0, 2)
  return (
    <div className="flex items-center justify-center rounded-md text-white text-[10px] font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: `#${color}` }}>
      {initials}
    </div>
  )
}

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
  if (l.includes('pro')) t.push('Pro')
  if (l.includes('turbo')) t.push('Turbo')
  if (l.includes('flash')) t.push('Flash')
  const provider = id.includes('/') ? id.split('/')[0] : ''
  const short = id.split('/').pop() || id
  return { tags: t.slice(0, 6), provider, short }
}

// ── Provider colors ──────────────────────────────────────────────────────

const PALETTE: Record<string, { bg: string; accent: string }> = {
  'DeepSeek 官方': { bg: 'bg-[#EEF2FF] dark:bg-[#1b2340]', accent: '#4D6BFE' },
  '硅基流动':     { bg: 'bg-[#F5F3FF] dark:bg-[#221d40]', accent: '#7C3AED' },
  '通义千问':     { bg: 'bg-[#FFFBEB] dark:bg-[#332810]', accent: '#F59E0B' },
  '智谱AI':       { bg: 'bg-[#EFF6FF] dark:bg-[#182840]', accent: '#3B82F6' },
  'Headroom压缩': { bg: 'bg-[#FFF1F2] dark:bg-[#331820]', accent: '#F43F5E' },
}
const DEF = { bg: 'bg-card', accent: '#94A3B8' }

// ── Filter tags ──────────────────────────────────────────────────────────

const FILTERS = {
  type: ['全部', '推理模型', '视觉', 'Coder', 'Tools', 'MoE'],
  param: ['全部', '10B以下', '10~50B', '50~100B', '100B以上'],
  ctx: ['全部', '8K', '16K+', '32K+', '128K+', '1M'],
}

// ── Model Card ───────────────────────────────────────────────────────────

function ModelCard({ model }: { model: ModelInfo }) {
  const p = PALETTE[model.channel_name] || DEF
  const info = useMemo(() => parseInfo(model.id), [model.id])
  const desc = `${model.channel_name} 提供的 ${info.short} 模型`

  return (
    <div className={`group cursor-pointer rounded-xl border border-transparent ${p.bg} p-4 transition-all duration-150 hover:border-border hover:shadow-md`}>
      <div className="flex items-start gap-2.5 mb-3">
        <BrandLogo name={model.channel_name} size={28} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[13px] leading-snug truncate">{model.id}</h3>
          <p className="text-[11px] text-muted-foreground truncate">{model.channel_name}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground/70 mb-2.5 line-clamp-2">{desc}</p>
      {info.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
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

// ── Main page ────────────────────────────────────────────────────────────

function ModelMarketplace() {
  const { t } = useTranslation()
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('全部')
  const [showFilters, setShowFilters] = useState(true)

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
    if (typeFilter !== '全部') {
      list = list.filter(m => parseInfo(m.id).tags.includes(typeFilter))
    }
    return list
  }, [models, search, typeFilter])

  const grouped = useMemo(() => {
    const g: Record<string, ModelInfo[]> = {}
    for (const m of filtered) { if (!g[m.channel_name]) g[m.channel_name] = []; g[m.channel_name].push(m) }
    return g
  }, [filtered])

  return (
    <Main>
      <div className="flex gap-6 p-6 md:p-8">
        {/* Left filter sidebar */}
        {showFilters && (
          <aside className="hidden lg:block w-44 shrink-0">
            <div className="sticky top-6 space-y-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('类型')}</p>
                <div className="flex flex-wrap gap-1">
                  {FILTERS.type.map(f => (
                    <button key={f} onClick={() => setTypeFilter(f)}
                      className={`text-[11px] px-2 py-1 rounded-md transition-colors ${typeFilter === f ? 'bg-[#EEF2FF] text-[#4D6BFE] dark:bg-[#1b2340] dark:text-blue-400' : 'text-muted-foreground hover:bg-muted'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('系列/厂商')}</p>
                <div className="space-y-0.5">
                  {Object.keys(grouped).map(provider => (
                    <a key={provider} href={`#${provider}`} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground py-0.5">
                      <BrandLogo name={provider} size={16} />
                      {provider}
                    </a>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowFilters(false)} className="text-[11px] text-muted-foreground hover:text-foreground gap-1 flex items-center">
                <ChevronDown className="size-3 rotate-90" /> 隐藏筛选器
              </button>
            </div>
          </aside>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            {!showFilters && (
              <button onClick={() => setShowFilters(true)} className="text-xs text-muted-foreground hover:text-foreground gap-1 flex items-center shrink-0">
                <ChevronDown className="size-3 -rotate-90" /> 显示筛选器
              </button>
            )}
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="请输入模型名称" className="pl-9 pr-8 h-9 rounded-lg" />
              {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
            </div>
          </div>

          {loading && <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}

          {!loading && (!showFilters ? (
            /* Flat card grid (no grouping) */
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(m => <ModelCard key={`${m.channel_id}-${m.id}`} model={m} />)}
            </div>
          ) : (
            /* Grouped by provider */
            Object.entries(grouped).map(([channel, channelModels]) => (
              <section key={channel} id={channel} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <BrandLogo name={channel} size={20} />
                  <h3 className="text-sm font-semibold">{channel}</h3>
                  <span className="text-[11px] text-muted-foreground">{channelModels.length}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {channelModels.map(m => <ModelCard key={`${m.channel_id}-${m.id}`} model={m} />)}
                </div>
              </section>
            ))
          ))}
        </div>
      </div>
    </Main>
  )
}
