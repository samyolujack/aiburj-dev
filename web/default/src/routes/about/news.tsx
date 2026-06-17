import { createFileRoute } from '@tanstack/react-router'
import { AboutLayout } from '@/features/about/about-layout'
import { Calendar, Tag, ArrowRight } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', border: '#E8ECF2', light: '#F0F4FA' }

const newsItems = [
  {
    date: '2026-06-10', tag: '产品发布', tagColor: '#0080C0',
    title: 'aiburj 平台正式上线',
    desc: '聚合 DeepSeek、通义千问、智谱 GLM、月之暗面 Kimi、百川等 12 家国产大模型厂商，提供统一的 OpenAI 兼容 API 服务，覆盖对话、代码、图像、语音全模态。',
  },
  {
    date: '2026-06-05', tag: '模型上新', tagColor: '#10b981',
    title: '新增 DeepSeek-V4-Pro 模型',
    desc: '支持百万 tokens 超长上下文处理能力，推理性能业界领先。历时一年半打磨，系统性能力跨越，现已上线 aiburj 平台。',
  },
  {
    date: '2026-05-28', tag: '模型上新', tagColor: '#10b981',
    title: '上线高速版 GLM-5.1 模型',
    desc: '智谱最新旗舰模型，支持自主工作 8 小时、Function Calling、Vibe Coding。覆盖代码生成、深度推理、多工具调用等场景。',
  },
  {
    date: '2026-05-15', tag: '功能更新', tagColor: '#f59e0b',
    title: '平台内测启动，邀请首批开发者体验',
    desc: '开放首批内测名额，邀请各领域开发者深度体验 aiburj 平台。收集数百条反馈，持续优化产品体验和模型调度策略。',
  },
  {
    date: '2026-04-22', tag: '生态合作', tagColor: '#8b5cf6',
    title: 'aiburj 生态共建计划发布',
    desc: '面向开发者、创作者、模型厂商和企业客户推出多维度合作模式，包括内容共创、PR 贡献、产品接入、学术支持等。',
  },
  {
    date: '2026-04-08', tag: '功能更新', tagColor: '#f59e0b',
    title: '上线模型排行榜与性能基准测试',
    desc: '基于标准化评测体系，对平台所有模型进行性能、延迟、价格等多维度排名。开发者可根据实际需求快速选型。',
  },
  {
    date: '2026-03-20', tag: '技术突破', tagColor: '#ec4899',
    title: '自研推理引擎 OneInfer 发布',
    desc: 'OneInfer 引擎实现语言模型 10x+ 推理加速、生图模型 3x+ 加速。支持 BF16/FP16 精度，兼容 NVIDIA/昇腾多架构。',
  },
  {
    date: '2026-03-01', tag: '公司动态', tagColor: '#6366f1',
    title: 'aiburj 团队组建完成，项目正式立项',
    desc: '核心团队成员来自国内头部 AI 公司和云计算平台，具备丰富的模型工程化和平台建设经验。聚焦国产大模型 API 聚合方向。',
  },
]

function AboutNews() {
  return (
    <AboutLayout>
      {/* ── Hero ── */}
      <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '220px 24px 180px', textAlign: 'center', marginBottom: 80, position: 'relative', overflow: 'hidden', background: '#001840' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/about-news-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
        <h1 style={{ fontSize: 52, fontWeight: 700, color: '#fff', marginBottom: 20, position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>
          资讯动态
        </h1>
        <p style={{ fontSize: 24, color: 'rgba(255,255,255,0.75)', maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          了解 aiburj 最新产品发布、模型更新和技术动态
        </p>
      </div>

      {/* ── News Timeline ── */}
      <div style={{ position: 'relative', paddingBottom: 60 }}>
        {/* Vertical timeline line */}
        <div style={{
          position: 'absolute', left: 36, top: 0, bottom: 0, width: 2,
          background: `linear-gradient(to bottom, ${BRAND.accent}20, ${BRAND.border}, ${BRAND.accent}10)`,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {newsItems.map((item, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: 80 }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: 28, top: 28,
                width: 18, height: 18, borderRadius: '50%',
                border: `3px solid ${item.tagColor}`, background: '#fff',
                zIndex: 2, boxShadow: `0 0 0 4px ${item.tagColor}14`,
              }} />

              {/* Card */}
              <div style={{
                background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`,
                padding: '28px 32px',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(6px)'
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,74,143,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(0,74,143,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = BRAND.border
                }}
              >
                {/* Top row: date + tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 600, color: BRAND.muted,
                  }}>
                    <Calendar size={14} color={BRAND.accent} />
                    {item.date}
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, color: item.tagColor,
                    background: `${item.tagColor}12`, padding: '2px 10px', borderRadius: 20,
                  }}>
                    <Tag size={10} />
                    {item.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.deep, marginBottom: 10, lineHeight: 1.4 }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: 15, color: BRAND.muted, lineHeight: 1.9, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AboutLayout>
  )
}

export const Route = createFileRoute('/about/news')({
  component: AboutNews,
})
