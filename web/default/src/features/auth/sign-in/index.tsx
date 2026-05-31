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
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#161722', marginBottom: 8 }}>登录</h2>
        <p style={{ fontSize: 14, color: '#57627F' }}>
          还没有账号？
          <Link to="/sign-up" style={{ color: '#6E29F6', fontWeight: 500, marginLeft: 4 }}>立即注册</Link>
        </p>
      </div>
      <UserAuthForm redirectTo={redirect} />
      <TermsFooter variant="sign-in" status={status} className="text-center" />
    </AuthLayout>
  )
}
