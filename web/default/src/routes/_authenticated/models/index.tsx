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

// ── Brand Logo SVGs ──────────────────────────────────────────────────────

const BrandLogo = ({ name, size = 32 }: { name: string; size?: number }) => {
  const key = name.toLowerCase()
  if (key.includes('deepseek') || key.includes('深度'))
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#4D6BFE" />
        <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3" fill="#fff" />
      </svg>
    )
  if (key.includes('硅基') || key.includes('silicon'))
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#7C3AED" />
        <path d="M10 22V10l6 6 6-6v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  if (key.includes('通义') || key.includes('qwen') || key.includes('阿里'))
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#F59E0B" />
        <circle cx="16" cy="16" r="5" stroke="#fff" strokeWidth="2" fill="none" />
        <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  if (key.includes('智谱') || key.includes('zhipu') || key.includes('glm'))
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#3B82F6" />
        <path d="M10 22l6-12 6 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="16" cy="14" r="2" fill="#fff" />
      </svg>
    )
  if (key.includes('headroom') || key.includes('压缩'))
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#F43F5E" />
        <path d="M8 20l4-4 4 4 4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 14l4-4 4 4 4-4 4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      </svg>
    )
  // Default: geometric mark
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#64748B" />
      <rect x="8" y="10" width="16" height="12" rx="2" stroke="#fff" strokeWidth="1.5" fill="none" />
      <path d="M12 14h8M12 18h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Provider color config ─────────────────────────────────────────────────

const PROVIDER_COLORS: Record<string, { border: string; dot: string; cardBg: string }> = {
  'DeepSeek 官方': { border: 'border-l-[#4D6BFE]', dot: 'bg-[#4D6BFE]', cardBg: 'bg-[#4D6BFE]/[0.03]' },
  '硅基流动': { border: 'border-l-[#7C3AED]', dot: 'bg-[#7C3AED]', cardBg: 'bg-[#7C3AED]/[0.03]' },
  '通义千问': { border: 'border-l-[#F59E0B]', dot: 'bg-[#F59E0B]', cardBg: 'bg-[#F59E0B]/[0.03]' },
  '智谱AI': { border: 'border-l-[#3B82F6]', dot: 'bg-[#3B82F6]', cardBg: 'bg-[#3B82F6]/[0.03]' },
  'Headroom压缩': { border: 'border-l-[#F43F5E]', dot: 'bg-[#F43F5E]', cardBg: 'bg-[#F43F5E]/[0.03]' },
}
const DEFAULT_COLORS = { border: 'border-l-slate-400', dot: 'bg-slate-400', cardBg: 'bg-slate-50 dark:bg-slate-900/20' }

// ── Tag Parser ────────────────────────────────────────────────────────────

function parseModelTags(modelId: string): string[] {
  const tags: string[] = []
  const lower = modelId.toLowerCase()
  if (lower.includes('vision') || lower.includes('vl') || lower.includes('image')) tags.push('视觉')
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
  return tags.slice(0, 5)
}

// ── Model Card ────────────────────────────────────────────────────────────

function ModelCard({ model, onClick }: { model: ModelInfo; onClick: () => void }) {
  const colors = PROVIDER_COLORS[model.channel_name] || DEFAULT_COLORS
  const tags = useMemo(() => parseModelTags(model.id), [model.id])
  const shortName = model.id.split('/').pop() || model.id
  const provider = model.id.includes('/') ? model.id.split('/')[0] : ''

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl border bg-card ${colors.border} border-l-[3px] transition-all duration-200 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 dark:hover:shadow-white/5`}
    >
      <div className="p-5">
        {/* Top: brand logo + provider */}
        <div className="flex items-center gap-3 mb-4">
          <BrandLogo name={model.channel_name} size={32} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">
              {model.channel_name}
            </p>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>

        {/* Model name */}
        <h3 className="font-semibold text-sm leading-snug mb-1.5 truncate" title={model.id}>
          {shortName}
        </h3>

        {/* Provider path (if applicable) */}
        {provider && (
          <p className="text-[11px] text-muted-foreground/70 mb-3 font-mono truncate">
            {provider}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Model Detail Dialog ──────────────────────────────────────────────────

function ModelDetailDialog({ model, open, onClose }: { model: ModelInfo | null; open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  if (!model) return null

  const tags = parseModelTags(model.id)
  const shortName = model.id.split('/').pop() || model.id
  const colors = PROVIDER_COLORS[model.channel_name] || DEFAULT_COLORS

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <BrandLogo name={model.channel_name} size={36} />
            <div>
              <DialogTitle className="text-lg">{shortName}</DialogTitle>
              <p className="text-xs text-muted-foreground">{model.channel_name}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('模型标识')}</p>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all">
              {model.id}
            </code>
          </div>

          {tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('能力标签')}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border p-4 space-y-3">
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
                <span className={`inline-flex items-center gap-1 font-medium ${model.enabled ? 'text-green-600' : 'text-red-500'}`}>
                  <span className={`size-1.5 rounded-full ${model.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                  {model.enabled ? t('已启用') : t('已禁用')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
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
      <div className="flex flex-col gap-6 p-6 md:p-8">
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
          const colors = PROVIDER_COLORS[channel] || DEFAULT_COLORS
          return (
            <section key={channel}>
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo name={channel} size={24} />
                <h3 className="text-sm font-semibold">{channel}</h3>
                <span className={`size-1.5 rounded-full ${colors.dot}`} />
                <span className="text-xs text-muted-foreground">{channelModels.length} {t('个模型')}</span>
              </div>
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
