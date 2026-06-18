import { useState, useRef } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Mic, Play, Send } from 'lucide-react'
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

function TTSPage() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [model, setModel] = useState(TTS_MODELS[0].value)
  const [voice, setVoice] = useState(VOICES[0].value)
  const [generating, setGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [error, setError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error(t('请输入要转换的文字'))
      return
    }
    setGenerating(true)
    setError('')
    setAudioUrl('')
    try {
      const res = await api.post('/pg/audio/speech', {
        model,
        input: text.trim(),
        voice,
        response_format: 'mp3',
      }, {
        responseType: 'blob',
      })
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data])
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

  return (
    <Main>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6 md:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            🎙️ {t('语音合成')}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('输入文字，AI 为你朗读')}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('模型')}</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
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
              <Label>{t('语音')}</Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label>{t('文字内容')}</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('输入要转换为语音的文字...')}
              rows={4}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !text.trim()}
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mic className="size-4" />
            )}
            {generating ? t('生成中...') : t('生成语音')}
          </Button>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {audioUrl && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <audio ref={audioRef} controls className="w-full" src={audioUrl}>
                {t('您的浏览器不支持音频播放')}
              </audio>
            </div>
          )}
        </div>
      </div>
    </Main>
  )
}
