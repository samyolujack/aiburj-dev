import { useState, useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Search, X, ExternalLink, Zap, Cpu, Layers } from 'lucide-react'
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

// Provider display config
const PROVIDER_STYLES: Record<string, { bg: string; border: string; accent: string; logo: string }> = {
  'DeepSeek 官方': { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800', accent: 'text-emerald-700 dark:text-emerald-400', logo: '🟢' },
  '硅基流动': { bg: 'bg-violet-50 dark:bg-violet-950/20', border: 'border-violet-200 dark:border-violet-800', accent: 'text-violet-700 dark:text-violet-400', logo: '🟣' },
  '通义千问': { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', accent: 'text-amber-700 dark:text-amber-400', logo: '🟠' },
  '智谱AI': { bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', accent: 'text-blue-700 dark:text-blue-400', logo: '🔵' },
  'Headroom压缩': { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-800', accent: 'text-rose-700 dark:text-rose-400', logo: '🗜️' },
}

const DEFAULT_STYLE = { bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-700', accent: 'text-slate-600 dark:text-slate-400', logo: '📦' }

function parseModelTags(modelId: string): string[] {
  const tags: string[] = []
  const lower = modelId.toLowerCase()
  if (lower.includes('vision') || lower.includes('vl') || lower.includes('image')) tags.push('视觉')
  if (lower.includes('reason') || lower.includes('think') || lower.includes('r1')) tags.push('推理')
  if (lower.includes('code') || lower.includes('coder')) tags.push('编程')
  if (lower.includes('tool') || lower.includes('function')) tags.push('Tools')
  if (lower.includes('32k') || lower.includes('128k') || lower.includes('1m')) tags.push('长上下文')
  if (lower.includes('moe')) tags.push('MoE')
  if (lower.includes('pro')) tags.push('Pro')
  if (lower.includes('turbo')) tags.push('Turbo')
  if (lower.includes('flash')) tags.push('Flash')
  if (lower.includes('lite')) tags.push('Lite')
  return tags.slice(0, 4)
}

function extractContextSize(modelId: string): string | null {
  const match = modelId.match(/(\d+)k/i)
  if (match) return match[1] + 'K'
  const matchM = modelId.match(/(\d+)m/i)
  if (matchM) return matchM[1] + 'M'
  return null
}

function ModelCard({
  model,
  style,
  onClick,
}: {
  model: ModelInfo
  style: typeof DEFAULT_STYLE
  onClick: () => void
}) {
  const tags = useMemo(() => parseModelTags(model.id), [model.id])
  const ctx = extractContextSize(model.id)
  const shortName = model.id.split('/').pop() || model.id

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${style.bg} ${style.border}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-medium text-muted-foreground truncate">
              {model.channel_name}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-tight truncate" title={model.id}>
            {shortName}
          </h3>
        </div>
        <div className={`shrink-0 ml-2 flex size-8 items-center justify-center rounded-lg ${style.accent} bg-background/50 text-lg`}>
          {style.logo}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {model.id}
      </p>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background/50"
            >
              {tag}
            </span>
          ))}
          {ctx && (
            <span className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background/50">
              {ctx}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="size-3 mr-1" />
          详情
        </Button>
      </div>
    </div>
  )
}

function ModelDetailDialog({
  model,
  open,
  onClose,
}: {
  model: ModelInfo | null
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  if (!model) return null

  const tags = parseModelTags(model.id)
  const ctx = extractContextSize(model.id)
  const shortName = model.id.split('/').pop() || model.id

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <span>{shortName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Provider */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('提供商')}</p>
            <p className="text-sm font-medium">{model.channel_name}</p>
          </div>

          {/* Full model ID */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('模型标识')}</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">{model.id}</code>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('能力标签')}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Model Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="text-sm font-medium">{t('模型信息')}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {ctx && (
                <div>
                  <p className="text-xs text-muted-foreground">{t('上下文')}</p>
                  <p className="font-medium">{ctx}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">{t('状态')}</p>
                <p className={`font-medium ${model.enabled ? 'text-green-600' : 'text-red-500'}`}>
                  {model.enabled ? t('已启用') : t('已禁用')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
              <ExternalLink className="size-3.5" />
              {t('API 文档')}
            </Button>
            <Button size="sm" className="flex-1 gap-1.5">
              <Zap className="size-3.5" />
              {t('在线体验')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ModelMarketplace() {
  const { t } = useTranslation()
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/user/marketplace/models')
      if (res.data?.success) {
        setModels(res.data.data || [])
      }
    } catch {
      // fallback: show empty
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return models
    const q = search.toLowerCase()
    return models.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.channel_name.toLowerCase().includes(q)
    )
  }, [models, search])

  // Group by channel
  const grouped = useMemo(() => {
    const groups: Record<string, ModelInfo[]> = {}
    for (const m of filtered) {
      if (!groups[m.channel_name]) groups[m.channel_name] = []
      groups[m.channel_name].push(m)
    }
    return groups
  }, [filtered])

  const handleModelClick = (model: ModelInfo) => {
    setSelectedModel(model)
    setDialogOpen(true)
  }

  return (
    <Main>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('模型广场')}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('浏览所有可用模型，按供应商分类，点击查看详情')}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('搜索模型...')}
              className="pl-9 pr-8 h-9"
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
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <Layers className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              {search ? t('没有匹配的模型') : t('暂无可用模型')}
            </p>
          </div>
        )}

        {/* Grouped model cards */}
        {!loading &&
          Object.entries(grouped).map(([channel, channelModels]) => {
            const style = PROVIDER_STYLES[channel] || DEFAULT_STYLE
            return (
              <div key={channel}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{style.logo}</span>
                  <h3 className={`text-sm font-semibold ${style.accent}`}>
                    {channel}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {channelModels.length} {t('个模型')}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {channelModels.map((m) => (
                    <ModelCard
                      key={`${m.channel_id}-${m.id}`}
                      model={m}
                      style={style}
                      onClick={() => handleModelClick(m)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
      </div>

      {/* Detail dialog */}
      <ModelDetailDialog
        model={selectedModel}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Main>
  )
}
