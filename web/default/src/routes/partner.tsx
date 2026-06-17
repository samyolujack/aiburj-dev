import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck, Briefcase, TrendingUp, Award, Heart } from 'lucide-react'
import { PublicLayout } from '@/components/layout'

const BRAND = { primary: '#004A8F', deep: '#002060', accent: '#0080C0', muted: '#4A6A8A', light: '#F0F4FA', border: '#E8ECF2' }

/* ── 合作模式自定义 SVG 图标 ── */
const IconWrite = ({ color = '#0080C0' }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="8" y="12" width="36" height="44" rx="4" fill={color} opacity="0.85"/>
    <rect x="12" y="18" width="10" height="2" rx="1" fill="#fff" opacity="0.6"/>
    <rect x="12" y="24" width="18" height="2" rx="1" fill="#fff" opacity="0.6"/>
    <rect x="12" y="30" width="14" height="2" rx="1" fill="#fff" opacity="0.6"/>
    <circle cx="48" cy="36" r="12" fill={color} opacity="0.2"/>
    <path d="M46 30l5 6-5 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M50 30l-5 6 5 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
)
const IconCode = ({ color = '#10b981' }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="10" y="14" width="44" height="36" rx="6" fill={color} opacity="0.85"/>
    <circle cx="24" cy="32" r="8" fill="#fff" opacity="0.3"/>
    <path d="M22 28l-3 4 3 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 28l3 4-3 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="44" cy="46" r="5" fill={color} opacity="0.35"/>
    <path d="M41 48l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconBroadcast = ({ color = '#f59e0b' }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="26" y="24" width="12" height="16" rx="3" fill={color} opacity="0.9"/>
    <rect x="22" y="20" width="20" height="4" rx="2" fill={color} opacity="0.7"/>
    <circle cx="32" cy="12" r="6" fill={color} opacity="0.15"/>
    <circle cx="32" cy="12" r="3" fill={color} opacity="0.6"/>
    <path d="M18 16c-4 4-4 10 0 14" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <path d="M46 16c4 4 4 10 0 14" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
)
const IconIntegration = ({ color = '#8b5cf6' }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="8" y="8" width="20" height="20" rx="5" fill={color} opacity="0.85"/>
    <circle cx="18" cy="18" r="4" fill="#fff" opacity="0.4"/>
    <rect x="36" y="36" width="20" height="20" rx="5" fill={color} opacity="0.7"/>
    <circle cx="46" cy="46" r="4" fill="#fff" opacity="0.3"/>
    <path d="M24 22L36 42" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="28" cy="30" r="3" fill={color} opacity="0.5"/>
  </svg>
)
const IconUpload = ({ color = '#ec4899' }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect x="12" y="30" width="40" height="24" rx="5" fill={color} opacity="0.75"/>
    <path d="M32 14v24" stroke={color} strokeWidth="4" strokeLinecap="round"/>
    <path d="M24 22l8-8 8 8" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 42l6-6 4 4 6-6 8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
  </svg>
)
const IconAcademic = ({ color = '#6366f1' }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path d="M32 6L8 18v4c0 18 10 28 24 32 14-4 24-14 24-32v-4L32 6z" fill={color} opacity="0.85"/>
    <path d="M20 30l12 8 12-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="26" y="36" width="12" height="4" rx="2" fill="#fff" opacity="0.4"/>
    <circle cx="32" cy="50" r="3" fill="#fff" opacity="0.3"/>
  </svg>
)

const modes = [
  { Icon: () => <IconWrite />, title: '使用心得征集', desc: '撰写 aiburj 平台的使用体验、最佳实践、模型评测等技术文章，通过社交媒体或技术博客分享。优质内容将被收录至官方文档，并获得官方社媒推广。', cta: '提交文章', color: '#0080C0' },
  { Icon: () => <IconCode />, title: '重点项目 PR 贡献', desc: '参与 aiburj 开源项目的代码贡献，修复 bug、添加新功能、完善文档。项目维护者会 review 你的 PR，合并后将署名并在贡献者列表中展示。', cta: 'GitHub 项目', color: '#10b981' },
  { Icon: () => <IconBroadcast />, title: '内容传播与教学', desc: '制作视频教程、直播分享、线下 Meetup 等活动，帮助更多开发者了解和使用 aiburj。官方将提供技术支持和宣传资源配合。', cta: '申请合作', color: '#f59e0b' },
  { Icon: () => <IconIntegration />, title: '产品深度接入', desc: '将 aiburj API 集成到你的产品中，为用户提供 AI 能力。达到一定调用量后可获得专属折扣和技术支持，深度合作产品将获官方推荐位。', cta: '技术对接', color: '#8b5cf6' },
  { Icon: () => <IconUpload />, title: '高效上架与分发', desc: '模型厂商可通过标准化接口快速上架新模型，aiburj 提供统一的计费、监控和分发能力。让你的模型被数万名开发者即时发现和调用。', cta: '厂商入驻', color: '#ec4899' },
  { Icon: () => <IconAcademic />, title: '学术与公益赋能', desc: '高校、研究机构和公益组织可申请学术支持计划，获得免费或大幅折扣的 API 额度。我们持续支持 AI 教育和公益事业。', cta: '申请支持', color: '#6366f1' },
]

const benefits = [
  { icon: ShieldCheck, title: '灵活且丰富的模型能力赋能', desc: '接入国内 12+ 主流大模型厂商，覆盖语言、视觉、语音全模态。统一 API 格式，一键切换模型无需更改代码。' },
  { icon: Briefcase, title: '全方位技术协作与算力扶持', desc: '优质合作伙伴可获得专属技术支持通道、优先体验新模型、算力补贴等多重扶持。' },
  { icon: TrendingUp, title: '深度联合推广与流量加持', desc: '官方社交媒体矩阵（公众号、知乎、B站、小红书）联合推广，精准触达数十万 AI 开发者群体。' },
  { icon: Award, title: '官方认证与生态深度共建', desc: '认证合作伙伴将获得官方徽章展示、联合品牌露出、优先参与行业峰会和闭门交流会。' },
]

const partners = ['DeepSeek', 'Qwen', '字节豆包', '智谱AI', '月之暗面', '百度文心', '腾讯混元', 'MiniMax', '阶跃星辰', '零一万物', '百川智能', '智源研究院', 'StabilityAI', 'Meta']

function PartnerPage() {
  return (
    <PublicLayout showMainContainer={false}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* ======== Hero ======== */}
        <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '280px 24px 280px', textAlign: 'center', marginBottom: 0, position: 'relative', overflow: 'hidden', background: '#001840', maskImage: 'linear-gradient(to bottom, black 0%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 92%, transparent 100%)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/partner-hero-bg.png')`, backgroundSize: 'cover', backgroundPosition: '50% 25%', opacity: 0.4 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,128,192,0.15) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(to bottom, transparent, #F0F4FA)', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
              PARTNERSHIP
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: '-0.02em' }}>
              aiburj 生态共建计划
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 640, margin: '0 auto 36px', lineHeight: 1.8 }}>
              依托开放稳定高效的大模型 API 能力，链接模型厂商与创新应用，与全球伙伴共建开放、共赢的 AI 生态价值共同体。
            </p>
            <a href="mailto:partner@aiburj.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 16,
              background: '#fff', color: BRAND.primary, textDecoration: 'none',
            }}>
              立即加入 <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* ======== 合作模式 ======== */}
        <div style={{ padding: '80px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
              PARTNERSHIP
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: BRAND.deep, marginBottom: 16, letterSpacing: '-0.02em' }}>
              灵活多样的合作模式
            </h2>
            <p style={{ fontSize: 16, color: BRAND.muted, maxWidth: 560, margin: '0 auto' }}>
              面向不同类型的伙伴，提供多种合作路径。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {modes.map((m, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`,
                padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 16,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,74,143,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(0,74,143,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = BRAND.border
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <m.Icon />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.deep, margin: 0 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.8, margin: 0, flex: 1 }}>{m.desc}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: m.color, cursor: 'pointer' }}>
                  {m.cta} <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======== 伙伴权益 ======== */}
      <div style={{ borderRadius: 0, margin: '0 calc(-50vw + 50%)', padding: '80px 0', background: BRAND.light, borderTop: `1px solid ${BRAND.border}`, borderBottom: `1px solid ${BRAND.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
              BENEFITS
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: BRAND.deep, marginBottom: 16, letterSpacing: '-0.02em' }}>
              伙伴权益
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.border}`,
                padding: '32px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,74,143,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <b.icon size={26} style={{ color: '#fff' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: BRAND.deep, margin: 0 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.8, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* ======== 生态伙伴案例 ======== */}
        <div style={{ padding: '80px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
              ECOSYSTEM
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: BRAND.deep, marginBottom: 16, letterSpacing: '-0.02em' }}>
              生态伙伴案例
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {partners.map((p, i) => (
              <div key={i} style={{
                padding: '16px 24px', borderRadius: 10,
                background: '#F7F9FC', border: `1px solid ${BRAND.border}`,
                fontSize: 15, fontWeight: 600, color: BRAND.muted,
                transition: 'all 0.25s', cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${BRAND.primary}0d`; e.currentTarget.style.borderColor = `${BRAND.primary}30`; e.currentTarget.style.color = BRAND.primary }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F7F9FC'; e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.color = BRAND.muted }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======== 加入CTA ======== */}
      <div style={{
        borderRadius: 0, margin: '0 calc(-50vw + 50%)',
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.deep} 100%)`,
        padding: '80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(0,128,192,0.2) 0%, transparent 50%)',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
            加入 aiburj 生态共建计划
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.8 }}>
            无论你是模型厂商、开发者、内容创作者还是企业客户，aiburj 生态都欢迎你。
          </p>
          <a href="mailto:partner@aiburj.com" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 40px', borderRadius: 10, fontWeight: 700, fontSize: 16,
            background: '#fff', color: BRAND.primary, textDecoration: 'none',
          }}>
            <Heart size={18} /> 提交合作申请 <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}

export const Route = createFileRoute('/partner')({
  component: PartnerPage,
})
