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

export const Route = createFileRoute('/_authenticated/tickets/')({
  component: TicketsPage,
})

const TICKET_TYPES = [
  { value: 'bug', label: '问题反馈' },
  { value: 'feature', label: '功能建议' },
  { value: 'billing', label: '费用问题' },
  { value: 'other', label: '其他' },
]

function TicketsPage() {
  const { t } = useTranslation()
  const [type, setType] = useState('bug')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !description) {
      toast.error(t('请填写必要信息'))
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/api/user/ticket', {
        type,
        subject,
        description,
        contact,
      })
      if (res.data.success) {
        toast.success(t('工单已提交，我们将尽快回复'))
        setSubject('')
        setDescription('')
        setContact('')
        setType('bug')
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
            {t('工单反馈')}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('提交反馈与问题工单，我们的团队会尽快处理')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label>{t('工单类型')}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {t(item.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('标题')} *</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('请简要描述您的问题或建议')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('详细描述')} *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('请详细描述问题现象、复现步骤或功能建议')}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('联系方式')}</Label>
              <Input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="your@email.com"
              />
              <p className="text-muted-foreground text-xs">
                {t('留下联系方式以便我们回复您')}
              </p>
            </div>
          </div>

          <Button type="submit" className="gap-2" disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {submitting ? t('提交中...') : t('提交工单')}
          </Button>
        </form>
      </div>
    </Main>
  )
}
