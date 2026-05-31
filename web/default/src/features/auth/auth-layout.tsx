import { Link } from '@tanstack/react-router'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'

type AuthLayoutProps = { children: React.ReactNode }

export function AuthLayout({ children }: AuthLayoutProps) {
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: '#F5F6FA',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Left: Brand Panel */}
      <div style={{
        flex: '0 0 480px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 64px',
        background: 'linear-gradient(160deg, #6E29F6 0%, #8B5CF6 50%, #A78BFA 100%)',
        position: 'relative', overflow: 'hidden', color: '#fff'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, textDecoration: 'none' }}>
            {loading ? <Skeleton className="h-10 w-10 rounded-xl" /> : (
              <img src={logo} alt="aiburj" style={{ width: 40, height: 40, borderRadius: 10 }} />
            )}
            {loading ? <Skeleton className="h-7 w-20" /> : (
              <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{systemName || 'aiburj'}</span>
            )}
          </Link>

          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            一站式<br/>国产大模型 API 平台
          </h1>
          <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.7, maxWidth: 340 }}>
            OpenAI 兼容格式，统一接入 DeepSeek、通义千问、GLM 等国内主流大模型，按量计费，即刻开始。
          </p>
        </div>
      </div>

      {/* Right: Form Card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40
      }}>
        <div style={{
          width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20,
          padding: '48px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid #E5E7EB'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
