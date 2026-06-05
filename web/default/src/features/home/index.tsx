import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

const slides = [
  { title: '一站式接入国内主流', title2: '大模型 API 服务', desc: 'OpenAI 兼容格式，统一 API 调用 DeepSeek、通义千问、GLM 等国产大模型，按量计费，快速集成', bg: 'url(/banner-1.png) center/cover no-repeat, linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 30%, #E0E7FF 70%, #F5F0FF 100%)', textColor: '#161722', badge: '国产大模型 API 聚合平台', hasImage: true },
  { title: '覆盖 8 大国产厂商', title2: '16 款主流模型', desc: 'DeepSeek V4、Qwen3、GLM-5.1、Kimi-K2 等最新旗舰模型，一次接入全部调用', bg: 'url(/banner-2.png) center/cover no-repeat, linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #4c1d95 100%)', textColor: '#ffffff', badge: '模型生态', hasImage: true },
  { title: '比官方更低的价格', title2: '按量计费无门槛', desc: '新用户注册即享体验额度，高速推理 10x 加速，99.9% 服务可用性', bg: 'url(/banner-3.png) center/cover no-repeat, linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)', textColor: '#ffffff', badge: '高性价比', hasImage: true },
  { title: '三步接入，零门槛', title2: '一行代码调用大模型', desc: '获取 API Key → 选择模型 → 复制代码，OpenAI SDK 直接兼容，5 分钟完成集成', bg: 'url(/banner-4.png) center/cover no-repeat, linear-gradient(135deg, #2e1065 0%, #4c1d95 40%, #6d28d9 100%)', textColor: '#ffffff', badge: '极速接入', hasImage: true },
  { title: '企业级安全合规', title2: '数据隐私全面保障', desc: '支持私有化部署，计算隔离/网络隔离/存储隔离，符合行业安全标准与合规要求', bg: 'url(/banner-5.png) center/cover no-repeat, linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 50%, #312e81 100%)', textColor: '#ffffff', badge: '安全可靠', hasImage: true },
]

const models = [
  { name: 'DeepSeek-V4 Pro', vendor: '深度求索', desc: '百万tokens上下文' },
  { name: 'Qwen3-235B', vendor: '阿里云', desc: '开源最强旗舰' },
  { name: 'GLM-5.1', vendor: '智谱AI', desc: '自主工作8小时' },
  { name: 'Kimi-K2', vendor: '月之暗面', desc: '长上下文推理' },
  { name: '豆包1.5 Pro', vendor: '字节跳动', desc: '最新旗舰模型' },
  { name: '百川4', vendor: '百川智能', desc: '通用大模型' },
  { name: 'Yi-Lightning', vendor: '零一万物', desc: '高速推理引擎' },
  { name: '星火4.0', vendor: '科大讯飞', desc: '教育办公优化' },
]

export function Home() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])
  const s = slides[current]

  return (
    <PublicLayout showMainContainer={false}>
      {/* Hero Carousel */}
      <section style={{ background: s.bg, position: 'relative', overflow: 'hidden', minHeight: 520, display: 'flex', alignItems: 'center', transition: 'background 0.6s ease' }}>
        {(s as any).hasImage && <div style={{ position: 'absolute', inset: 0, background: s.textColor === '#ffffff' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.5)', zIndex: 0 }} />}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 120px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: s.textColor === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(110,41,246,0.08)', border: s.textColor === '#ffffff' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(110,41,246,0.15)', borderRadius: 50, padding: '6px 18px', fontSize: 13, color: s.textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : '#6E29F6', fontWeight: 500, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: s.textColor === '#ffffff' ? '#fff' : '#6E29F6', display: 'inline-block' }} />{s.badge}
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 900, lineHeight: 1.2, color: s.textColor, marginBottom: 20 }}>{s.title}<br/>{s.title2}</h1>
          <p style={{ fontSize: 18, color: s.textColor === '#ffffff' ? 'rgba(255,255,255,0.7)' : '#57627F', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>{s.desc}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button style={{ height: 46, padding: '0 32px', fontSize: 15, fontWeight: 600, borderRadius: 10, background: '#6E29F6' }} render={<Link to="/sign-up" />}>立即体验 <ArrowRight style={{ marginLeft: 6, width: 16 }} /></Button>
            <Button variant="outline" style={{ height: 46, padding: '0 32px', fontSize: 15, fontWeight: 500, borderRadius: 10, borderColor: '#D5D6EA', color: '#252736' }} render={<Link to="/pricing" />}>查看模型</Button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 2 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? (s.textColor === '#ffffff' ? '#fff' : '#6E29F6') : (s.textColor === '#ffffff' ? 'rgba(255,255,255,0.3)' : 'rgba(110,41,246,0.3)'), border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </section>

      {/* 指标栏 */}
      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #F0F1F3' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center' }}>
          {[{ n: '16', label: '模型' }, { n: '8', label: '厂商' }, { n: '99.9%', label: '可用性' }, { n: '100%', label: '国产模型' }].map((st, i) => (
            <div key={i}><div style={{ fontSize: 40, fontWeight: 900, color: '#161722', marginBottom: 4 }}>{st.n}</div><div style={{ fontSize: 14, color: '#9098B0' }}>{st.label}</div></div>
          ))}
        </div>
      </section>

      {/* 产品矩阵 */}
      <section style={{ background: '#F4F8FC', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#252736', marginBottom: 16, letterSpacing: '-0.02em' }}>全场景 AI 能力平台</h2>
            <p style={{ fontSize: 17, color: '#4A6A8A' }}>助力用户一站式实现 AI 能力与应用的快速对接</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: '开箱即用的大模型 API', desc: '覆盖语言、语音、图片、视频等场景，一站式提供大模型 API 服务，按量计费，助力应用快速上线。', img: '/product-api.png', tag: 'API 服务' },
              { title: '高效能模型推理加速', desc: '自研推理加速引擎，无论是自研模型还是开源模型，均可接入高效推理加速服务，全面提升响应速度与处理性能。', img: '/product-speed.png', tag: '推理加速' },
              { title: '按量计费 + 企业级保障', desc: '无月费无门槛，按实际 Token 用量计费。提供企业级 SLA 保障，99.9% 服务可用性，新用户注册即享体验额度。', img: '/product-billing.png', tag: '灵活计费' },
              { title: '专属预留实例', desc: '面向企业核心推理场景，提供独占算力、精度保障与成本优化的一站式方案，支撑关键业务稳定运行。', img: '/product-reserved.png', tag: '企业方案' },
              { title: '私有化部署', desc: '提供企业级私有化部署方案，一站式解决模型性能优化、部署与运维等痛点，满足多样化场景需求。', img: '/product-private.png', tag: '私有部署' },
              { title: '多模态 AI 服务', desc: '整合视觉理解、语音识别、视频生成等多模态能力，统一 API 调用，覆盖内容创作、智能客服、实时互动等场景。', img: '/product-multimodal.png', tag: '多模态' },
            ].map((card, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '36px 28px', border: '1px solid #D5D6EA', transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,74,143,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,74,143,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#D5D6EA' }}
              >
                <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,74,143,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ marginBottom: 18, borderRadius: 12, overflow: 'hidden', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F7FF' }}>
                    <img src={card.img} alt={card.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#004A8F', background: 'rgba(0,74,143,0.06)', padding: '4px 12px', borderRadius: 6, display: 'inline-block', marginBottom: 12 }}>{card.tag}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#252736', marginBottom: 8 }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: '#4A6A8A', lineHeight: 1.7 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选择 */}
      <section style={{ background: '#F5F6FA', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, color: '#161722', marginBottom: 12 }}>为什么选择 aiburj</h2>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#57627F', marginBottom: 64 }}>致力于成为国内领先的 AI 能力提供商</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 0, background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #EEEFF2' }}>
            {[
              { metric: '10x+', label: '速度提升', tag: '针对语言模型', items: ['1s 出图', '3x+ 提升，针对生图模型', '100ms 语音生成'] },
              { metric: '66%', label: '成本节省', tag: '针对生图模型', items: ['46% 成本节省，针对语言模型', '52% 成本下降，针对客户托管', '按量计费，无资源浪费'] },
              { metric: '99.9%', label: '服务可用', tag: '企业级稳定性', items: ['经过开发者验证，高可靠运行', '完善监控和容错机制', '专业技术支持，企业级 SLA'] },
              { metric: '100%', label: '国产模型', tag: '国内厂商全覆盖', items: ['8 大国内厂商，16 款模型', '统一 API 格式调用', '持续接入最新国产大模型'] },
              { metric: '0 门槛', label: '快速接入', tag: 'OpenAI 兼容格式', items: ['一行代码切换模型', '无需适配不同 API', '完善的文档和示例代码'] },
            ].map((col, i) => (
              <div key={i} style={{ padding: '36px 28px', borderRight: i < 4 ? '1px solid #F0F1F3' : 'none', borderBottom: '1px solid #F0F1F3' }}>
                <div style={{ marginBottom: 20 }}><span style={{ fontSize: 42, fontWeight: 900, color: '#6E29F6' }}>{col.metric}</span><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}><span style={{ fontSize: 18, fontWeight: 700, color: '#161722' }}>{col.label}</span><span style={{ fontSize: 11, color: '#9098B0', background: '#F5F6FA', padding: '2px 8px', borderRadius: 4 }}>{col.tag}</span></div></div>
                {col.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="8" cy="8" r="6" stroke="#6E29F6" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="#6E29F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: 13, color: '#57627F', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 已接入模型 */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#161722', marginBottom: 48 }}>已接入国产大模型</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {models.map((m, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '20px 22px', border: '1px solid #E5E7EB', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6E29F6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#161722', marginBottom: 4 }}>{m.name}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9098B0', marginTop: 4 }}><span>{m.vendor}</span><span>{m.desc}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* 代码示例 */}
      <section style={{ background: '#F5F6FA', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#161722', marginBottom: 16 }}>三步接入</h2>
          <p style={{ textAlign: 'center', fontSize: 15, color: '#57627F', marginBottom: 48 }}>获取 API Key → 选择模型 → 复制代码，零门槛集成</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 24 }}>
            <div style={{ background: '#1E1E2E', borderRadius: 14, padding: 28 }}>
              <div style={{ color: '#9098B0', fontSize: 11, fontWeight: 600, marginBottom: 12 }}>cURL</div>
              <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{`curl https://api.aiburj.com/v1/chat/completions \\
  -H "Authorization: Bearer *** \\
  -H "Content-Type: application/json" \\
  -d '{"model":"deepseek-v4-pro","messages":[{"role":"user","content":"你好"}]}'`}</pre>
            </div>
            <div style={{ background: '#1E1E2E', borderRadius: 14, padding: 28 }}>
              <div style={{ color: '#9098B0', fontSize: 11, fontWeight: 600, marginBottom: 12 }}>Python</div>
              <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{`from openai import OpenAI
client = OpenAI(base_url="https://api.aiburj.com/v1", api_key="sk-xxx")
r = client.chat.completions.create(model="deepseek-v4-pro",
  messages=[{"role":"user","content":"你好"}])
print(r.choices[0].message.content)`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #6E29F6, #8B5CF6)', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>开始构建你的 AI 应用</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 32 }}>注册即享体验额度，零成本测试所有国产大模型</p>
        <Button style={{ height: 48, padding: '0 40px', fontSize: 16, fontWeight: 600, borderRadius: 10, background: '#fff', color: '#6E29F6' }} render={<Link to="/sign-up" />}>免费注册 <ArrowRight style={{ marginLeft: 6, width: 18 }} /></Button>
      </section>

      <Footer />
    </PublicLayout>
  )
}
