import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Zap, Layers, Shield, Globe, ArrowRight } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A' }

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

function ProductsApi() {
  return (
    <ProductsLayout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)', borderRadius: 20, padding: '80px 60px', textAlign: 'center', marginBottom: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.2) 0%, transparent 60%)' }} />
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

      {/* Product Overview */}
      <div style={{ display: 'flex', gap: 80, alignItems: 'center', marginBottom: 80 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>一站式大模型调用平台</h2>
          <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2, textAlign: 'justify' }}>
            <p style={{ marginBottom: 16 }}>aiburj 聚合 DeepSeek、通义千问、智谱 GLM、月之暗面 Kimi、百川等 12+ 国产主流大模型厂商，提供统一的 OpenAI 兼容 API 接口。</p>
            <p style={{ marginBottom: 16 }}>开发者只需一次接入，即可调用所有模型。无需关注各厂商不同的 API 格式、认证方式、计费规则——aiburj 为你屏蔽所有底层差异。</p>
            <p>支持文本对话、图像生成、语音合成、视频生成等全模态能力。按量计费，零月费，零门槛。</p>
          </div>
        </div>
        <BrandedIllustration icon="⚡" title="OpenAI 兼容" subtitle="统一调度 · 多模型聚合" />
      </div>

      {/* Core Features */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Features</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep }}>核心能力</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF2', padding: '32px 28px', transition: 'all 0.35s', cursor: 'default' }}
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
      </div>

      {/* Use Scenarios */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Scenarios</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep }}>适用场景</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {scenarios.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF2', padding: '32px 28px' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.deep, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.8 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #004A8F 0%, #002060 100%)', borderRadius: 20, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.15) 0%, transparent 50%)' }} />
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>准备好开始了吗？</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>注册即享免费额度，零成本体验全部模型能力。</p>
        <a href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          浏览模型 <ArrowRight size={18} />
        </a>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/api')({ component: ProductsApi })
