import { useState, useRef } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Mic, Download, RotateCcw, Volume2 } from 'lucide-react'
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
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/tts/')({
  beforeLoad: () => {
    if (!isSidebarModuleEnabled('experience', 'tts')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: TTSPage,
})

const TTS_MODELS = [
  { value: 'FunAudioLLM/CosyVoice2-0.5B', label: 'CosyVoice2（余弦语音）' },
]

const VOICES = [
  { value: 'zh-CN-XiaoxiaoNeural', label: '晓晓（女声）' },
  { value: 'zh-CN-YunxiNeural', label: '云希（男声）' },
  { value: 'zh-CN-XiaoyiNeural', label: '晓伊（女声）' },
  { value: 'zh-CN-YunjianNeural', label: '云健（男声）' },
]

const QUICK_TEXTS = [
  '作为集合顶尖大模型的一站式平台，我们致力于为开发者提供便捷的AI能力接入服务。',
  '家，是一份永远不变的依靠。无论走多远，心中总有一个温暖的港湾在等你归来。',
  '八百标兵奔北坡，炮兵并排北边跑。炮兵怕把标兵碰，标兵怕碰炮兵炮。',
]

function TTSPage() {
  const { t } = useTranslation()
  const { models, groupRatio, usableGroup, endpointMap, autoGroups, priceRate, usdExchangeRate } = usePricingData()
  const [text, setText] = useState('')
  const [model, setModel] = useState(TTS_MODELS[0].value)
  const [voice, setVoice] = useState(VOICES[0].value)
  const [speed, setSpeed] = useState([1.0])
  const [volumeGain, setVolumeGain] = useState([0])
  const [generating, setGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [error, setError] = useState('')
  const [showModelDetail, setShowModelDetail] = useState(false)

  const selectedModelData = models?.find(m => m.model_name === model) || null
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error(t('请输入要转换的文字'))
      return
    }
    setGenerating(true)
    setError('')
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl('')
    }
    try {
      const body: Record<string, unknown> = {
        model,
        input: text.trim(),
        voice,
        response_format: 'mp3',
      }
      if (speed[0] !== 1.0) body.speed = speed[0]

      const res = await api.post('/pg/audio/speech', body, {
        responseType: 'blob',
      })
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data])
      if (blob.size < 100) {
        // Might be an error JSON
        const text = await blob.text()
        try {
          const err = JSON.parse(text)
          throw new Error(err.error?.message || text)
        } catch {
          throw new Error(text)
        }
      }
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      toast.success(t('语音生成成功'))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('请求失败')
      setError(msg)
      toast.error(t('生成失败，请检查模型配置'))
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setText('')
    setAudioUrl('')
    setError('')
    setSpeed([1.0])
    setVolumeGain([0])
  }

  const downloadAudio = () => {
    if (!audioUrl) return
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `ai-tts-${Date.now()}.mp3`
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
              🎙️ {t('语音合成')}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {t('输入文字，AI 为你朗读')}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('模型')} Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TTS_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('语音')} Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VOICES.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                {t('语速')} Speed
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {speed[0].toFixed(1)}x
              </span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.25}
              max={4}
              step={0.25}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0.25x</span>
              <span>1.0x</span>
              <span>4.0x</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                {t('音量增益')} (dB)
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {volumeGain[0] > 0 ? '+' : ''}{volumeGain[0]} dB
              </span>
            </div>
            <Slider
              value={volumeGain}
              onValueChange={setVolumeGain}
              min={-10}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">{t('文字内容')} Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('请输入要转换为语音的文字...')}
              rows={4}
              className="text-sm"
            />
          </div>

          {/* Quick texts */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">
              {t('快速体验')}
            </Label>
            {QUICK_TEXTS.map((qt, i) => (
              <button
                key={i}
                onClick={() => setText(qt)}
                className="block w-full rounded-lg border px-3 py-2 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-[#0080C0]/30 hover:bg-[#0080C0]/[0.04] hover:text-foreground"
              >
                {qt}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={generating || !text.trim()}
              className="flex-1 gap-2"
            >
              {generating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mic className="size-4" />
              )}
              {generating ? t('生成中...') : t('生成语音')}
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
        <div className="flex flex-1 items-center justify-center bg-muted/20 p-6 lg:p-10">
          {audioUrl ? (
            <div className="flex w-full max-w-md flex-col items-center gap-4">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-[#0080C0]/[0.08]">
                <Volume2 className="size-10 text-[#0080C0]" />
              </div>
              <audio
                ref={audioRef}
                controls
                className="w-full"
                src={audioUrl}
              >
                {t('您的浏览器不支持音频播放')}
              </audio>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={downloadAudio}
              >
                <Download className="size-3.5" />
                {t('下载音频')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50">
                <Volume2 className="size-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('在左侧输入文字，选择语音和语速，点击生成')}
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
