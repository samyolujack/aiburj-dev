import { Link, useSearch } from '@tanstack/react-router'
import { useStatus } from '@/hooks/use-status'
import { AuthLayout } from '../auth-layout'
import { TermsFooter } from '../components/terms-footer'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { status } = useStatus()

  return (
    <AuthLayout>
      <h2 style={{
        fontSize: 24, fontWeight: 700, color: '#0F172A',
        marginBottom: 6, marginTop: 0,
      }}>
        欢迎登录 aiburj
      </h2>
      <p style={{
        fontSize: 14, color: '#64748B', marginBottom: 32, marginTop: 0,
      }}>
        还没有账号？<Link to="/sign-up" style={{ color: '#004A8F', fontWeight: 600, marginLeft: 4, textDecoration: 'none' }}>立即注册</Link>
      </p>
      <UserAuthForm redirectTo={redirect} />
      <TermsFooter variant="sign-in" status={status} style={{
        textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94A3B8',
      }} />
    </AuthLayout>
  )
}
