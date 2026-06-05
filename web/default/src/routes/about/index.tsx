import { createFileRoute } from '@tanstack/react-router'
import { AboutLayout } from '@/features/about/about-layout'
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/about/')({
  component: AboutCompany,
})

function AboutCompany() {
  return (
    <AboutLayout>
      {/* Hero Banner — matches siliconflow "加速 AGI 普惠人类" */}
      <div style={{
        background: 'linear-gradient(135deg, #004A8F 0%, #002060 40%, #001840 100%)',
        borderRadius: 20,
        padding: '80px 60px',
        textAlign: 'center',
        marginBottom: 64,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.15) 0%, transparent 60%)',
        }} />
        <h1 style={{
          fontSize: 48, fontWeight: 700, color: '#fff',
          marginBottom: 16, position: 'relative', zIndex: 1,
          letterSpacing: '-0.02em',
        }}>
          汇聚中国 AI 力量
        </h1>
        <p style={{
          fontSize: 22, color: 'rgba(255,255,255,0.75)',
          maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1,
          lineHeight: 1.6,
        }}>
          让生成式人工智能惠及每一位开发者和企业
        </p>
      </div>

      {/* Company Introduction — matches siliconflow "硅基流动" section */}
      <div style={{ display: 'flex', gap: 80, alignItems: 'center', marginBottom: 80 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: '#004A8F', marginBottom: 28, letterSpacing: '-0.02em' }}>
            aiburj
          </h2>
          <div style={{ fontSize: 16, color: '#4A6A8A', lineHeight: 2, textAlign: 'justify' }}>
            <p style={{ marginBottom: 16 }}>
              aiburj 成立于 2025 年，致力于成为领先的国产大模型 API 聚合平台，汇聚中国最优秀的大模型能力，加速 AI 普惠中国。
            </p>
            <p style={{ marginBottom: 16 }}>
              核心产品一站式大模型 API 聚合平台，基于 OpenAI 兼容格式，提供统一的 API 接口。开发者只需一次接入，即可调用 DeepSeek、通义千问、智谱 GLM、月之暗面 Kimi、百川等国内主流大模型，无需关注模型层面的底层技术细节，无需担心多平台切换带来的开发成本，助力开发者和企业聚焦产品创新。
            </p>
            <p>
              目前，aiburj 已聚合 12+ 家国产大模型厂商、50+ 款模型，覆盖对话、代码、图像生成、语音、视频等多个领域，按量计费、零门槛接入，服务互联网、教育、金融、制造等多个行业的开发者和企业客户。
            </p>
          </div>
        </div>
        {/* Illustration placeholder */}
        <div style={{
          flex: '0 0 480px', height: 360,
          background: 'linear-gradient(135deg, #E8F0FE 0%, #D4E2FC 50%, #BFD4F8 100%)',
          borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#004A8F', opacity: 0.15, letterSpacing: 4 }}>
              AIBURJ
            </div>
            <div style={{ fontSize: 14, color: '#0080C0', marginTop: 12, fontWeight: 500 }}>
              国产大模型的灯塔
            </div>
          </div>
        </div>
      </div>

      {/* Development Timeline — matches siliconflow "发展历程" */}
      <div style={{
        background: '#F4F8FC', borderRadius: 20, padding: '64px 48px',
        marginBottom: 80,
      }}>
        <h2 style={{
          fontSize: 40, fontWeight: 700, color: '#002060', textAlign: 'center',
          marginBottom: 56, letterSpacing: '-0.02em',
        }}>
          发展历程
        </h2>
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1, background: '#D5D6EA', transform: 'translateX(-50%)',
          }} />
          {[
            { date: '2026 年 6 月', items: ['aiburj 平台正式上线', '聚合 12 家国产大模型厂商'] },
            { date: '2026 年 5 月', items: ['新增 DeepSeek-V4-Pro 模型', '支持百万 tokens 上下文'] },
            { date: '2026 年 4 月', items: ['新增智谱 GLM-5.1 模型', '支持 Function Calling'] },
            { date: '2026 年 3 月', items: ['平台内测启动', '邀请首批开发者体验'] },
            { date: '2025 年 12 月', items: ['项目立项', '团队组建完成'] },
          ].map((entry, i) => {
            const isLeft = i % 2 === 0
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline',
                marginBottom: 40, position: 'relative', zIndex: 1,
              }}>
                {/* Left column */}
                <div style={{ flex: 1, textAlign: 'right', paddingRight: 32 }}>
                  {isLeft ? (
                    <div>
                      {entry.items.map((item, j) => (
                        <p key={j} style={{
                          fontSize: 16, color: '#4A6A8A', marginBottom: 4,
                        }}>
                          {item}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 22, color: '#004A8F', fontWeight: 600 }}>{entry.date}</div>
                  )}
                </div>
                {/* Center dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  border: '2px solid #004A8F', background: '#fff',
                  flexShrink: 0, position: 'relative', zIndex: 2,
                }} />
                {/* Right column */}
                <div style={{ flex: 1, paddingLeft: 32 }}>
                  {!isLeft ? (
                    <div>
                      {entry.items.map((item, j) => (
                        <p key={j} style={{
                          fontSize: 16, color: '#4A6A8A', marginBottom: 4,
                        }}>
                          {item}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 22, color: '#004A8F', fontWeight: 600 }}>{entry.date}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Certifications & Values */}
      <div style={{ marginBottom: 80 }}>
        <h2 style={{
          fontSize: 40, fontWeight: 700, color: '#002060', textAlign: 'center',
          marginBottom: 48, letterSpacing: '-0.02em',
        }}>
          平台保障
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          {[
            { icon: CheckCircle2, title: 'OpenAI 兼容', desc: '标准 API 格式，零迁移成本' },
            { icon: CheckCircle2, title: '高可用架构', desc: '99.9% 服务可用性保障' },
            { icon: CheckCircle2, title: '数据安全', desc: '传输加密，密钥隔离' },
            { icon: CheckCircle2, title: '按量计费', desc: '用多少付多少，无月费门槛' },
          ].map((item, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, padding: '32px 24px',
              border: '1px solid #E8ECF2', textAlign: 'center',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,74,143,0.08)'
                e.currentTarget.style.borderColor = 'rgba(0,74,143,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = '#E8ECF2'
              }}
            >
              <item.icon size={28} color="#004A8F" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#002060', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: '#4A6A8A', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AboutLayout>
  )
}
