import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Send, Download, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { isSidebarModuleEnabled } from '@/lib/nav-modules'
import { Main } from '@/components/layout'
import { CostNotice } from '@/components/cost-notice'
import { ModelDetailsDrawer } from '@/features/pricing/components/model-details'
import { usePricingData } from '@/features/pricing/hooks/use-pricing-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/image-gen/')({
  beforeLoad: () => {
    if (!isSidebarModuleEnabled('experience', 'image')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: ImageGenPage,
})

const IMAGE_MODELS = [
  { value: 'Kwai-Kolors/Kolors', label: 'Kolors（可图）' },
  { value: 'Qwen/Qwen-Image', label: 'Qwen 图像' },
  { value: 'Tongyi-MAI/Z-Image-Turbo', label: 'Z-Image Turbo' },
]

const IMAGE_SIZES = [
  { value: '1024x1024', label: '1:1（1024×1024）' },
  { value: '1152x768', label: '3:2（1152×768）' },
  { value: '768x1152', label: '2:3（768×1152）' },
  { value: '1344x768', label: '16:9（1344×768）' },
  { value: '768x1344', label: '9:16（768×1344）' },
]

type GeneratedImage = {
  url?: string
  b64_json?: string
}

function ImageGenPage() {
  const { t } = useTranslation()
  const { models, groupRatio, usableGroup, endpointMap, autoGroups, priceRate, usdExchangeRate } = usePricingData()
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState(IMAGE_MODELS[0].value)
  const [size, setSize] = useState(IMAGE_SIZES[0].value)
  const [seed, setSeed] = useState('')
  const [showModelDetail, setShowModelDetail] = useState(false)

  const selectedModelData = models?.find(m => m.model_name === model) || null
  const [generating, setGenerating] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('请输入图像描述'))
      return
    }
    setGenerating(true)
    setError('')
    setImages([])
    try {
      const body: Record<string, unknown> = {
        model,
        prompt: prompt.trim(),
        n: 1,
        size,
      }
      if (seed) body.seed = parseInt(seed, 10)

      const res = await api.post('/pg/images/generations', body)
      // Handle both OpenAI-format {data: [...]} and Relay-format {images: [...]}
      const images = res.data?.images || res.data?.data || (Array.isArray(res.data) ? res.data : null)
      if (images && images.length > 0) {
        setImages(images)
        toast.success(t('图像生成成功'))
      } else if (res.data?.url || res.data?.b64_json) {
        setImages([res.data])
        toast.success(t('图像生成成功'))
      } else if (res.data?.error) {
        setError(typeof res.data.error === 'string' ? res.data.error : res.data.error?.message || t('生成失败'))
        toast.error(t('生成失败'))
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('请求失败')
      setError(msg)
      toast.error(t('生成失败，请检查模型配置'))
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setImages([])
    setError('')
    setSeed('')
  }

  const downloadImage = (url: string, index: number) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-image-${Date.now()}-${index}.png`
    a.click()
  }

  return (
    <Main>
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left: Config panel */}
        <div className="flex shrink-0 flex-col gap-5 border-r p-6 lg:w-[360px]">
          <CostNotice
            modelName={model.split('/').pop()}
            onDetailClick={() => setShowModelDetail(true)}
          />
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              🖼️ {t('图像生成')}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {t('输入描述文字，AI 为你生成图像')}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('模型')} Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('图像尺寸')} Image Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('随机种子')} Seed</Label>
            <Input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder={t('留空为随机')}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('图像描述')} Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('例如：一只可爱的橘猫坐在窗台上，阳光透过窗户照进来，温暖的光线，高画质')}
              rows={4}
              className="text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="flex-1 gap-2"
            >
              {generating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {generating ? t('生成中...') : t('生成')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={generating}
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Right: Result panel */}
        <div className="flex flex-1 items-start justify-center bg-muted/20 p-6 lg:p-10">
          {images.length > 0 ? (
            <div className="flex w-full flex-col gap-4">
              {images.map((img, i) => {
                const src = img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : '')
                if (!src) return null
                return (
                  <div key={i} className="group relative overflow-hidden rounded-xl border bg-white shadow-sm">
                    <img
                      src={src}
                      alt={`Generated ${i + 1}`}
                      className="w-full object-contain"
                      style={{ maxHeight: '60vh' }}
                    />
                    {img.url && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 right-3 gap-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => downloadImage(img.url!, i)}
                      >
                        <Download className="size-3.5" />
                        {t('下载')}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 pt-20 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50">
                <Send className="size-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('在左侧输入描述文字，点击生成开始创作')}
              </p>
            </div>
          )}
        </div>
      </div>
      {showModelDetail && selectedModelData && (
        <ModelDetailsDrawer
          open={showModelDetail}
          onOpenChange={setShowModelDetail}
          model={selectedModelData}
          groupRatio={groupRatio || {}}
          usableGroup={usableGroup || {}}
          endpointMap={endpointMap || {}}
          autoGroups={autoGroups || []}
          priceRate={priceRate || 1}
          usdExchangeRate={usdExchangeRate || 7.2}
          tokenUnit='M'
        />
      )}
    </Main>
  )
}
