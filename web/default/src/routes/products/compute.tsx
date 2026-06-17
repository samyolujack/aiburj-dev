import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Cpu, Server, TrendingUp, Gauge, ArrowRight, Check, Zap, Layers, Clock } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', border: '#E8ECF2', light: '#F0F4FA', dark: '#0A1628' }

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

const gpuArchitectures = [
  { name: 'NVIDIA', models: 'A100 / H100 / L40S', color: '#76B900', desc: '通用 AI 训练 & 推理' },
  { name: '昇腾 Ascend', models: '910B / 310P', color: '#C344D0', desc: '国产化推理部署' },
  { name: '通用加速卡', models: '寒武纪 / 壁仞', color: '#0080C0', desc: '国产替代方案' },
]

const perfData = [
  { metric: '语言模型推理', before: '基线速度', after: '10x+ 提升', gain: '10x' },
  { metric: '生图模型推理', before: '基线速度', after: '3x+ 提升', gain: '3x' },
  { metric: '首 Token 延迟', before: '>500ms', after: '<100ms', gain: '5x' },
  { metric: '并发吞吐量', before: '100 QPS', after: '1000+ QPS', gain: '10x' },
]

const architectureLayers = [
  { name: 'API 网关', desc: '统一接入 · 鉴权 · 限流 · 路由', icon: '🌐', color: '#3B82F6' },
  { name: '推理引擎', desc: '模型优化 · 批处理 · KV Cache', icon: '⚙️', color: '#8B5CF6' },
  { name: 'GPU 集群', desc: 'NVIDIA · 昇腾 · 弹性扩缩', icon: '🖥️', color: '#10B981' },
]

function ProductsCompute() {
  return (
    <ProductsLayout>
      {/* ── Hero ── */}
      <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '260px 60px 260px', textAlign: 'center', marginBottom: 0, position: 'relative', overflow: 'hidden', background: '#001840', maskImage: 'linear-gradient(to bottom, black 0%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 92%, transparent 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/compute-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
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

      {/* ── Overview ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>专业的 AI 算力基础设施</h2>
            <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2 }}>
              <p style={{ marginBottom: 16 }}>aiburj 基于自研推理引擎，为模型厂商和企业客户提供高性能的 GPU 算力运营服务。无需自建 GPU 集群，即可享受弹性算力和专业运维。</p>
              <p style={{ marginBottom: 16 }}>无论是自研模型还是开源模型，均可接入我们的高效推理加速服务。支持 NVIDIA、昇腾等多种 GPU 架构，覆盖主流推理框架。</p>
              <p>我们的推理引擎在语言模型上实现 10x+ 速度提升，生图模型 3x+ 加速，助力你的 AI 应用实现毫秒级响应。</p>
            </div>
          </div>
          <BrandedIllustration icon="🖥️" title="弹性算力" subtitle="高效推理 · 自动扩缩" />
        </div>
      </div>

      {/* ── Architecture ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Architecture</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>自研推理引擎架构</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>三层架构，从 API 接入到 GPU 推理全链路优化</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {architectureLayers.map((layer, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: '32px 28px', textAlign: 'center', minWidth: 200, transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{layer.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: layer.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, background: `${layer.color}15`, display: 'inline-block', padding: '3px 10px', borderRadius: 6 }}>{layer.name}</div>
                <p style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>{layer.desc}</p>
              </div>
              {i < architectureLayers.length - 1 && (
                <div style={{ fontSize: 24, color: BRAND.accent, fontWeight: 700 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Features ── */}
      <div style={{ margin: '80px calc(-50vw + 50%) 0', padding: '80px 0', background: `${BRAND.light}`, borderTop: `1px solid ${BRAND.border}`, borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
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
        </div>
      </div>

      {/* ── Performance Comparison ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Performance</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>推理加速效果对比</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>自研推理引擎 vs 标准推理——速度与成本的双重飞跃</p>
        </div>
        {/* Performance comparison illustration */}
        <div style={{ marginBottom: 32, borderRadius: 14, overflow: 'hidden', border: `1px solid ${BRAND.border}` }}>
          <img src="/compute-perf-bg.png" alt="性能对比" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '16px 28px', background: BRAND.light, borderBottom: `1px solid ${BRAND.border}`, fontSize: 14, fontWeight: 700, color: BRAND.deep }}>
            <div>场景</div>
            <div style={{ textAlign: 'center' }}>优化前</div>
            <div style={{ textAlign: 'center' }}>aiburj 优化后</div>
            <div style={{ textAlign: 'center', color: BRAND.primary }}>提升幅度</div>
          </div>
          {perfData.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '16px 28px', borderBottom: i < perfData.length - 1 ? `1px solid ${BRAND.border}` : 'none', fontSize: 14, alignItems: 'center' }}>
              <div style={{ color: BRAND.muted, fontWeight: 500 }}>{row.metric}</div>
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>{row.before}</div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Check size={16} color="#10B981" />
                <span style={{ color: BRAND.deep, fontWeight: 600 }}>{row.after}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ background: `linear-gradient(135deg, #10B981, #34D399)`, color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{row.gain}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GPU Architecture Support ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>GPU Support</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>多 GPU 架构支持</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>兼容主流 GPU 平台，灵活满足不同部署环境</p>
        </div>
        {/* GPU architecture illustration */}
        <div style={{ marginBottom: 32, borderRadius: 14, overflow: 'hidden', border: `1px solid ${BRAND.border}` }}>
          <img src="/compute-gpu-bg.png" alt="GPU架构" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {gpuArchitectures.map((gpu, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: '32px 24px', textAlign: 'center', transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 20, right: 20, height: 3, background: gpu.color, borderRadius: '0 0 3px 3px', opacity: 0.7 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: gpu.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 }}>{gpu.name}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: BRAND.deep, marginBottom: 8, fontFamily: 'monospace' }}>{gpu.models}</div>
              <div style={{ fontSize: 13, color: BRAND.muted }}>{gpu.desc}</div>
            </div>
          ))}
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
      <div style={{ margin: '80px calc(-50vw + 50%) 0', background: 'linear-gradient(135deg, #004A8F 0%, #002060 100%)', borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '64px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.15) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16 }}>需要专属算力方案？</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px' }}>我们的技术团队将为你量身定制最优的算力运营方案。</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none' }}>
            联系销售 <ArrowRight size={18} />
          </a>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 20px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>企业级 SLA 保障</div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>99.9% 可用性 · 7×24 运维</div>
          </div>
        </div>
        </div>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/compute')({ component: ProductsCompute })
