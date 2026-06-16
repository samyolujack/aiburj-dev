import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Lock, Zap, BarChart3, Shield, ArrowRight, Check, X, Clock, Headphones, TrendingDown } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', border: '#E8ECF2', light: '#F0F4FA' }

const features = [
  { icon: Lock, title: '独占算力', desc: '专属 GPU 资源，不受其他用户负载影响。确保关键业务的推理延迟始终可控，满足企业级 SLA 要求。' },
  { icon: Zap, title: '精度保障', desc: '支持 BF16/FP16 等多种精度模式，根据业务需求灵活选择。保障模型推理质量的稳定性和一致性。' },
  { icon: BarChart3, title: '成本可预测', desc: '固定月费/年费模式，预算完全可控。相比按量付费，高频调用场景可节省 40%+ 推理成本。' },
  { icon: Shield, title: '专属运维', desc: '7×24 小时技术支持，专属运维经理一对一服务。从部署到优化，全程保驾护航。' },
]

const scenarios = [
  { title: '大规模生产环境', desc: '面向日调用量千万级以上的生产系统，保障高峰期服务稳定，避免公共实例的冷启动和排队延迟。' },
  { title: '金融级合规场景', desc: '数据隔离 + 专属部署，满足金融、政务等行业的严格合规要求。支持私有网络打通。' },
  { title: '模型微调与训练', desc: '预留高性能 GPU 实例用于模型微调和持续训练，确保算力随时可用，不排队不等待。' },
]

const comparisonData = [
  { label: '算力模式', reserved: '独占 GPU，不受干扰', public: '共享资源，可能排队', reservedWin: true },
  { label: '性能一致性', reserved: '延迟稳定可控', public: '高峰期波动明显', reservedWin: true },
  { label: 'SLA 保障', reserved: '99.9% 可用性', public: '尽力而为', reservedWin: true },
  { label: '计费方式', reserved: '固定月费/年费', public: '按量计费，不可预测', reservedWin: true },
  { label: '运维支持', reserved: '7×24 专属经理', public: '工单系统', reservedWin: true },
  { label: '适用规模', reserved: '千万级日调用', public: '中小规模', reservedWin: true },
]

const pricingRows = [
  { plan: '基础版', gpu: 'A100 × 2', qps: '500 QPS', price: '¥ 9,800 /月' },
  { plan: '专业版', gpu: 'A100 × 4', qps: '1,500 QPS', price: '¥ 18,000 /月' },
  { plan: '企业版', gpu: 'H100 × 8', qps: '5,000+ QPS', price: '定制报价' },
]

function ProductsReserved() {
  return (
    <ProductsLayout>
      {/* ── Hero ── */}
      <div style={{ borderRadius: 20, padding: '80px 60px', textAlign: 'center', marginBottom: 0, position: 'relative', overflow: 'hidden', background: '#001840' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/reserved-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>预留实例</h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 36px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          面向企业核心推理场景，提供独占算力、精度保障与成本优化的一站式解决方案。
        </p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          申请预留实例 <ArrowRight size={18} />
        </a>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 32, position: 'relative', zIndex: 1 }}>
          {[{ value: '独占', label: 'GPU 算力' }, { value: '99.9%', label: 'SLA 保障' }, { value: '40%+', label: '成本节省' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      <div style={{ padding: '80px 0 0' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>企业级独占算力方案</h2>
            <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2 }}>
              <p style={{ marginBottom: 16 }}>预留实例为你的核心业务提供专属的 GPU 算力资源。与公共实例不同，预留实例的算力完全独享，不受平台其他用户负载的影响。</p>
              <p style={{ marginBottom: 16 }}>适用于日调用量千万级以上的生产系统、金融级合规场景以及模型持续训练场景。固定月费/年费模式，成本完全可预测。</p>
              <p>配合专属运维经理 7×24 小时支持，从部署规划到性能优化，我们为你的关键业务提供端到端保障。</p>
            </div>
          </div>
          <BrandedIllustration icon="🏗️" title="专属实例" subtitle="独占算力 · 精度保障" />
        </div>
      </div>

      {/* ── 公共实例 vs 预留实例对比 ── */}
      <div style={{ padding: '80px 0 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>为什么需要预留实例？</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>当业务规模达到千万级调用量，公共实例的局限就显现了</p>
        </div>
        {/* Comparison illustration */}
        <div style={{ marginBottom: 32, borderRadius: 14, overflow: 'hidden', border: `1px solid ${BRAND.border}` }}>
          <img src="/reserved-compare-bg.png" alt="预留实例对比" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', background: BRAND.light, borderBottom: `1px solid ${BRAND.border}`, fontSize: 14, fontWeight: 700, color: BRAND.deep }}>
            <div>对比维度</div>
            <div style={{ textAlign: 'center', color: BRAND.primary }}>预留实例</div>
            <div style={{ textAlign: 'center' }}>公共实例</div>
          </div>
          {comparisonData.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', borderBottom: i < comparisonData.length - 1 ? `1px solid ${BRAND.border}` : 'none', fontSize: 14, alignItems: 'center' }}>
              <div style={{ color: BRAND.muted, fontWeight: 500 }}>{row.label}</div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Check size={16} color="#10B981" />
                <span style={{ color: BRAND.deep, fontWeight: 600 }}>{row.reserved}</span>
              </div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#94A3B8' }}>
                <X size={14} />
                <span>{row.public}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Features ── */}
      <div style={{ margin: '80px -48px 0', padding: '80px 48px', background: `${BRAND.light}`, borderTop: `1px solid ${BRAND.border}`, borderBottom: `1px solid ${BRAND.border}` }}>
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

        {/* SLA illustration */}
        <div style={{ marginTop: 48, borderRadius: 14, overflow: 'hidden', border: `1px solid ${BRAND.border}` }}>
          <img src="/reserved-sla-bg.png" alt="SLA保障" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>

      {/* ── 定价方案 ── */}
      <div style={{ padding: '80px 0 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>预留实例方案</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>多种规格，灵活匹配不同业务规模</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {pricingRows.map((plan, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: '36px 28px', textAlign: 'center',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default',
              ...(i === 1 ? { border: `2px solid ${BRAND.primary}`, boxShadow: '0 8px 32px rgba(0,74,143,0.1)' } : {}),
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = i === 1 ? '0 8px 32px rgba(0,74,143,0.1)' : 'none' }}>
              {i === 1 && <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: BRAND.primary, display: 'inline-block', padding: '4px 14px', borderRadius: 20, marginBottom: 16 }}>推荐</div>}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.deep, marginBottom: 12, marginTop: i === 1 ? 0 : 28 }}>{plan.plan}</h3>
              <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 4 }}>{plan.gpu}</div>
              <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 16 }}>{plan.qps}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: BRAND.primary, marginBottom: 20 }}>{plan.price}</div>
              <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, background: i === 1 ? BRAND.primary : '#fff', color: i === 1 ? '#fff' : BRAND.primary, border: i === 1 ? 'none' : `1px solid ${BRAND.primary}`, textDecoration: 'none' }}>
                咨询详情 <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scenarios ── */}
      <div style={{ padding: '80px 0 0' }}>
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
      <div style={{ margin: '80px -48px 0', background: 'linear-gradient(135deg, #004A8F 0%, #002060 100%)', borderRadius: 0, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.15) 0%, transparent 50%)' }} />
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>立即申请预留实例</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>获取你的专属算力方案和定制报价。</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none' }}>
            联系销售 <ArrowRight size={18} />
          </a>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 20px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>专属方案定制</div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>1v1 架构师对接评估</div>
          </div>
        </div>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/reserved')({ component: ProductsReserved })
