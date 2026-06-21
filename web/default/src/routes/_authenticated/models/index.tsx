import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Search, X, ExternalLink, Zap, Cpu, ArrowUpRight } from 'lucide-react'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const Route = createFileRoute('/_authenticated/models/')({
  component: ModelMarketplace,
})

type ModelInfo = {
  id: string
  channel_id: number
  channel_name: string
  enabled: boolean
}

// ── Brand Logo (Simple Icons CDN + fallback) ─────────────────────────────

function BrandLogo({ name, size = 32 }: { name: string; size?: number }) {
  const key = name.toLowerCase()
  const slug = key.includes('deepseek') ? 'deepseek'
    : key.includes('通义') || key.includes('qwen') ? 'alibabacloud'
    : key.includes('minimax') ? 'minimax'
    : key.includes('月之') || key.includes('moonshot') ? 'moonshot'
    : ''

  const colorMap: Record<string, string> = {
    'DeepSeek 官方': '4D6BFE',
    '硅基流动': '7C3AED',
    '通义千问': 'F59E0B',
    '智谱AI': '3B82F6',
    'Headroom压缩': 'F43F5E',
  }
  const color = (colorMap[name] || '64748B').replace('#', '')

  if (slug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${slug}/${color}`}
        alt={name}
        width={size}
        height={size}
        className="rounded-md object-contain shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  // Fallback: clean initial-based mark
  const initials = name.replace(/[a-zA-Z]/g, '').slice(0, 2) || name.slice(0, 2).toUpperCase()
  return (
    <div
      className="flex items-center justify-center rounded-md text-white text-xs font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: `#${color}` }}
    >
      {initials}
    </div>
  )
}

// ── Tag Parser ────────────────────────────────────────────────────────────

function parseModelInfo(modelId: string) {
  const lower = modelId.toLowerCase()
  const tags: string[] = []
  if (lower.includes('vision') || lower.includes('vl')) tags.push('视觉')
  if (lower.includes('reason') || lower.includes('think') || lower.includes('r1') || lower.includes('deepseek-r')) tags.push('推理模型')
  if (lower.includes('code') || lower.includes('coder')) tags.push('编程')
  if (lower.includes('tool') || lower.includes('function')) tags.push('Tools')
  const ctx = modelId.match(/(\d+)k/i)
  if (ctx) tags.push(ctx[1] + 'K')
  else {
    const ctxM = modelId.match(/(\d+)m/i)
    if (ctxM) tags.push(ctxM[1] + 'M')
  }
  if (lower.includes('moe')) tags.push('MoE')
  if (lower.includes('turbo')) tags.push('Turbo')
  if (lower.includes('flash')) tags.push('Flash')
  if (lower.includes('pro')) tags.push('Pro')

  const provider = modelId.includes('/') ? modelId.split('/')[0] : ''
  const shortName = modelId.split('/').pop() || modelId
  return { tags: tags.slice(0, 5), provider, shortName }
}

// ── Color palette per provider ────────────────────────────────────────────

const PROVIDER_PALETTE: Record<string, { dot: string; cardBg: string; headerBg: string; accent: string }> = {
  'DeepSeek 官方': { dot: '#4D6BFE', cardBg: 'bg-[#EEF2FF] dark:bg-[#1E2448]', headerBg: 'bg-[#EEF2FF]/50 dark:bg-[#1E2448]/30', accent: '#4D6BFE' },
  '硅基流动':     { dot: '#7C3AED', cardBg: 'bg-[#F5F3FF] dark:bg-[#2A2048]', headerBg: 'bg-[#F5F3FF]/50 dark:bg-[#2A2048]/30', accent: '#7C3AED' },
  '通义千问':     { dot: '#F59E0B', cardBg: 'bg-[#FFFBEB] dark:bg-[#3D2E10]', headerBg: 'bg-[#FFFBEB]/50 dark:bg-[#3D2E10]/30', accent: '#F59E0B' },
  '智谱AI':       { dot: '#3B82F6', cardBg: 'bg-[#EFF6FF] dark:bg-[#1E3050]', headerBg: 'bg-[#EFF6FF]/50 dark:bg-[#1E3050]/30', accent: '#3B82F6' },
  'Headroom压缩': { dot: '#F43F5E', cardBg: 'bg-[#FFF1F2] dark:bg-[#3D1820]', headerBg: 'bg-[#FFF1F2]/50 dark:bg-[#3D1820]/30', accent: '#F43F5E' },
}
const DEF_PALETTE = { dot: '#94A3B8', cardBg: 'bg-card', headerBg: 'bg-muted/30', accent: '#64748B' }

// ── Model Card ────────────────────────────────────────────────────────────

function ModelCard({ model, onClick, palette }: { model: ModelInfo; onClick: () => void; palette: typeof DEF_PALETTE }) {
  const info = useMemo(() => parseModelInfo(model.id), [model.id])

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-lg border border-transparent ${palette.cardBg} p-4 transition-all duration-150 hover:border-border hover:shadow-sm`}
    >
      {/* Top row: brand logo + provider */}
      <div className="flex items-center gap-2.5 mb-3">
        <BrandLogo name={model.channel_name} size={28} />
        <span className="text-[11px] font-medium text-muted-foreground truncate">
          {model.channel_name}
        </span>
      </div>

      {/* Model name */}
      <h3 className="font-semibold text-[13px] leading-snug mb-1 truncate">
        {info.shortName}
      </h3>

      {/* Provider org path */}
      {info.provider && (
        <p className="text-[10px] text-muted-foreground/50 mb-2.5 font-mono truncate">
          {info.provider}
        </p>
      )}

      {/* Tags */}
      {info.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {info.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded border bg-white/60 dark:bg-black/20 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Detail Dialog ─────────────────────────────────────────────────────────

function ModelDetailDialog({ model, open, onClose }: { model: ModelInfo | null; open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  if (!model) return null
  const info = parseModelInfo(model.id)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <BrandLogo name={model.channel_name} size={36} />
            <div>
              <DialogTitle className="text-base">{info.shortName}</DialogTitle>
              <p className="text-xs text-muted-foreground">{model.channel_name}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <code className="block text-[11px] bg-muted px-2 py-1.5 rounded font-mono break-all">{model.id}</code>
          {info.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {info.tags.map((t) => <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>)}
            </div>
          )}
          <div className="rounded-lg border p-3 flex items-center gap-2 text-sm">
            <Cpu className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{t('状态')}</span>
            <span className={`ml-auto font-medium ${model.enabled ? 'text-green-600' : 'text-red-500'}`}>
              {model.enabled ? t('已启用') : t('已禁用')}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5"><ExternalLink className="size-3.5" />{t('API 文档')}</Button>
            <Button size="sm" className="flex-1 gap-1.5"><Zap className="size-3.5" />{t('在线体验')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

function ModelMarketplace() {
  const { t } = useTranslation()
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ModelInfo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => { loadModels() }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/user/marketplace/models')
      if (res.data?.success) setModels(res.data.data || [])
    } catch { /* */ }
    finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return models
    const q = search.toLowerCase()
    return models.filter(m => m.id.toLowerCase().includes(q) || m.channel_name.toLowerCase().includes(q))
  }, [models, search])

  const grouped = useMemo(() => {
    const g: Record<string, ModelInfo[]> = {}
    for (const m of filtered) {
      if (!g[m.channel_name]) g[m.channel_name] = []
      g[m.channel_name].push(m)
    }
    return g
  }, [filtered])

  return (
    <Main>
      <div className="flex flex-col gap-7 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t('模型广场')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{t('浏览所有可用模型，按供应商分类')}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('搜索模型...')} className="pl-9 pr-8 h-9" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
            <Search className="size-10 opacity-20" />
            <p className="text-sm">{search ? t('没有匹配的模型') : t('暂无可用模型')}</p>
          </div>
        )}

        {!loading && Object.entries(grouped).map(([channel, channelModels]) => {
          const palette = PROVIDER_PALETTE[channel] || DEF_PALETTE
          return (
            <section key={channel}>
              {/* Section header with subtle colored bg */}
              <div className={`flex items-center gap-2.5 mb-3 px-3 py-2 rounded-lg ${palette.headerBg}`}>
                <BrandLogo name={channel} size={22} />
                <span className="text-[13px] font-semibold">{channel}</span>
                <span className="text-[11px] text-muted-foreground">{channelModels.length} {t('个模型')}</span>
              </div>

              {/* Card grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {channelModels.map((m) => (
                  <ModelCard
                    key={`${m.channel_id}-${m.id}`}
                    model={m}
                    palette={palette}
                    onClick={() => { setSelected(m); setDialogOpen(true) }}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
      <ModelDetailDialog model={selected} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Main>
  )
}
