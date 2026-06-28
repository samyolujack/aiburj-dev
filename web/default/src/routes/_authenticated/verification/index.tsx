import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, ShieldAlert, Clock, X, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/verification/')({
  component: VerificationPage,
})

type VerificationData = {
  id?: number; real_name?: string
  status: number // -1=未提交, 0=待审核, 1=已通过, 2=已拒绝
  review_msg?: string
}

function VerificationPage() {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [verification, setVerification] = useState<VerificationData | null>(null)
  const [alipayConfigured, setAlipayConfigured] = useState(true)

  useEffect(() => { loadStatus() }, [])

  const loadStatus = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/user/verification')
      setVerification(res.data.data || null)
    } catch { } finally { setLoading(false) }
  }

  // Check URL for alipay callback status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const alipayResult = params.get('alipay')
    if (alipayResult === 'success') {
      toast.success('支付宝实名认证成功！您现在可以使用 API 密钥了')
      loadStatus()
      // Clean URL
      window.history.replaceState({}, '', '/verification')
    } else if (alipayResult === 'fail' || alipayResult === 'error') {
      toast.error('支付宝认证失败，请重试')
      window.history.replaceState({}, '', '/verification')
    }
  }, [])

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
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <ShieldCheck className="size-6" />
            实名认证
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            完成实名认证后即可申请 API 密钥，调用平台所有模型
          </p>
        </div>

        {/* Status: Verified */}
        {status === 1 && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                <ShieldCheck className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800 text-lg">实名认证已通过</p>
                <p className="text-sm text-green-600 mt-0.5">
                  {verification?.real_name} · 已通过支付宝实名认证
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-green-200">
              <a
                href="/keys"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 no-underline transition-colors"
              >
                前往申请 API 密钥 <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        )}

        {/* Status: Pending review (legacy, shouldn't happen with Alipay) */}
        {status === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-3">
              <Clock className="size-8 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">审核中</p>
                <p className="text-sm text-amber-600">您的实名认证正在审核中，请耐心等待</p>
              </div>
            </div>
          </div>
        )}

        {/* Status: Rejected */}
        {status === 2 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-3 mb-3">
              <X className="size-8 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">认证未通过</p>
                {verification?.review_msg && (
                  <p className="text-sm text-red-600">{verification.review_msg}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-red-500">请使用下方支付宝认证重新验证</p>
          </div>
        )}

        {/* Not submitted or rejected: show Alipay options */}
        {(status === -1 || status === 2) && (
          <>
            <div className="rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-white p-6">
              <div className="text-center mb-5">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-[#1677FF]/10 mb-3">
                  <img src="https://cdn.simpleicons.org/alipay/1677FF" alt="支付宝" className="size-8" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E293B]">支付宝实名认证</h3>
                <p className="text-sm text-[#64748B] mt-1">
                  通过支付宝一键授权，即时完成实名认证，无需等待审核
                </p>
              </div>

              {/* Option A: Free OAuth */}
              <a
                href="/api/user/oauth/alipay/authorize"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 py-3 text-sm font-medium text-white hover:bg-[#1677FF]/90 no-underline transition-colors mb-3"
              >
                支付宝授权认证（免费）
              </a>

              {/* Option B: Face verify */}
              <Button
                onClick={async () => {
                  setSubmitting(true)
                  try {
                    const res = await api.post('/api/user/oauth/alipay/certify')
                    if (res.data?.certify_url) {
                      window.location.href = res.data.certify_url
                    } else {
                      toast.error(res.data?.message || '发起认证失败')
                    }
                  } catch {
                    toast.error('发起认证失败')
                  } finally { setSubmitting(false) }
                }}
                disabled={submitting}
                className="w-full gap-2"
                variant="outline"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                支付宝刷脸认证（付费 · 金融级）
              </Button>

              <p className="text-[11px] text-[#94A3B8] text-center mt-3">
                认证信息仅用于实名校验，加密存储，不会泄露
              </p>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <h4 className="text-sm font-semibold text-[#1E293B] mb-2">认证后可以使用：</h4>
              <ul className="space-y-1.5 text-[13px] text-[#64748B]">
                <li className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-green-500" /> 创建 API 密钥</li>
                <li className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-green-500" /> 调用所有平台模型</li>
                <li className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-green-500" /> 体验中心全部功能</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </Main>
  )
}
