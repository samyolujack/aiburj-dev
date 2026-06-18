import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Image, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { isSidebarModuleEnabled } from '@/lib/nav-modules'
import { Main } from '@/components/layout'
import { Button } from '@/components/ui/button'
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

type GeneratedImage = {
  url?: string
  b64_json?: string
}

function ImageGenPage() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState(IMAGE_MODELS[0].value)
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
      const res = await api.post('/pg/images/generations', {
        model,
        prompt: prompt.trim(),
        n: 1,
        size: '1024x1024',
      })
      const data = res.data?.data || res.data
      if (Array.isArray(data)) {
        setImages(data)
        toast.success(t('图像生成成功'))
      } else if (res.data?.error) {
        setError(res.data.error.message || t('生成失败'))
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

  return (
    <Main>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6 md:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            🖼️ {t('图像生成')}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('输入描述文字，AI 为你生成图像')}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label>{t('选择模型')}</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
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
            <Label>{t('图像描述')}</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('例如：一只可爱的橘猫坐在窗台上，阳光透过窗户照进来，温暖的光线')}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {generating ? t('生成中...') : t('生成图像')}
          </Button>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {images.length > 0 && (
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium">{t('生成结果')}</h3>
            <div className="grid gap-4">
              {images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg border">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={`Generated ${i + 1}`}
                      className="w-full object-contain"
                      style={{ maxHeight: 512 }}
                    />
                  ) : img.b64_json ? (
                    <img
                      src={`data:image/png;base64,${img.b64_json}`}
                      alt={`Generated ${i + 1}`}
                      className="w-full object-contain"
                      style={{ maxHeight: 512 }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Main>
  )
}
