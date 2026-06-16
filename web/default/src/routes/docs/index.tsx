import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Key, Cpu, Code, Copy, Check, Zap, Shield, Globe } from 'lucide-react'
import { useState } from 'react'
import { PublicLayout } from '@/components/layout'

const steps = [
  { num: '01', icon: Key, title: '获取 API Key', desc: '注册后在控制台创建 API Key，用于身份认证。', action: '创建 Key', href: '/keys' },
  { num: '02', icon: Cpu, title: '选择模型', desc: '在模型市场浏览国产大模型，查看价格和能力。', action: '浏览模型', href: '/pricing' },
  { num: '03', icon: Code, title: '调用 API', desc: '使用 OpenAI 兼容格式，一行代码即可调用所有国产大模型。', action: '查看示例', href: '#examples' },
]

const features = [
  { icon: Zap, title: '高速推理', desc: '自研推理加速，极低延迟响应' },
  { icon: Shield, title: '高稳定性', desc: '99.9% 可用性保障，自动容错切换' },
  { icon: Globe, title: '多模型聚合', desc: '12+ 厂商 50+ 模型，一站式调用' },
]

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ background: '#1A1D2E', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#9098B0', fontSize: 12, fontWeight: 600 }}>{label}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#0080C0' : '#57627F', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre style={{ color: '#CDD6F4', fontSize: 13, lineHeight: 1.8, padding: '20px', margin: 0, overflow: 'auto' }}>{code}</pre>
    </div>
  )
}

const curlCode = `curl https://api.aiburj.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $AIBURJ_API_KEY" \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [
      {"role": "user", "content": "你好，请用中文回复"}
    ],
    "max_tokens": 500,
    "stream": true
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
    max_tokens=500,
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`

const jsCode = `import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.aiburj.com/v1',
    apiKey: 'sk-your-api-key-here',
});

const stream = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [{ role: 'user', content: '你好，请用中文回复' }],
    max_tokens: 500,
    stream: true,
});

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`

export function DocsPage() {
  return (
    <PublicLayout showMainContainer={false}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)',
        padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.2) 0%, transparent 60%)',
        }} />
        <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>快速入门</h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          三步接入 aiburj，零门槛调用国产大模型 API
        </p>
      </section>

      {/* Steps */}
      <section style={{ maxWidth: 1000, margin: '-48px auto 0', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '36px 28px',
              border: '1px solid #E8ECF2', boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,74,143,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0080C0', marginBottom: 16, letterSpacing: 1 }}>步骤 {s.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <s.icon size={22} color="#004A8F" />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: '#002060', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#4A6A8A', lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
              <Link to={s.href} style={{ fontSize: 14, fontWeight: 600, color: '#004A8F', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                {s.action} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Platform features */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 24px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, color: '#002060', marginBottom: 40, letterSpacing: '-0.02em' }}>平台特性</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#F4F8FC', borderRadius: 14, padding: '32px 24px',
              textAlign: 'center', border: '1px solid #E8ECF2',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,74,143,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <f.icon size={32} color="#004A8F" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#002060', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#4A6A8A', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Examples */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 24px 0' }} id="examples">
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, color: '#002060', marginBottom: 40, letterSpacing: '-0.02em' }}>代码示例</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))', gap: 24 }}>
          <CodeBlock code={curlCode} label="cURL" />
          <CodeBlock code={pythonCode} label="Python (OpenAI SDK)" />
        </div>
        <div style={{ marginTop: 24 }}>
          <CodeBlock code={jsCode} label="JavaScript / TypeScript" />
        </div>
      </section>
    </PublicLayout>
  )
}

export const Route = createFileRoute('/docs/')({
  component: DocsPage,
})
