import { createFileRoute } from '@tanstack/react-router'
import { AboutLayout } from '@/features/about/about-layout'

export const Route = createFileRoute('/about/brand')({
  component: AboutBrand,
})

const valuesData = [
  {
    num: '01',
    title: '汇聚力量',
    desc: '正如灯塔汇聚光芒，aiburj 汇聚中国最优秀的大模型。我们不制造模型，我们让每一款优秀模型都能被开发者轻松调用，打破孤岛，连接生态。',
  },
  {
    num: '02',
    title: '开放兼容',
    desc: '坚持 OpenAI 兼容标准，降低开发者迁移成本。无论你之前使用哪个平台，切换到 aiburj 只需修改 base_url，现有代码无需重写。',
  },
  {
    num: '03',
    title: '追求极致',
    desc: '在接入速度、推理延迟、计费透明度上持续优化。我们相信，好的平台应当让开发者感知不到平台的存在，专注于创造。',
  },
  {
    num: '04',
    title: '普惠 AI',
    desc: '零月费、零门槛，让个人开发者和小团队也能用上顶级大模型。降低 AI 应用开发的经济门槛，推动中国 AI 生态的繁荣发展。',
  },
]

function AboutBrand() {
  return (
    <AboutLayout>
      {/* Brand Banner */}
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
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.2) 0%, transparent 60%)',
        }} />
        <h1 style={{
          fontSize: 48, fontWeight: 700, color: '#fff',
          marginBottom: 16, position: 'relative', zIndex: 1,
          letterSpacing: '-0.02em',
        }}>
          aiburj 品牌解读
        </h1>
        <p style={{
          fontSize: 20, color: 'rgba(255,255,255,0.7)',
          maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1,
          lineHeight: 1.6,
        }}>
          AI + Burj（阿拉伯语"塔"）—— 国产大模型的灯塔
        </p>
      </div>

      {/* Name Origin */}
      <div style={{ marginBottom: 80 }}>
        <div style={{
          textAlign: 'center', marginBottom: 40,
          fontSize: 13, fontWeight: 700, color: '#0080C0',
          letterSpacing: 3, textTransform: 'uppercase',
        }}>
          Brand Story
        </div>
        <h2 style={{
          fontSize: 40, fontWeight: 700, color: '#002060', textAlign: 'center',
          marginBottom: 32, letterSpacing: '-0.02em',
        }}>
          名字的由来
        </h2>
        <div style={{
          maxWidth: 700, margin: '0 auto',
          fontSize: 17, color: '#4A6A8A', lineHeight: 2, textAlign: 'center',
        }}>
          <p style={{ marginBottom: 16 }}>
            aiburj 由 <strong style={{ color: '#004A8F' }}>AI</strong> + <strong style={{ color: '#004A8F' }}>Burj</strong> 组成。
          </p>
          <p style={{ marginBottom: 16 }}>
            Burj 是阿拉伯语中"塔"的意思。正如迪拜哈利法塔（Burj Khalifa）以 828 米的高度刺破天际、重塑了人类建筑的极限，aiburj 致力于成为国产 AI 模型的最高灯塔 —— 汇聚中国 AI 之光，照亮智能之路。
          </p>
          <p>
            我们相信，优秀的国产大模型不应隐藏在各个厂商的孤岛中。它们应当像灯塔一样，被看见、被聚合、被每一位开发者轻松调用。
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{
        background: 'linear-gradient(135deg, #F0F4FA 0%, #E8EFF8 100%)',
        borderRadius: 20, padding: '64px 48px', marginBottom: 80,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#0080C0',
          letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16,
        }}>
          Mission & Vision
        </div>
        <h2 style={{
          fontSize: 40, fontWeight: 700, color: '#002060',
          marginBottom: 16, letterSpacing: '-0.02em',
        }}>
          使命与愿景
        </h2>
        <p style={{
          fontSize: 28, fontWeight: 600, color: '#004A8F',
          maxWidth: 700, margin: '0 auto 24px', lineHeight: 1.5,
        }}>
          加速 AI 普惠中国，让世界因汇聚而更强大
        </p>
        <p style={{
          fontSize: 16, color: '#4A6A8A', maxWidth: 600, margin: '0 auto',
          lineHeight: 1.8,
        }}>
          我们的使命是降低中国 AI 应用开发的门槛。让每一家创业公司都能用上大模型，让每一位开发者都能专注于产品创新而非基础设施。我们相信，当 AI 能力真正普惠时，中国的创新力将前所未有地迸发。
        </p>
      </div>

      {/* Values */}
      <div style={{ marginBottom: 60 }}>
        <div style={{
          textAlign: 'center', fontSize: 13, fontWeight: 700,
          color: '#0080C0', letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Our Values
        </div>
        <h2 style={{
          fontSize: 40, fontWeight: 700, color: '#002060', textAlign: 'center',
          marginBottom: 48, letterSpacing: '-0.02em',
        }}>
          我们的价值观
        </h2>
        {valuesData.map((v, i) => (
          <div key={i} style={{
            display: 'flex', gap: 32, alignItems: 'flex-start',
            marginBottom: 40, padding: '32px',
            background: '#fff', borderRadius: 14,
            border: '1px solid #E8ECF2',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,74,143,0.06)'
              e.currentTarget.style.borderColor = 'rgba(0,74,143,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = '#E8ECF2'
            }}
          >
            <div style={{
              fontSize: 48, fontWeight: 900, color: '#004A8F',
              opacity: 0.15, lineHeight: 1, flexShrink: 0,
              minWidth: 80,
            }}>
              {v.num}
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#002060', marginBottom: 8 }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 15, color: '#4A6A8A', lineHeight: 1.9 }}>
                {v.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AboutLayout>
  )
}
