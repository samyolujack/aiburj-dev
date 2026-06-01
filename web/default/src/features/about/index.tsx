import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

export function About() {
  return (
    <PublicLayout showMainContainer={false}>
      <section style={{ background: 'linear-gradient(135deg, #F5F0FF, #EDE9FE, #E0E7FF)', padding: '100px 24px 80px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, color: '#161722', marginBottom: 16 }}>关于 aiburj</h1>
        <p style={{ fontSize: 17, color: '#57627F', maxWidth: 480, margin: '0 auto' }}>国产大模型 API 聚合平台</p>
      </section>
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '40px', lineHeight: 1.9, color: '#57627F', fontSize: 15 }}>
          <p style={{ marginBottom: 20 }}>aiburj 是一个国产大模型 API 聚合平台，提供 OpenAI 兼容格式的统一 API 接口，让开发者可以用一行代码接入 DeepSeek、通义千问、GLM、Kimi 等国产主流大模型。</p>
          <p>我们致力于降低 AI 应用开发门槛，提供高速推理、按量计费、企业级稳定性保障，助力开发者快速构建 AI 产品。</p>
        </div>
      </section>
      <Footer />
    </PublicLayout>
  )
}
