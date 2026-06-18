import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Main } from '@/components/layout'
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

export const Route = createFileRoute('/_authenticated/invoice/')({
  component: InvoicePage,
})

function InvoicePage() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [invoiceType, setInvoiceType] = useState('personal')
  const [title, setTitle] = useState('')
  const [taxId, setTaxId] = useState('')
  const [email, setEmail] = useState('')
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !title) {
      toast.error(t('请填写必要信息'))
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/api/user/invoice', {
        type: invoiceType,
        title,
        tax_id: taxId,
        amount: parseFloat(amount),
        email,
        remark,
      })
      if (res.data.success) {
        toast.success(t('发票申请已提交，我们将尽快处理'))
        setAmount('')
        setTitle('')
        setTaxId('')
        setEmail('')
        setRemark('')
        setInvoiceType('personal')
      } else {
        toast.error(res.data.message || t('提交失败'))
      }
    } catch {
      toast.error(t('提交失败，请稍后重试'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Main>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('发票开具')}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('在线申请发票，填写以下信息提交申请')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label>{t('发票类型')}</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">{t('个人发票')}</SelectItem>
                  <SelectItem value="company">{t('企业发票')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('发票抬头')} *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('请输入发票抬头')}
                required
              />
            </div>

            {invoiceType === 'company' && (
              <div className="space-y-2">
                <Label>{t('税号')}</Label>
                <Input
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder={t('请输入企业税号')}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>{t('开票金额')}（{t('元')}）*</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('接收邮箱')}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('备注')}</Label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={t('如有特殊要求请注明')}
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" className="gap-2" disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {submitting ? t('提交中...') : t('提交申请')}
          </Button>
        </form>
      </div>
    </Main>
  )
}
