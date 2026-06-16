import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PublicLayout } from '@/components/layout'

const faqs = [
  {
    q: 'aiburj 支持哪些模型？',
    a: 'aiburj 已聚合 12+ 家国产大模型厂商、50+ 款模型，包括 DeepSeek（V4-Pro、R1）、通义千问（Qwen3.5）、智谱 GLM（GLM-5.1）、月之暗面 Kimi（K2.6）、百川等。覆盖对话、代码生成、图像生成、语音、视频等多个领域。',
  },
  {
    q: '如何获取 API Key？',
    a: '注册 aiburj 账号后，登录控制台，在「API Keys」页面点击「创建 Key」即可生成。请妥善保管您的 Key，不要将其分享给他人。',
  },
  {
    q: 'API 兼容 OpenAI 格式吗？',
    a: '完全兼容。aiburj 的 API 接口与 OpenAI API 格式一致，只需将 base_url 修改为 https://api.aiburj.com/v1，替换 API Key，现有代码无需任何改动即可接入。',
  },
  {
    q: '如何计费？',
    a: '按量计费，根据模型不同按 tokens 或调用次数计费。无月费、无最低消费、无隐藏费用。具体价格请查看模型广场。',
  },
  {
    q: '支持流式输出（SSE）吗？',
    a: '支持。在请求参数中设置 stream: true 即可启用 SSE 流式输出，实时接收模型生成的内容。',
  },
  {
    q: '有免费额度吗？',
    a: '新注册用户可获得赠送额度用于体验。部分轻量模型提供免费调用配额。具体请查看控制台的额度信息。',
  },
  {
    q: '如何接入图片生成？',
    a: '使用 /v1/images/generations 端点即可调用图片生成模型。支持通义万相等国产图像生成模型的统一 API 接入。',
  },
  {
    q: '遇到问题如何联系？',
    a: '可通过控制台内的反馈入口提交问题，或发送邮件至 support@aiburj.com。我们会在 24 小时内回复。也可加入微信交流群获取实时帮助。',
  },
]

function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <PublicLayout showMainContainer={false}>
      <section style={{
        background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)',
        padding: '100px 24px 60px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>常见问题</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>快速找到您需要的答案</p>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 12, marginBottom: 12,
            border: '1px solid #E8ECF2',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px', textAlign: 'left',
                fontSize: 16, fontWeight: 600, color: '#002060',
              }}
            >
              {faq.q}
              <ChevronDown size={18} style={{
                color: '#64748B', transition: 'transform 0.3s',
                transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)',
              }} />
            </button>
            <div style={{
              maxHeight: openIndex === i ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <p style={{
                padding: '0 24px 20px', fontSize: 15, color: '#4A6A8A',
                lineHeight: 1.9, margin: 0,
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </section>
    </PublicLayout>
  )
}

export const Route = createFileRoute('/docs/faq')({
  component: FaqPage,
})
