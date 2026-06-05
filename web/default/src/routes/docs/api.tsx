import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

const endpoints = [
  { method: 'POST', path: '/v1/chat/completions', desc: '对话补全（支持流式 SSE）', auth: 'Bearer' },
  { method: 'POST', path: '/v1/embeddings', desc: '文本向量化', auth: 'Bearer' },
  { method: 'POST', path: '/v1/images/generations', desc: '图片生成', auth: 'Bearer' },
  { method: 'GET', path: '/v1/models', desc: '获取可用模型列表', auth: 'Bearer' },
  { method: 'GET', path: '/v1/models/:model', desc: '获取指定模型信息', auth: 'Bearer' },
  { method: 'POST', path: '/v1/audio/transcriptions', desc: '语音转文字', auth: 'Bearer' },
  { method: 'POST', path: '/v1/audio/speech', desc: '文字转语音', auth: 'Bearer' },
]

const params = [
  { name: 'model', type: 'string', required: '是', desc: '模型 ID，如 deepseek-v4-pro、qwen3.5' },
  { name: 'messages', type: 'array', required: '是', desc: '消息列表，每项包含 role（system/user/assistant）和 content' },
  { name: 'max_tokens', type: 'integer', required: '否', desc: '最大输出 tokens，默认模型最大值' },
  { name: 'temperature', type: 'float', required: '否', desc: '采样温度 0-2，默认 1' },
  { name: 'stream', type: 'boolean', required: '否', desc: '是否流式输出，默认 false' },
  { name: 'top_p', type: 'float', required: '否', desc: '核采样概率，默认 1' },
]

function AboutApiPage() {
  return (
    <PublicLayout showMainContainer={false}>
      <section style={{
        background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)',
        padding: '100px 24px 60px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>API 手册</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>OpenAI 兼容格式，完整 API 参考</p>
      </section>

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#002060', marginBottom: 28 }}>基础信息</h2>
        <div style={{
          background: '#F4F8FC', borderRadius: 14, padding: '28px 32px',
          border: '1px solid #D5D6EA', marginBottom: 48,
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ color: '#4A6A8A', fontSize: 14 }}>Base URL：</span>
            <code style={{ fontSize: 15, color: '#004A8F', background: '#E8F0FE', padding: '4px 10px', borderRadius: 6, marginLeft: 8 }}>
              https://api.aiburj.com/v1
            </code>
          </div>
          <div>
            <span style={{ color: '#4A6A8A', fontSize: 14 }}>认证方式：</span>
            <code style={{ fontSize: 15, color: '#004A8F', background: '#E8F0FE', padding: '4px 10px', borderRadius: 6, marginLeft: 8 }}>
              Authorization: Bearer {'{'}your_api_key{'}'}
            </code>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#002060', marginBottom: 28 }}>API 端点列表</h2>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF2', overflow: 'hidden', marginBottom: 48 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 80px',
            padding: '12px 24px', borderBottom: '1px solid #E8ECF2',
            background: '#F4F8FC', fontSize: 12, fontWeight: 600, color: '#64748B',
          }}>
            <span>方法</span><span>端点</span><span>说明</span><span>认证</span>
          </div>
          {endpoints.map((ep, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 80px',
              padding: '14px 24px', alignItems: 'center',
              borderBottom: i < endpoints.length - 1 ? '1px solid #F0F2F5' : 'none',
            }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#004A8F',
                background: '#E8F0FE', padding: '3px 8px', borderRadius: 4,
                display: 'inline-block', width: 'fit-content',
              }}>{ep.method}</span>
              <code style={{ fontSize: 13, color: '#002060' }}>{ep.path}</code>
              <span style={{ fontSize: 13, color: '#4A6A8A' }}>{ep.desc}</span>
              <span style={{ fontSize: 12, color: '#64748B' }}>{ep.auth}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#002060', marginBottom: 28 }}>Chat Completions 参数</h2>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF2', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '140px 80px 50px 1fr',
            padding: '12px 24px', borderBottom: '1px solid #E8ECF2',
            background: '#F4F8FC', fontSize: 12, fontWeight: 600, color: '#64748B',
          }}>
            <span>参数</span><span>类型</span><span>必填</span><span>说明</span>
          </div>
          {params.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '140px 80px 50px 1fr',
              padding: '12px 24px', alignItems: 'center', fontSize: 13,
              borderBottom: i < params.length - 1 ? '1px solid #F0F2F5' : 'none',
            }}>
              <code style={{ color: '#004A8F', fontWeight: 500 }}>{p.name}</code>
              <span style={{ color: '#4A6A8A' }}>{p.type}</span>
              <span style={{ color: p.required === '是' ? '#DC2626' : '#64748B' }}>{p.required}</span>
              <span style={{ color: '#4A6A8A' }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </PublicLayout>
  )
}

export const Route = createFileRoute('/docs/api')({
  component: AboutApiPage,
})
