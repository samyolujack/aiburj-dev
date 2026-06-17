import { createFileRoute } from '@tanstack/react-router'
import { ProductsLayout } from '@/features/products/products-layout'
import { BrandedIllustration } from '@/features/products/product-illustration'
import { Route as RouteIcon, Shield, Gauge, Repeat, ArrowRight, Check, X, Layers, Key, BarChart3 } from 'lucide-react'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', border: '#E8ECF2', light: '#F0F4FA' }

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

const gatewayModules = [
  { icon: Layers, name: '路由层', desc: '请求分发 · 协议转换 · 格式适配', color: '#3B82F6' },
  { icon: Key, name: '鉴权层', desc: 'API Key 验证 · 权限控制 · IP 白名单', color: '#8B5CF6' },
  { icon: Gauge, name: '流控层', desc: '速率限制 · 并发控制 · 配额管理', color: '#F59E0B' },
  { icon: BarChart3, name: '监控层', desc: '用量统计 · 调用审计 · 告警通知', color: '#10B981' },
]

const comparisonData = [
  { label: '接入方式', aiburj: '统一网关 · 一个入口', direct: '逐厂商对接 · N个入口', aiburjWin: true },
  { label: '鉴权管理', aiburj: '集中管理 · 一套Key', direct: '各家独立 · N套凭证', aiburjWin: true },
  { label: '流量控制', aiburj: '多维度细粒度限流', direct: '依赖厂商能力，参差不齐', aiburjWin: true },
  { label: '协议兼容', aiburj: '自动转换 · 统一格式', direct: '各家用各家协议', aiburjWin: true },
  { label: '监控告警', aiburj: '统一面板 · 全链路追踪', direct: '需自建监控体系', aiburjWin: true },
  { label: '故障切换', aiburj: '自动故障转移', direct: '手动切换 · 无容错', aiburjWin: true },
]

function ProductsGateway() {
  return (
    <ProductsLayout>
      {/* ── Hero ── */}
      <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '200px 60px 140px', textAlign: 'center', marginBottom: 0, position: 'relative', overflow: 'hidden', background: '#001840' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/product-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
        {/* Bottom glow */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,128,192,0.2) 0%, transparent 70%)', zIndex: 0 }} />
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1 }}>API 网关</h1>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 36px', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
          企业级大模型 API 网关，提供统一接入、安全管控、智能路由和用量监控能力。
        </p>
        <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          了解详情 <ArrowRight size={18} />
        </a>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 32, position: 'relative', zIndex: 1 }}>
          {[{ value: '统一', label: 'API 接入' }, { value: '智能', label: '限流路由' }, { value: '毫秒级', label: '负载均衡' }].map((s, i) => (
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
            <h2 style={{ fontSize: 36, fontWeight: 700, color: BRAND.deep, marginBottom: 24 }}>企业级大模型 API 网关</h2>
            <div style={{ fontSize: 16, color: BRAND.muted, lineHeight: 2 }}>
              <p style={{ marginBottom: 16 }}>aiburj API 网关为企业提供统一的大模型 API 接入和管理能力。无论你使用多少个模型厂商、多少种 API 协议，网关都能帮你实现统一管控。</p>
              <p style={{ marginBottom: 16 }}>内置完善的访问控制、流量限制、密钥管理和审计日志功能。支持按用户、按模型、按接口粒度的精细化权限配置。</p>
              <p>智能路由引擎可根据请求类型、成本预算、延迟要求等条件，自动将请求分发到最优模型实例，最大化资源利用效率。</p>
            </div>
          </div>
          <BrandedIllustration icon="🌐" title="API 网关" subtitle="统一入口 · 智能路由" />
        </div>
      </div>

      {/* ── 网关四层架构 ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Architecture</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>四层网关架构</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>从请求入口到后端服务，每一层都有专属优化</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {gatewayModules.map((mod, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`, padding: '28px 20px', textAlign: 'center', minWidth: 160, transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${mod.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <mod.icon size={22} color={mod.color} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: mod.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, background: `${mod.color}12`, display: 'inline-block', padding: '2px 8px', borderRadius: 4 }}>{mod.name}</div>
                <p style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>{mod.desc}</p>
              </div>
              {i < gatewayModules.length - 1 && (
                <div style={{ fontSize: 20, color: BRAND.accent, fontWeight: 700 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 网关 vs 直连对比 ── */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: BRAND.deep, marginBottom: 8 }}>网关 vs 直连厂商</h2>
          <p style={{ fontSize: 15, color: BRAND.muted }}>统一网关带来的不只是便利，更是企业级管控能力</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', background: BRAND.light, borderBottom: `1px solid ${BRAND.border}`, fontSize: 14, fontWeight: 700, color: BRAND.deep }}>
            <div>对比维度</div>
            <div style={{ textAlign: 'center', color: BRAND.primary }}>aiburj 网关</div>
            <div style={{ textAlign: 'center' }}>直连厂商</div>
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
                <span>{row.direct}</span>
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
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16 }}>开启企业级 API 治理</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 28px' }}>获取定制化的 API 网关部署方案和技术评估。</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:contact@aiburj.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16, background: '#fff', color: BRAND.primary, textDecoration: 'none' }}>
            联系销售 <ArrowRight size={18} />
          </a>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 20px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>企业级 API 治理</div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>30 分钟技术评估</div>
          </div>
        </div>
        </div>
      </div>
    </ProductsLayout>
  )
}

export const Route = createFileRoute('/products/gateway')({ component: ProductsGateway })
