import { Link } from '@tanstack/react-router'
import { useStatus } from '@/hooks/use-status'
import { AuthLayout } from '../auth-layout'
import { TermsFooter } from '../components/terms-footer'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const { status } = useStatus()

  return (
    <AuthLayout>
      <h2 style={{
        fontSize: 24, fontWeight: 700, color: '#0F172A',
        marginBottom: 6, marginTop: 0,
      }}>
        欢迎注册 aiburj
      </h2>
      <p style={{
        fontSize: 14, color: '#64748B', marginBottom: 32, marginTop: 0,
      }}>
        已有账号？<Link to="/sign-in" style={{ color: '#004A8F', fontWeight: 600, marginLeft: 4, textDecoration: 'none' }}>立即登录</Link>
      </p>
      <SignUpForm />
      <TermsFooter variant="sign-up" status={status} style={{
        textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94A3B8',
      }} />
    </AuthLayout>
  )
}
