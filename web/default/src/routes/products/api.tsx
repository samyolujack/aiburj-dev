import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Zap, Layers, Shield, Globe, ArrowRight, Check, X, Code, Copy } from 'lucide-react'
import { useState } from 'react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', border: '#E8ECF2', light: '#F0F4FA' }

const features = [
  { icon: Zap, title: '极速推理', desc: '自研推理引擎加速，语言模型推理速度提升 10x+。毫秒级首 token 响应，支撑实时对话场景。' },
  { icon: Layers, title: '多模型聚合', desc: '接入 12+ 国产主流大模型厂商，统一 OpenAI 兼容 API 格式。一键切换模型，代码零改动。' },
  { icon: Shield, title: '安全可靠', desc: '传输加密 + 密钥隔离 + 99.9% 可用性保障。符合行业安全标准，保护你的数据隐私。' },
  { icon: Globe, title: '全模态覆盖', desc: '支持文本对话、图像生成、语音合成、视频生成。一个 API 搞定所有 AI 能力调用。' },
]

const scenarios = [
  { title: 'AI 应用开发', desc: '快速集成大模型能力到你的 Web/移动应用中，聊天机器人、内容生成、代码助手开箱即用。' },
  { title: '企业智能化', desc: '为客服系统、知识库、数据分析等企业场景注入 AI 能力，降低人力成本提升效率。' },
  { title: '产品原型验证', desc: '零月费按量计费，创业团队可低成本验证 AI 产品 idea，快速迭代找到 PMF。' },
]

const comparisonData = [
  { label: '模型数量', aiburj: '50+ 款模型', vendor: '1-5 款', aiburjWin: true },
  { label: '接入成本', aiburj: '3 行代码', vendor: '逐厂商对接 SDK', aiburjWin: true },
  { label: 'API 格式', aiburj: '统一 OpenAI 兼容', vendor: '各家格式不同', aiburjWin: true },
  { label: '计费方式', aiburj: '统一按量计费', vendor: '需分别充值', aiburjWin: true },
  { label: '模型切换', aiburj: '改一行 model 参数', vendor: '换 SDK + 改代码', aiburjWin: true },
  { label: '运维成本', aiburj: '零运维', vendor: '需监控多套系统', aiburjWin: true },
]

const flowSteps = [
  { step: '1', icon: '🔑', title: '获取 API Key', desc: '免费注册，30 秒创建 Key' },
  { step: '2', icon: '🎯', title: '选择模型', desc: '浏览模型市场，按需挑选' },
  { step: '3', icon: '⚡', title: '调用 API', desc: '复制代码，即刻运行' },
]

const pythonExample = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.aiburj.com/v1",
    api_key="sk-your-key-here"
)

response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "你好"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ background: '#1A1D2E', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 12px', color: copied ? '#4ADE80' : '#9098B0', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
        {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? '已复制' : '复制'}
      </button>
      <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, padding: '20px 24px', margin: 0, overflow: 'auto' }}>{code}</pre>
    </div>
  )
}

function ProductsApi() {
  return (
    <ProductsLayout>
      {/* ── Hero ── */}
      <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '80px 60px', textAlign: 'center', marginBottom: 0, position: 'relative', overflow: 'hidden', background: '#001840' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/product-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>大模型 API 服务</h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 36px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          开箱即用的大模型 API，覆盖语言、视觉、语音全模态。OpenAI 兼容格式，一次接入、多模型随心切换。
        </p>
        <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          立即体验 <ArrowRight size={18} />
        </a>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 32, position: 'relative', zIndex: 1 }}>
          {[{ value: '50+', label: '可用模型' }, { value: '12+', label: '国产厂商' }, { value: 'OpenAI', label: '兼容格式' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>一站式大模型调用平台</h2>
            <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2 }}>
              <p style={{ marginBottom: 16 }}>aiburj 聚合 DeepSeek、通义千问、智谱 GLM、月之暗面 Kimi、百川等 12+ 国产主流大模型厂商，提供统一的 OpenAI 兼容 API 接口。</p>
              <p style={{ marginBottom: 16 }}>开发者只需一次接入，即可调用所有模型。无需关注各厂商不同的 API 格式、认证方式、计费规则——aiburj 为你屏蔽所有底层差异。</p>
              <p>支持文本对话、图像生成、语音合成、视频生成等全模态能力。按量计费，零月费，零门槛。</p>
            </div>
          </div>
          <BrandedIllustration icon="⚡" title="OpenAI 兼容" subtitle="统一调度 · 多模型聚合" />
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>为什么选择 aiburj 而不是直接接厂商？</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>一次接入 vs 逐个对接——省下的不只是时间</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', background: BRAND.light, borderBottom: `1px solid ${BRAND.border}`, fontSize: 14, fontWeight: 700, color: BRAND.deep }}>
            <div>对比维度</div>
            <div style={{ textAlign: 'center', color: BRAND.primary }}>aiburj</div>
            <div style={{ textAlign: 'center' }}>直接接厂商 API</div>
          </div>
          {comparisonData.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', borderBottom: i < comparisonData.length - 1 ? `1px solid ${BRAND.border}` : 'none', fontSize: 14, alignItems: 'center' }}>
              <div style={{ color: BRAND.muted, fontWeight: 500 }}>{row.label}</div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Check size={16} color="#10B981" />
                <span style={{ color: BRAND.deep, fontWeight: 600 }}>{row.aiburj}</span>
              </div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#94A3B8' }}>
                <X size={14} />
                <span>{row.vendor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Features ── */}
      <div style={{ margin: '80px calc(-50vw + 50%) 0', padding: '80px 48px', background: `${BRAND.light}`, borderTop: `1px solid ${BRAND.border}`, borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Features</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep }}>核心能力</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`, padding: '32px 28px', transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${BRAND.primary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon size={24} color={BRAND.primary} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.deep, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Performance metrics bar */}
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[{ value: '10x+', label: '推理加速' }, { value: '99.9%', label: '服务可用性' }, { value: '<100ms', label: '首 Token 延迟' }, { value: 'OPENAI', label: '兼容格式' }].map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.primary }}>{m.value}</div>
              <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Usage Flow ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Quick Start</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep }}>三步开始调用</h2>
          <p style={{ fontSize: 15, color: BRAND.muted, marginTop: 8 }}>从注册到发出第一个 API 请求，不到 5 分钟</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          {flowSteps.map((f, i) => (
            <div key={i} style={{ flex: '1 1 250px', maxWidth: 320, textAlign: 'center', position: 'relative' }}>
              <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: '36px 24px', position: 'relative' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${BRAND.primary}15, ${BRAND.accent}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, marginBottom: 8 }}>步骤 {f.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
              {i < flowSteps.length - 1 && (
                <div style={{ display: 'none' }} /> /* Arrow handled by connector below */
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Code Example ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Try It</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep }}>一行代码调用大模型</h2>
          <p style={{ fontSize: 15, color: BRAND.muted, marginTop: 8 }}>OpenAI SDK 直接兼容，替换 base_url 即可切换</p>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <CodeBlock code={pythonExample} />
        </div>
      </div>

      {/* ── Scenarios ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Scenarios</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep }}>适用场景</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {scenarios.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`, padding: '32px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.deep, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.8 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ margin: '80px calc(-50vw + 50%) 0', background: 'linear-gradient(135deg, #004A8F 0%, #002060 100%)', borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.15) 0%, transparent 50%)' }} />
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>准备好开始了吗？</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>注册即享免费额度，零成本体验全部模型能力。</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none' }}>
            浏览模型 <ArrowRight size={18} />
          </a>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 20px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>按量计费 · 零月费</div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>新人注册即享体验额度</div>
          </div>
        </div>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/api')({ component: ProductsApi })
