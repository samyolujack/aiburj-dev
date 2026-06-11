import { createFileRoute } from '@tanstack/react-router'
import { AboutLayout } from '@/features/about/about-layout'
import { Calendar, Tag } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A' }

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
      {/* Page Header */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 12, letterSpacing: '-0.02em' }}>
          资讯动态
        </h2>
        <p style={{ fontSize: 16, color: BRAND.muted }}>
          了解 aiburj 最新产品发布、模型更新和技术动态。
        </p>
      </div>

      {/* News Cards */}
      <div style={{ display: 'grid', gap: 20 }}>
        {newsItems.map((item, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, border: '1px solid #E8ECF2',
            padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(4px)'
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,74,143,0.06)'
              e.currentTarget.style.borderColor = 'rgba(0,74,143,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = '#E8ECF2'
            }}
          >
            {/* Date badge */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              flexShrink: 0, minWidth: 72,
            }}>
              <Calendar size={18} color={BRAND.accent} />
              <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.muted, textAlign: 'center', lineHeight: 1.4 }}>
                {item.date.replace(/-/g, '\n')}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.deep, margin: 0 }}>
                  {item.title}
                </h3>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 600, color: item.tagColor,
                  background: `${item.tagColor}12`, padding: '2px 10px', borderRadius: 20,
                }}>
                  <Tag size={10} />
                  {item.tag}
                </span>
              </div>
              <p style={{ fontSize: 15, color: BRAND.muted, lineHeight: 1.8, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AboutLayout>
  )
}

export const Route = createFileRoute('/about/news')({
  component: AboutNews,
})
