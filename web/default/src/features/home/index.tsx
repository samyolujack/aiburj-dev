import { Link } from '@tanstack/react-router'
import { ArrowRight, Zap, Shield, Sparkles, TrendingUp, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

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

const features = [
  { icon: Zap, title: '高速推理', desc: '优质算力加速，响应速度提升10倍以上' },
  { icon: Shield, title: '高稳定性', desc: '99.9%服务可用性，企业级容错保障' },
  { icon: Sparkles, title: '高智能', desc: '覆盖语言/视觉/推理全模态大模型' },
  { icon: TrendingUp, title: '高性价比', desc: '比官方API更低的价格，按量计费' },
  { icon: Globe, title: '统一接入', desc: 'OpenAI兼容格式，一次接入调用所有模型' },
]

export function Home() {
  return (
    <PublicLayout showMainContainer={false}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 30%, #E0E7FF 70%, #F5F0FF 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 100px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(110,41,246,0.08)', border: '1px solid rgba(110,41,246,0.15)', borderRadius: 50, padding: '6px 18px', fontSize: 13, color: '#6E29F6', fontWeight: 500, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#6E29F6', display: 'inline-block' }} />
            国产大模型 API 聚合平台
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 900, lineHeight: 1.2, color: '#161722', marginBottom: 20 }}>
            一站式接入国内主流<br/>大模型 API 服务
          </h1>
          <p style={{ fontSize: 18, color: '#57627F', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            OpenAI 兼容格式，统一 API 调用 DeepSeek、通义千问、GLM 等国产大模型，按量计费，快速集成
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button style={{ height: 46, padding: '0 32px', fontSize: 15, fontWeight: 600, borderRadius: 10, background: '#6E29F6' }} render={<Link to="/sign-up" />}>
              立即体验 <ArrowRight style={{ marginLeft: 6, width: 16 }} />
            </Button>
            <Button variant="outline" style={{ height: 46, padding: '0 32px', fontSize: 15, fontWeight: 500, borderRadius: 10, borderColor: '#D5D6EA', color: '#252736' }} render={<Link to="/pricing" />}>
              查看模型
            </Button>
          </div>
        </div>
      </section>

      {/* 指标栏 */}
      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #F0F1F3' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { n: '16', label: '模型' },
            { n: '8', label: '厂商' },
            { n: '99.9%', label: '可用性' },
            { n: '100%', label: '国产模型' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#161722', marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 14, color: '#9098B0' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 产品矩阵 */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, color: '#161722', marginBottom: 12 }}>全场景产品矩阵</h2>
        <p style={{ textAlign: 'center', fontSize: 16, color: '#57627F', marginBottom: 56, maxWidth: 500, margin: '0 auto 56px' }}>
          助力用户一站式实现 AI 能力与应用的快速对接
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>
          {[
            {
              title: '开箱即用的大模型 API',
              desc: '覆盖语言、语音、图片、视频等场景，一站式提供大模型 API 服务，按量计费，助力应用快速上线。',
              link: '立即体验',
              svg: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="14" fill="#F0EBFF"/>
                  <path d="M14 16h20M14 24h20M14 32h12" stroke="#6E29F6" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )
            },
            {
              title: '高效能模型推理加速',
              desc: '自研推理加速引擎，无论是自研模型还是开源模型，均可接入高效推理加速服务，全面提升响应速度与处理性能。',
              link: '了解详情',
              svg: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="14" fill="#F0EBFF"/>
                  <path d="M24 12v8l6-4-6 6v8l6-4" stroke="#6E29F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )
            },
            {
              title: '按量计费 + 企业级保障',
              desc: '无月费无门槛，按实际 Token 用量计费。提供企业级 SLA 保障，99.9% 服务可用性，新用户注册即享体验额度。',
              link: '立即体验',
              svg: (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="14" fill="#F0EBFF"/>
                  <circle cx="24" cy="20" r="6" stroke="#6E29F6" strokeWidth="2.5"/>
                  <path d="M16 32c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#6E29F6" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M24 14v2M24 26v2M18 18l1.5 1.5M28.5 22.5L30 24M30 18l-1.5 1.5M19.5 22.5L18 24" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            },
          ].map((card, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '40px 32px',
              border: '1px solid #E5E7EB', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#6E29F6'
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(110,41,246,0.1), 0 0 0 1px rgba(110,41,246,0.1)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              onClick={() => window.location.href='/pricing'}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,41,246,0.06) 0%, transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: 24 }}>{card.svg}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#161722', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: '#57627F', lineHeight: 1.8, marginBottom: 20 }}>{card.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#6E29F6', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {card.link}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#6E29F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 为什么选择 */}
      <section style={{ background: '#F5F6FA', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, color: '#161722', marginBottom: 12 }}>为什么选择 aiburj</h2>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#57627F', marginBottom: 64 }}>
            致力于成为国内领先的 AI 能力提供商
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 0, background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #EEEFF2' }}>
            {[
              {
                metric: '10x+', label: '速度提升', tag: '针对语言模型',
                items: ['1s 出图', '3x+ 提升，针对生图模型', '100ms 语音生成']
              },
              {
                metric: '66%', label: '成本节省', tag: '针对生图模型',
                items: ['46% 成本节省，针对语言模型', '52% 成本下降，针对客户托管', '按量计费，无资源浪费']
              },
              {
                metric: '99.9%', label: '服务可用', tag: '企业级稳定性',
                items: ['经过开发者验证，高可靠运行', '完善监控和容错机制', '专业技术支持，企业级 SLA']
              },
              {
                metric: '100%', label: '国产模型', tag: '国内厂商全覆盖',
                items: ['8 大国内厂商，16 款模型', '统一 API 格式调用', '持续接入最新国产大模型']
              },
              {
                metric: '0 门槛', label: '快速接入', tag: 'OpenAI 兼容格式',
                items: ['一行代码切换模型', '无需适配不同 API', '完善的文档和示例代码']
              },
            ].map((col, i) => (
              <div key={i} style={{
                padding: '36px 28px', borderRight: i < 4 ? '1px solid #F0F1F3' : 'none',
                borderBottom: '1px solid #F0F1F3'
              }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 42, fontWeight: 900, color: '#6E29F6', lineHeight: 1 }}>{col.metric}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#161722' }}>{col.label}</span>
                    <span style={{ fontSize: 11, color: '#9098B0', background: '#F5F6FA', padding: '2px 8px', borderRadius: 4 }}>{col.tag}</span>
                  </div>
                </div>
                <div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                        <circle cx="8" cy="8" r="6" stroke="#6E29F6" strokeWidth="1.5"/>
                        <path d="M5 8l2 2 4-4" stroke="#6E29F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: 13, color: '#57627F', lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
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
            <div key={i} style={{
              background: '#fff', borderRadius: 12, padding: '20px 22px',
              border: '1px solid #E5E7EB', transition: 'all 0.2s', cursor: 'default'
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#6E29F6' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#161722', marginBottom: 4 }}>{m.name}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9098B0', marginTop: 4 }}>
                <span>{m.vendor}</span>
                <span>{m.desc}</span>
              </div>
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
            <div style={{ background: '#1E1E2E', borderRadius: 14, padding: 28, overflow: 'hidden' }}>
              <div style={{ color: '#9098B0', fontSize: 11, fontWeight: 600, marginBottom: 12, letterSpacing: 0.5 }}>cURL</div>
              <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`curl https://api.aiburj.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role":"user","content":"你好"}]
  }'`}
              </pre>
            </div>
            <div style={{ background: '#1E1E2E', borderRadius: 14, padding: 28, overflow: 'hidden' }}>
              <div style={{ color: '#9098B0', fontSize: 11, fontWeight: 600, marginBottom: 12, letterSpacing: 0.5 }}>Python</div>
              <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`from openai import OpenAI

client = OpenAI(
  base_url="https://api.aiburj.com/v1",
  api_key="sk-xxx"
)

response = client.chat.completions.create(
  model="deepseek-v4-pro",
  messages=[{"role":"user","content":"你好"}]
)
print(response.choices[0].message.content)`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <section style={{ background: 'linear-gradient(135deg, #6E29F6, #8B5CF6)', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>开始构建你的 AI 应用</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 32 }}>注册即享体验额度，零成本测试所有国产大模型</p>
        <Button style={{ height: 48, padding: '0 40px', fontSize: 16, fontWeight: 600, borderRadius: 10, background: '#fff', color: '#6E29F6' }} render={<Link to="/sign-up" />}>
          免费注册 <ArrowRight style={{ marginLeft: 6, width: 18 }} />
        </Button>
      </section>

      <Footer />
    </PublicLayout>
  )
}
