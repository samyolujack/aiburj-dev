import { AlertTriangle } from 'lucide-react'

interface CostNoticeProps {
  modelName?: string
  onDetailClick?: () => void
}

export function CostNotice({ modelName, onDetailClick }: CostNoticeProps) {
  return (
    <div className='flex items-start gap-2.5 px-4 py-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-800'>
      <AlertTriangle className='w-4 h-4 mt-0.5 shrink-0 text-amber-500' />
      <span>
        在线体验将按照用量产生费用，详见{' '}
        <button
          onClick={onDetailClick}
          className='font-medium text-amber-900 underline hover:text-amber-950 cursor-pointer'
        >
          模型详情
        </button>
        {modelName && (
          <span className='text-amber-600 ml-1'>（{modelName}）</span>
        )}
      </span>
    </div>
  )
}
