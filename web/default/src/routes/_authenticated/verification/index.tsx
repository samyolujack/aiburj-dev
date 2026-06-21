import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, ShieldAlert, Clock, Check, X, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_authenticated/verification/')({
  component: VerificationPage,
})

type VerificationData = {
  id?: number
  user_id?: number
  real_name?: string
  status: number // -1=未提交, 0=待审核, 1=已通过, 2=已拒绝
  review_msg?: string
  created_at?: number
}

function VerificationPage() {
  const { t } = useTranslation()
  const [realName, setRealName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [verification, setVerification] = useState<VerificationData | null>(null)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/user/verification')
      setVerification(res.data.data || null)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!realName.trim() || !idNumber.trim()) {
      toast.error(t('请填写完整的认证信息'))
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/api/user/verification', {
        real_name: realName.trim(),
        id_number: idNumber.trim(),
      })
      if (res.data.success) {
        toast.success(t('实名认证申请已提交'))
        setVerification(res.data.data)
        setRealName('')
        setIdNumber('')
      } else {
        toast.error(res.data.message || t('提交失败'))
      }
    } catch {
      toast.error(t('提交失败，请稍后重试'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Main>
        <div className="flex items-center justify-center p-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </Main>
    )
  }

  const status = verification?.status ?? -1

  return (
    <Main>
      <div className="mx-auto flex max-w-lg flex-col gap-6 p-6 md:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            🛡️ {t('实名认证')}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('完成实名认证后即可申请 API 密钥')}
          </p>
        </div>

        {/* Status display */}
        {status === 1 && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                <ShieldCheck className="size-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">{t('实名认证已通过')}</p>
                <p className="text-sm text-green-600">
                  {verification?.real_name} · {t('已认证')}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-800">{t('审核中')}</p>
                <p className="text-sm text-amber-600">
                  {t('您的实名认证正在审核中，请耐心等待')}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 2 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
                <X className="size-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-800">{t('认证未通过')}</p>
                {verification?.review_msg && (
                  <p className="text-sm text-red-600">{verification.review_msg}</p>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-red-500">{t('请重新提交认证信息')}</p>
          </div>
        )}

        {/* Submission form */}
        {(status === -1 || status === 2) && (
          <>
            {/* Alipay OAuth — recommended */}
            <div className="rounded-xl border border-[#1677FF]/20 bg-gradient-to-br from-[#1677FF]/[0.04] to-[#1677FF]/[0.01] p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-lg bg-[#1677FF] px-2 py-0.5 text-[10px] font-medium text-white">
                  {t('推荐')}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">
                    {t('支付宝一键认证')}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('通过支付宝授权自动获取实名信息，无需手动填写，即时通过')}
                  </p>
                </div>
              </div>
              <a
                href="/api/user/oauth/alipay/authorize"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1677FF]/90 no-underline"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5v-5h-2.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75H12v5c0 .41-.34.75-.75.75s-.75-.34-.75-.75zm4.5-4.75c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-1.5c0-.41.34-.75.75-.75s.75.34.75.75v1.5z"/>
                </svg>
                {t('支付宝认证')}
              </a>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t('或手动填写')}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Manual form */}
            <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label>{t('真实姓名')} *</Label>
              <Input
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder={t('请输入您的真实姓名')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('身份证号')} *</Label>
              <Input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={t('请输入您的身份证号码')}
                maxLength={18}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('信息仅用于实名认证，加密存储，不会泄露')}
              </p>
            </div>

            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {submitting ? t('提交中...') : t('提交认证')}
            </Button>
          </form>
          </>
        )}
      </div>
    </Main>
  )
}
