import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Search, X, ExternalLink, Zap, Cpu, ArrowUpRight, ChevronRight } from 'lucide-react'
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

function BrandLogo({ name, size = 36 }: { name: string; size?: number }) {
  const key = name.toLowerCase()
  const iconMap: Record<string, string> = {
    'deepseek 官方': 'deepseek',
    'deepseek': 'deepseek',
    '通义千问': 'alibabacloud',
    'qwen': 'alibabacloud',
    'minimax': 'minimax',
  }

  const simpleIconSlug = iconMap[Object.keys(iconMap).find(k => key.includes(k)) || ''] ?? ''
  const brandColor = PROVIDER_ACCENT[name] || '#64748B'

  if (simpleIconSlug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${simpleIconSlug}/${brandColor.replace('#', '')}`}
        alt={name}
        width={size}
        height={size}
        className="rounded-lg object-contain"
        style={{ filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.05))' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  // Polished SVG fallback for brands not in Simple Icons
  return <BrandLogoFallback name={name} size={size} color={brandColor} />
}

function BrandLogoFallback({ name, size, color }: { name: string; size: number; color: string }) {
  const key = name.toLowerCase()
  const initials = name.replace(/[a-z]/g, '').slice(0, 2) || name.slice(0, 2).toUpperCase()

  if (key.includes('硅基')) {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill={color} />
        <path d="M11 22V14l7 5 7-5v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="18" cy="13" r="1.5" fill="#fff" />
      </svg>
    )
  }
  if (key.includes('智谱') || key.includes('zhipu')) {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill={color} />
        <path d="M12 23l6-10 6 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="18" cy="15" r="2" fill="#fff" />
      </svg>
    )
  }

  // Generic: brand initial
  return (
    <div
      className="flex items-center justify-center rounded-lg text-white text-sm font-bold"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

// ── Provider Accent Colors ─────────────────────────────────────────────────

const PROVIDER_ACCENT: Record<string, string> = {
  'DeepSeek 官方': '#4D6BFE',
  '硅基流动': '#7C3AED',
  '通义千问': '#F59E0B',
  '智谱AI': '#3B82F6',
  'Headroom压缩': '#F43F5E',
}

// ── Tag Parser ────────────────────────────────────────────────────────────

function parseModelInfo(modelId: string) {
  const lower = modelId.toLowerCase()
  const tags: string[] = []
  if (lower.includes('vision') || lower.includes('vl')) tags.push('视觉')
  if (lower.includes('reason') || lower.includes('think') || lower.includes('r1')) tags.push('推理')
  if (lower.includes('code') || lower.includes('coder')) tags.push('编程')
  if (lower.includes('tool') || lower.includes('function')) tags.push('Tools')
  const ctx = modelId.match(/(\d+)k/i)
  if (ctx) tags.push(ctx[1] + 'K')
  else {
    const ctxM = modelId.match(/(\d+)m/i)
    if (ctxM) tags.push(ctxM[1] + 'M')
  }
  if (lower.includes('moe')) tags.push('MoE')
  if (lower.includes('pro')) tags.push('Pro')
  if (lower.includes('turbo')) tags.push('Turbo')
  if (lower.includes('flash')) tags.push('Flash')
  if (lower.includes('lite')) tags.push('Lite')

  const provider = modelId.includes('/') ? modelId.split('/')[0] : ''
  const shortName = modelId.split('/').pop() || modelId

  return { tags: tags.slice(0, 6), provider, shortName }
}

// ── Model Card ────────────────────────────────────────────────────────────

function ModelCard({ model, onClick }: { model: ModelInfo; onClick: () => void }) {
  const info = useMemo(() => parseModelInfo(model.id), [model.id])
  const accent = PROVIDER_ACCENT[model.channel_name] || '#64748B'

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5"
    >
      {/* Brand row */}
      <div className="flex items-center gap-3 mb-4">
        <BrandLogo name={model.channel_name} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground truncate">
            {model.channel_name}
          </p>
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0" />
      </div>

      {/* Model name */}
      <h3 className="font-semibold text-sm mb-1.5 truncate">
        {info.shortName}
      </h3>

      {/* Provider org */}
      {info.provider && (
        <p className="text-[11px] text-muted-foreground/60 mb-3 font-mono truncate">
          {info.provider}
        </p>
      )}

      {/* Tags */}
      {info.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {info.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom accent bar */}
      <div className="mt-4 -mx-5 -mb-5 h-1 rounded-b-xl" style={{ backgroundColor: accent, opacity: 0.15 }} />
    </div>
  )
}

// ── Model Detail Panel ────────────────────────────────────────────────────

function ModelDetailDialog({ model, open, onClose }: { model: ModelInfo | null; open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  if (!model) return null

  const info = parseModelInfo(model.id)
  const accent = PROVIDER_ACCENT[model.channel_name] || '#64748B'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <BrandLogo name={model.channel_name} size={40} />
            <div>
              <DialogTitle className="text-lg">{info.shortName}</DialogTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {model.channel_name}
                <span className="size-1 rounded-full bg-muted-foreground/40" />
                <code className="text-[11px]">{model.id}</code>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {info.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">{t('能力标签')}</p>
              <div className="flex flex-wrap gap-1.5">
                {info.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border p-4 space-y-3" style={{ borderLeftColor: accent, borderLeftWidth: 3 }}>
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Cpu className="size-4" />
              {t('模型信息')}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">{t('供应商')}</p>
                <p className="font-medium">{model.channel_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('状态')}</p>
                <span className={`inline-flex items-center gap-1.5 font-medium text-sm ${model.enabled ? 'text-green-600' : 'text-red-500'}`}>
                  <span className={`size-2 rounded-full ${model.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                  {model.enabled ? t('已启用') : t('已禁用')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-9">
              <ExternalLink className="size-3.5" />
              {t('API 文档')}
            </Button>
            <Button size="sm" className="flex-1 gap-1.5 h-9">
              <Zap className="size-3.5" />
              {t('在线体验')}
            </Button>
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
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => { loadModels() }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/user/marketplace/models')
      if (res.data?.success) setModels(res.data.data || [])
    } catch { /* empty */ }
    finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return models
    const q = search.toLowerCase()
    return models.filter(m => m.id.toLowerCase().includes(q) || m.channel_name.toLowerCase().includes(q))
  }, [models, search])

  const grouped = useMemo(() => {
    const groups: Record<string, ModelInfo[]> = {}
    for (const m of filtered) {
      if (!groups[m.channel_name]) groups[m.channel_name] = []
      groups[m.channel_name].push(m)
    }
    return groups
  }, [filtered])

  return (
    <Main>
      <div className="flex flex-col gap-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t('模型广场')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('浏览所有可用模型，按供应商分类')}
            </p>
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

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-20 text-center text-muted-foreground">
            <Search className="size-10 opacity-20" />
            <p className="text-sm">{search ? t('没有匹配的模型') : t('暂无可用模型')}</p>
          </div>
        )}

        {!loading && Object.entries(grouped).map(([channel, channelModels]) => {
          const accent = PROVIDER_ACCENT[channel] || '#64748B'
          return (
            <section key={channel}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo name={channel} size={28} />
                <div>
                  <h3 className="text-sm font-semibold">{channel}</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {channelModels.length} {t('个模型')}
                </span>
                <ChevronRight className="size-4 text-muted-foreground/30" />
              </div>

              {/* Card grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {channelModels.map((m) => (
                  <ModelCard
                    key={`${m.channel_id}-${m.id}`}
                    model={m}
                    onClick={() => { setSelectedModel(m); setDialogOpen(true) }}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <ModelDetailDialog model={selectedModel} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Main>
  )
}
