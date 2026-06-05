import { createFileRoute } from '@tanstack/react-router'
import { AboutLayout } from '@/features/about/about-layout'

export const Route = createFileRoute('/about/news')({
  component: AboutNews,
})

function AboutNews() {
  return (
    <AboutLayout>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>资讯动态</h2>
      {[
        { date: '2026-06', title: 'aiburj 平台正式上线', desc: '聚合 DeepSeek、通义千问、GLM 等 12 家国产大模型，提供统一 API 服务' },
        { date: '2026-05', title: '新增 DeepSeek-V4-Pro 模型', desc: '支持百万 tokens 上下文，推理能力业界领先' },
        { date: '2026-04', title: '新增智谱 GLM-5.1 模型', desc: '支持自主工作 8 小时，Vibe Coding 首选模型' },
        { date: '2026-03', title: '平台内测启动', desc: '邀请首批开发者体验，收集反馈优化产品' },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: 28, paddingLeft: 16, borderLeft: '2px solid #0080C0' }}>
          <div style={{ fontSize: 13, color: '#0080C0', fontWeight: 600, marginBottom: 4 }}>{item.date}</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{item.title}</h3>
          <p style={{ fontSize: 15, color: '#4A6A8A', lineHeight: 1.7 }}>{item.desc}</p>
        </div>
      ))}
    </AboutLayout>
  )
}
