import { createFileRoute, redirect } from '@tanstack/react-router'
import { isSidebarModuleEnabled } from '@/lib/nav-modules'
import { Main } from '@/components/layout'

export const Route = createFileRoute('/_authenticated/image-gen/')({
  beforeLoad: () => {
    if (!isSidebarModuleEnabled('experience', 'image')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: ImageGenPage,
})

function ImageGenPage() {
  return (
    <Main className='p-0'>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: '16px',
        color: '#64748b'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b' }}>🖼️ 图像生成</h2>
        <p>AI 图像生成功能开发中…</p>
      </div>
    </Main>
  )
}
