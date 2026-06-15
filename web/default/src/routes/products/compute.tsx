import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Cpu, Server, TrendingUp, Gauge, ArrowRight } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A' }

const features = [
  { icon: Gauge, title: '弹性算力调度', desc: '基于 GPU 云函数实现智能算力调度，根据业务负载自动扩缩容，避免资源浪费，保障高峰期服务稳定。' },
  { icon: TrendingUp, title: '成本优化', desc: '客户托管模式下推理成本可降低 52%。按实际用量计费，无需预先采购 GPU 集群，大幅降低 AI 应用运营门槛。' },
  { icon: Server, title: '多架构支持', desc: '兼容 NVIDIA、昇腾等多种 GPU 架构，支持主流推理框架。灵活适配不同模型和场景的算力需求。' },
  { icon: Cpu, title: '高性能推理', desc: '自研推理引擎深度优化，语言模型推理速度提升 10x+，生图模型 3x+ 加速，实现毫秒级响应。' },
]

const scenarios = [
  { title: '模型厂商托管', desc: '将自研模型部署至 aiburj 算力平台，享受专业运维和弹性扩容能力，快速触达平台数万开发者用户。' },
  { title: '大并发业务', desc: '面向高并发 AI 应用场景，提供独占算力保障，确保关键业务在流量高峰期的稳定性和响应速度。' },
  { title: '成本敏感型项目', desc: '灵活的按量计费和预留实例模式，帮助创业团队和中小企业在有限预算内最大化 AI 能力利用率。' },
]

function ProductsCompute() {
  return (
    <ProductsLayout>
      <div style={{ background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)', borderRadius: 20, padding: '80px 60px', textAlign: 'center', marginBottom: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.2) 0%, transparent 60%)' }} />
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>AI 算力运营服务</h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 36px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          弹性 GPU 算力 + 自研推理引擎，为模型推理提供高性能、低成本的算力基础设施。
        </p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          联系我们 <ArrowRight size={18} />
        </a>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 32, position: 'relative', zIndex: 1 }}>
          {[{ value: '10x+', label: '推理加速' }, { value: '52%', label: '成本下降' }, { value: '弹性', label: '自动扩缩' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 80, alignItems: 'center', marginBottom: 80 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>专业的 AI 算力基础设施</h2>
          <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2, textAlign: 'justify' }}>
            <p style={{ marginBottom: 16 }}>aiburj 基于自研推理引擎，为模型厂商和企业客户提供高性能的 GPU 算力运营服务。无需自建 GPU 集群，即可享受弹性算力和专业运维。</p>
            <p style={{ marginBottom: 16 }}>无论是自研模型还是开源模型，均可接入我们的高效推理加速服务。支持 NVIDIA、昇腾等多种 GPU 架构，覆盖主流推理框架。</p>
            <p>我们的推理引擎在语言模型上实现 10x+ 速度提升，生图模型 3x+ 加速，助力你的 AI 应用实现毫秒级响应。</p>
          </div>
        </div>
        <BrandedIllustration icon="🖥️" title="弹性算力" subtitle="高效推理 · 自动扩缩" />
      </div>

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

      <div style={{ background: 'linear-gradient(135deg, #004A8F 0%, #002060 100%)', borderRadius: 20, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.15) 0%, transparent 50%)' }} />
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>需要专属算力方案？</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>我们的技术团队将为你量身定制最优的算力运营方案。</p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          联系销售 <ArrowRight size={18} />
        </a>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/compute')({
  component: ProductsCompute,
})
