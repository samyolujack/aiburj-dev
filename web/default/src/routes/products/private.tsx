import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Building2, Shield, Server, Wrench, ArrowRight } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A' }

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

function ProductsPrivate() {
  return (
    <ProductsLayout>
      <div style={{ background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)', borderRadius: 20, padding: '80px 60px', textAlign: 'center', marginBottom: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.2) 0%, transparent 60%)' }} />
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

      <div style={{ display: 'flex', gap: 80, alignItems: 'center', marginBottom: 80 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>企业级私有化大模型平台</h2>
          <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2, textAlign: 'justify' }}>
            <p style={{ marginBottom: 16 }}>aiburj 私有化部署方案将完整的大模型服务平台交付到你的基础设施中。模型和数据完全留存在你的网络内，满足最严格的合规要求。</p>
            <p style={{ marginBottom: 16 }}>支持异构算力纳管——统一管理 NVIDIA、昇腾等多种 GPU 资源，智能调度最大化硬件利用率。支持混合云和本地数据中心部署模式。</p>
            <p>从部署规划、模型适配、性能调优到持续运维，我们提供端到端的闭环服务，确保你的大模型应用安全、稳定、高效地运行。</p>
          </div>
        </div>
        <BrandedIllustration icon="🔒" title="私有部署" subtitle="安全合规 · 数据隔离" />
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
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>获取专属私有化方案</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>我们的架构师团队将根据你的基础设施和业务需求，提供定制化部署方案。</p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          预约演示 <ArrowRight size={18} />
        </a>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/private')({
  component: ProductsPrivate,
})
