import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Building2, Shield, Server, Wrench, ArrowRight, Check, X, Lock, Globe, Cpu } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', border: '#E8ECF2', light: '#F0F4FA' }

const features = [
  { icon: Building2, title: '一站式部署', desc: '从异构算力纳管、模型微调、推理部署到场景落地，提供端到端的闭环解决方案。开箱即用，快速上线。' },
  { icon: Shield, title: '数据安全合规', desc: '模型和数据完全留在你的基础设施内，支持 BYOC 部署模式。满足政企、金融等行业的严格合规要求。' },
  { icon: Server, title: '异构算力纳管', desc: '统一管理 NVIDIA、昇腾等多种 GPU 资源，智能调度最大化硬件利用率。支持混合云和本地数据中心部署。' },
  { icon: Wrench, title: '持续运维保障', desc: '提供监控告警、日志审计、版本升级等全生命周期运维服务。7×24 小时技术支持，确保系统稳定运行。' },
]

const scenarios = [
  { title: '政企单位', desc: '满足政务系统数据不出域的安全要求，支持国产化硬件适配。私有化部署在政务云或本地数据中心。' },
  { title: '金融机构', desc: '符合金融行业监管要求，数据完全隔离。支持审计日志、权限管控、加密传输等安全特性。' },
  { title: '大型企业', desc: '统一管理多部门 AI 算力资源，实现模型资产统一管控。降低各部门重复采购和运维成本。' },
]

const comparisonData = [
  { label: '数据位置', aiburj: '完全留在你的网络内', saas: '存在云端', aiburjWin: true },
  { label: '合规能力', aiburj: '满足金融/政务级要求', saas: '通用合规标准', aiburjWin: true },
  { label: '网络要求', aiburj: '支持完全离线部署', saas: '需公网连接', aiburjWin: true },
  { label: '硬件适配', aiburj: 'NVIDIA + 昇腾 + 国产化', saas: '取决于云厂商', aiburjWin: true },
  { label: '运维控制', aiburj: '你完全掌控运维策略', saas: '依赖平台SLA', aiburjWin: true },
  { label: '定制能力', aiburj: '深度定制 · 源码级', saas: '有限配置项', aiburjWin: true },
]

const securityFeatures = [
  { icon: Lock, title: '数据不出域', desc: '所有模型和数据留在你的基础设施内' },
  { icon: Shield, title: 'BYOC 部署', desc: '支持 Bring Your Own Cloud 模式' },
  { icon: Globe, title: '混合云支持', desc: '灵活适配公有云 + 本地数据中心' },
  { icon: Cpu, title: '国产化适配', desc: '支持昇腾等国产 GPU 和操作系统' },
]

function ProductsPrivate() {
  return (
    <ProductsLayout>
      {/* ── Hero ── */}
      <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '280px 60px 280px', textAlign: 'center', marginBottom: 0, position: 'relative', overflow: 'hidden', background: '#001840' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/product-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
        {/* Bottom glow */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,128,192,0.2) 0%, transparent 70%)', zIndex: 0 }} />
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>私有化部署</h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 36px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          企业级私有化大模型服务平台，一站式解决模型部署、性能优化与运维等需求。
        </p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          咨询方案 <ArrowRight size={18} />
        </a>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 32, position: 'relative', zIndex: 1 }}>
          {[{ value: '数据', label: '不出域' }, { value: '异构', label: '算力纳管' }, { value: '7×24', label: '运维保障' }].map((s, i) => (
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
            <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>企业级私有化大模型平台</h2>
            <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2 }}>
              <p style={{ marginBottom: 16 }}>aiburj 私有化部署方案将完整的大模型服务平台交付到你的基础设施中。模型和数据完全留存在你的网络内，满足最严格的合规要求。</p>
              <p style={{ marginBottom: 16 }}>支持异构算力纳管——统一管理 NVIDIA、昇腾等多种 GPU 资源，智能调度最大化硬件利用率。支持混合云和本地数据中心部署模式。</p>
              <p>从部署规划、模型适配、性能调优到持续运维，我们提供端到端的闭环服务，确保你的大模型应用安全、稳定、高效地运行。</p>
            </div>
          </div>
          <BrandedIllustration icon="🔒" title="私有部署" subtitle="安全合规 · 数据隔离" />
        </div>
      </div>

      {/* ── 安全特性 ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>全方位安全保障</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>四级安全防护体系，从网络到应用层全面覆盖</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {securityFeatures.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`, padding: '32px 24px', textAlign: 'center', transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${BRAND.primary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <s.icon size={28} color={BRAND.primary} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 私有化 vs SaaS 对比 ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>为什么选择私有化部署？</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>当数据安全和合规成为核心诉求，私有化部署是唯一解</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', background: BRAND.light, borderBottom: `1px solid ${BRAND.border}`, fontSize: 14, fontWeight: 700, color: BRAND.deep }}>
            <div>对比维度</div>
            <div style={{ textAlign: 'center', color: BRAND.primary }}>私有化部署</div>
            <div style={{ textAlign: 'center' }}>SaaS 云服务</div>
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
                <span>{row.saas}</span>
              </div>
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
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16 }}>获取专属私有化方案</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px' }}>我们的架构师团队将根据你的基础设施和业务需求，提供定制化部署方案。</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none' }}>
            预约演示 <ArrowRight size={18} />
          </a>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 20px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>免费环境评估</div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>架构师 1v1 对接</div>
          </div>
        </div>
        </div>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/private')({ component: ProductsPrivate })
