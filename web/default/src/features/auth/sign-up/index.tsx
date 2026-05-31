import { Link } from '@tanstack/react-router'
import { useStatus } from '@/hooks/use-status'
import { AuthLayout } from '../auth-layout'
import { TermsFooter } from '../components/terms-footer'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const { status } = useStatus()

  return (
    <AuthLayout>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#161722', marginBottom: 8 }}>注册</h2>
        <p style={{ fontSize: 14, color: '#57627F' }}>
          已有账号？
          <Link to="/sign-in" style={{ color: '#6E29F6', fontWeight: 500, marginLeft: 4 }}>立即登录</Link>
        </p>
      </div>
      <SignUpForm />
      <TermsFooter variant="sign-up" status={status} className="text-center" />
    </AuthLayout>
  )
}
