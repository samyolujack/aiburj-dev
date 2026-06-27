import { useState, useEffect, useCallback } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Send, Download, RotateCcw, Video, Clock } from 'lucide-react'
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/video-gen/')({
  beforeLoad: () => {
    if (!isSidebarModuleEnabled('experience', 'video')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: VideoGenPage,
})

const VIDEO_MODELS = [
  { value: 'Wan-AI/Wan2.2-T2V-14B', label: 'Wan2.2 文生视频 (14B)' },
  { value: 'Wan-AI/Wan2.2-I2V-14B', label: 'Wan2.2 图生视频 (14B)' },
  { value: 'THUDM/CogVideoX-5B', label: 'CogVideoX (5B)' },
]

const DURATIONS = [
  { value: '5', label: '5 秒' },
  { value: '10', label: '10 秒' },
]

const RESOLUTIONS = [
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
]

function VideoGenPage() {
  const { t } = useTranslation()
  const { models, groupRatio, usableGroup, endpointMap, autoGroups, priceRate, usdExchangeRate } = usePricingData()
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState(VIDEO_MODELS[0].value)
  const [duration, setDuration] = useState(DURATIONS[0].value)
  const [resolution, setResolution] = useState(RESOLUTIONS[1].value)
  const [showModelDetail, setShowModelDetail] = useState(false)

  const selectedModelData = models?.find(m => m.model_name === model) || null
  const [generating, setGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [taskId, setTaskId] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  // Poll for video completion
  useEffect(() => {
    if (!taskId || !generating) return
    let cancelled = false
    const poll = async () => {
      try {
        const r = await api.get(`/pg/video/result?task_id=${taskId}`)
        if (cancelled) return
        const d = r.data
        if (d.status === 'completed' && d.video_url) {
          setVideoUrl(d.video_url)
          setGenerating(false)
          setProgress('')
          toast.success('视频生成完成')
        } else if (d.status === 'failed') {
          setError(d.error || '生成失败')
          setGenerating(false)
          setProgress('')
        } else {
          setProgress(d.status || '处理中...')
          setTimeout(poll, 3000)
        }
      } catch {
        setTimeout(poll, 3000)
      }
    }
    poll()
    return () => { cancelled = true }
  }, [taskId, generating])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词')
      return
    }
    setError('')
    setVideoUrl('')
    setGenerating(true)
    setProgress('提交中...')
    try {
      const r = await api.post('/pg/video/generations', {
        model,
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim() || undefined,
        duration: parseInt(duration),
        resolution,
      })
      const d = r.data
      if (d.task_id) {
        setTaskId(d.task_id)
      } else if (d.id) {
        setTaskId(d.id)
      } else if (d.data?.task_id) {
        setTaskId(d.data.task_id)
      } else if (d.video_url) {
        setVideoUrl(d.video_url)
        setGenerating(false)
        setProgress('')
        toast.success('视频生成完成')
      } else {
        setError('未获取到任务 ID')
        setGenerating(false)
        setProgress('')
      }
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || '请求失败')
      setGenerating(false)
      setProgress('')
    }
  }

  const handleReset = () => {
    setPrompt('')
    setNegativePrompt('')
    setVideoUrl('')
    setTaskId('')
    setError('')
    setProgress('')
    setGenerating(false)
  }

  const handleDownload = useCallback(async () => {
    if (!videoUrl) return
    try {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = 'generated-video.mp4'
      a.click()
    } catch {
      window.open(videoUrl, '_blank')
    }
  }, [videoUrl])

  return (
    <Main>
      <div className="flex h-full flex-col gap-6 p-6 md:flex-row md:p-8">
        {/* Left config panel */}
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-[360px]">
          <CostNotice
            modelName={model.split('/').pop()}
            onDetailClick={() => setShowModelDetail(true)}
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('视频生成')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('输入提示词，生成视频')}</p>
          </div>

          {/* Model */}
          <div className="space-y-1">
            <Label className="text-sm">{t('模型')}</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {VIDEO_MODELS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <Label className="text-sm">{t('时长')}</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DURATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Resolution */}
          <div className="space-y-1">
            <Label className="text-sm">{t('分辨率')}</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {RESOLUTIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt */}
          <div className="space-y-1">
            <Label className="text-sm">{t('提示词')}</Label>
            <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={t('描述你想生成的视频内容...')}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Negative prompt */}
          <div className="space-y-1">
            <Label className="text-sm">{t('负向提示词')}</Label>
            <Input
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              placeholder={t('排除的内容（选填）')}
            />
          </div>

          {/* Generate button */}
          <Button onClick={handleGenerate} disabled={generating} className="w-full gap-2">
            {generating ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {generating ? t('生成中...') : t('生成视频')}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Right result area */}
        <div className="flex flex-1 items-center justify-center rounded-xl border bg-muted/30 p-6">
          {!videoUrl && !generating && !error && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Video className="size-12 opacity-40" />
              <p className="text-sm">{t('输入提示词后点击生成')}</p>
            </div>
          )}

          {generating && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="size-12 animate-spin" />
              <p className="text-sm">{t('视频生成中...')}</p>
              {progress && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                  <Clock className="size-3" />
                  {progress}
                </div>
              )}
            </div>
          )}

          {videoUrl && (
            <div className="flex w-full flex-col gap-3">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: '60vh' }}
              />
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-1 size-4" />{t('下载')}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-1 size-4" />{t('重置')}
                </Button>
              </div>
            </div>
          )}

          {error && !generating && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <p className="text-sm text-destructive">{error}</p>
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
