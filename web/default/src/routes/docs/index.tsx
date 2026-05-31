import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Key, Cpu, Code, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

const steps = [
  {
    num: '01',
    icon: Key,
    title: '获取 API Key',
    desc: '注册后在控制台创建 API Key，用于身份认证。',
    action: '创建 Key',
    href: '/keys',
  },
  {
    num: '02',
    icon: Cpu,
    title: '选择模型',
    desc: '在模型市场浏览国产大模型，查看价格和能力，选择适合你的模型。',
    action: '浏览模型',
    href: '/pricing',
  },
  {
    num: '03',
    icon: Code,
    title: '调用 API',
    desc: '使用 OpenAI 兼容格式，一行代码即可调用所有国产大模型。',
    action: '查看示例',
    href: '#examples',
  },
]

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: '#1E1E2E', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#9098B0', fontSize: 12, fontWeight: 600 }}>{label}</span>
        <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#6E29F6' : '#57627F', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, padding: '20px', margin: 0, overflow: 'auto' }}>{code}</pre>
    </div>
  )
}

const curlCode = `curl https://api.aiburj.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer *** \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [
      {"role": "user", "content": "你好，请用中文回复"}
    ],
    "max_tokens": 500
  }'`

const pythonCode = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.aiburj.com/v1",
    api_key="sk-your-api-key-here"
)

response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {"role": "user", "content": "你好，请用中文回复"}
    ],
    max_tokens=500
)

print(response.choices[0].message.content)`

const endpoints = [
  { method: 'POST', path: '/v1/chat/completions', desc: '对话补全（支持流式 SSE）' },
  { method: 'POST', path: '/v1/embeddings', desc: '文本向量化' },
  { method: 'POST', path: '/v1/images/generations', desc: '图片生成' },
  { method: 'GET', path: '/v1/models', desc: '获取可用模型列表' },
]

export function DocsPage() {
  return (
    <PublicLayout showMainContainer={false}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F5F0FF, #EDE9FE, #E0E7FF)', padding: '100px 24px 80px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, color: '#161722', marginBottom: 16 }}>快速入门</h1>
        <p style={{ fontSize: 17, color: '#57627F', maxWidth: 480, margin: '0 auto' }}>三步接入 aiburj，零门槛调用国产大模型 API</p>
      </section>

      {/* Steps */}
      <section style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '36px 28px', border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6E29F6', marginBottom: 16, letterSpacing: 1 }}>步骤 {s.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0EBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <s.icon size={22} color="#6E29F6" />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: '#161722', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#57627F', lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
              <Link to={s.href} style={{ fontSize: 14, fontWeight: 600, color: '#6E29F6', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                {s.action} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Code Examples */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 24px' }} id="examples">
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#161722', marginBottom: 40 }}>代码示例</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))', gap: 24 }}>
          <CodeBlock code={curlCode} label="cURL" />
          <CodeBlock code={pythonCode} label="Python (OpenAI SDK)" />
        </div>
      </section>

      {/* API Endpoints */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#161722', marginBottom: 40 }}>API 端点</h2>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid #F0F1F3', background: '#F8F9FC', fontSize: 12, fontWeight: 600, color: '#9098B0' }}>
            <span>方法</span>
            <span>端点</span>
            <span>说明</span>
          </div>
          {endpoints.map((ep, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', padding: '16px 24px', borderBottom: i < endpoints.length - 1 ? '1px solid #F0F1F3' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6E29F6', background: '#F0EBFF', padding: '3px 8px', borderRadius: 4, display: 'inline-block', width: 'fit-content' }}>{ep.method}</span>
              <code style={{ fontSize: 13, color: '#161722' }}>{ep.path}</code>
              <span style={{ fontSize: 13, color: '#57627F' }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </PublicLayout>
  )
}

export const Route = createFileRoute('/docs/')({
  component: DocsPage,
})
