import { Link } from '@tanstack/react-router'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'

type AuthLayoutProps = { children: React.ReactNode }

export function AuthLayout({ children }: AuthLayoutProps) {
  const { logo, loading } = useSystemConfig()

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Left: Brand Panel — 50% width, full-cover background image */}
      <div style={{
        flex: '1 1 0%', height: '100%',
        position: 'relative', overflow: 'hidden',
        background: '#001a30',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url(/auth-bg.png) center/cover no-repeat',
        }} />
        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,10,30,0.55) 0%, rgba(0,20,50,0.4) 50%, rgba(0,30,70,0.6) 100%)',
        }} />

        {/* Logo */}
        <Link to="/" style={{
          position: 'absolute', left: 56, top: 56, zIndex: 2
        }}>
          {loading ? <Skeleton style={{ width: 220, height: 36, borderRadius: 8 }} /> : (
            <img src={logo} alt="aiburj" style={{
              height: 126, width: 'auto', objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              opacity: 0.95,
            }} />
          )}
        </Link>

        {/* Brand text section */}
        <section style={{
          position: 'absolute', left: 56, top: 210, zIndex: 2,
          color: '#fff',
        }}>
          <p style={{
            fontSize: 16, fontWeight: 500, marginTop: 0, marginBottom: 0,
            opacity: 0.85, letterSpacing: '0.02em',
          }}>
            加速 AI 普惠人类
          </p>
          <div style={{ marginTop: 24, fontSize: 18, opacity: 0.7, lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>基于优秀的国产大模型，提供高性价比的 GenAI 云服务</p>
            <p style={{ margin: '4px 0 0 0' }}>文本对话 · 图像生成 · 视频生成 · 语音合成</p>
          </div>
        </section>

        {/* Bottom promo / CTA area */}
        <section style={{
          position: 'absolute', left: 56, bottom: 120, zIndex: 2,
          color: '#fff', maxWidth: 480,
        }}>
          <p style={{
            fontSize: 20, fontWeight: 600, margin: 0,
            color: '#00C8F0', lineHeight: 1.4,
          }}>
            新人注册即享体验额度
          </p>
          <p style={{
            fontSize: 32, fontWeight: 700, margin: '8px 0 0 0',
            lineHeight: 1.3, letterSpacing: '-0.01em',
          }}>
            即刻接入国产大模型<br/>开启 AI 应用之旅
          </p>
        </section>

        {/* Footer */}
        <footer style={{
          position: 'absolute', left: 56, bottom: 40, zIndex: 2,
          fontSize: 13, color: 'rgba(255,255,255,0.45)',
        }}>
          &copy; {new Date().getFullYear()} aiburj. All rights reserved.
        </footer>
      </div>

      {/* Right: Form Panel — 50% width, centered */}
      <div style={{
        flex: '1 1 0%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#EAF1F1', padding: 40,
      }}>
        <div style={{
          width: '100%', maxWidth: 350,
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
