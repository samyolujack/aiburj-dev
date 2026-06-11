import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { Route as RouteIcon, Shield, Gauge, Repeat, ArrowRight } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A' }

const features = [
  { icon: RouteIcon, title: '统一 API 接入', desc: '提供标准化的 API 网关，统一管理所有大模型 API 调用。支持请求路由、协议转换和格式适配。' },
  { icon: Shield, title: '安全管控', desc: '内置访问控制、流量限制、密钥管理等安全机制。支持 IP 白名单和调用审计，保障 API 使用安全。' },
  { icon: Gauge, title: '智能限流', desc: '多维度的流量控制和速率限制策略，防止恶意调用和资源滥用。支持按用户、按模型、按接口粒度配置。' },
  { icon: Repeat, title: '负载均衡', desc: '自动在多模型实例间分发请求，实现故障转移和负载均衡。确保服务高可用，消除单点故障。' },
]

const scenarios = [
  { title: '企业内部 API 治理', desc: '统一管理各部门的 AI API 调用，实现集中鉴权、用量监控和成本统计。提升企业 AI 资源利用率。' },
  { title: '模型服务商接入', desc: '将自研或第三方模型通过网关标准化接入，提供统一的 API 协议和监控面板。' },
  { title: '多模型智能路由', desc: '根据请求类型、成本预算、延迟要求等条件，自动将请求路由到最优模型实例。' },
]

function ProductsGateway() {
  return (
    <ProductsLayout>
      <div style={{ background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)', borderRadius: 20, padding: '80px 60px', textAlign: 'center', marginBottom: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.2) 0%, transparent 60%)' }} />
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>API 网关</h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 36px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          企业级大模型 API 网关，提供统一接入、安全管控、智能路由和用量监控能力。
        </p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          了解详情 <ArrowRight size={18} />
        </a>
      </div>

      <div style={{ display: 'flex', gap: 80, alignItems: 'center', marginBottom: 80 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>企业级大模型 API 网关</h2>
          <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2, textAlign: 'justify' }}>
            <p style={{ marginBottom: 16 }}>aiburj API 网关为企业提供统一的大模型 API 接入和管理能力。无论你使用多少个模型厂商、多少种 API 协议，网关都能帮你实现统一管控。</p>
            <p style={{ marginBottom: 16 }}>内置完善的访问控制、流量限制、密钥管理和审计日志功能。支持按用户、按模型、按接口粒度的精细化权限配置。</p>
            <p>智能路由引擎可根据请求类型、成本预算、延迟要求等条件，自动将请求分发到最优模型实例，最大化资源利用效率。</p>
          </div>
        </div>
        <div style={{ flex: '0 0 440px', height: 320, background: 'linear-gradient(135deg, #E8F0FE 0%, #D4E2FC 50%, #BFD4F8 100%)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: BRAND.primary, opacity: 0.12, letterSpacing: 4 }}>GATEWAY</div>
            <div style={{ fontSize: 14, color: BRAND.accent, marginTop: 12, fontWeight: 500 }}>统一接入 · 安全管控</div>
          </div>
        </div>
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
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>开启企业级 API 治理</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>获取定制化的 API 网关部署方案和技术评估。</p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          联系销售 <ArrowRight size={18} />
        </a>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/gateway')({
  component: ProductsGateway,
})
