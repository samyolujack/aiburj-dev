import { createFileRoute, redirect } from '@tanstack/react-router'
import { isSidebarModuleEnabled } from '@/lib/nav-modules'
import { Main } from '@/components/layout'

export const Route = createFileRoute('/_authenticated/tts/')({
  beforeLoad: () => {
    if (!isSidebarModuleEnabled('experience', 'tts')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: TTSPage,
})

function TTSPage() {
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
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1e293b' }}>🎙️ 语音合成</h2>
        <p>TTS 语音合成功能开发中…</p>
      </div>
    </Main>
  )
}
