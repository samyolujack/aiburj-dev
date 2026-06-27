import { Fragment } from 'react'
import { X, Info, Zap, Layers, Tag } from 'lucide-react'
import type { PricingModel } from '@/features/pricing/types'
import { getLobeIcon } from '@/lib/lobe-icon'
import { resolveModelIdentity } from '@/lib/model-identity'
import { parseTags } from '@/features/pricing/lib/filters'

interface ModelDetailSheetProps {
  model: PricingModel | null
  onClose: () => void
  tokenUnit?: string
  priceRate?: number
  usdExchangeRate?: number
}

export function ModelDetailSheet({ model, onClose, tokenUnit = 'M', priceRate = 1, usdExchangeRate = 7.2 }: ModelDetailSheetProps) {
  if (!model) return null

  const identity = resolveModelIdentity(model.model_name || '')
  const tags = parseTags(model.tags || '')
  const unitSymbol = tokenUnit === 'M' ? '/1M tokens' : '/1K tokens'
  const inputPrice = model.model_ratio
    ? (model.model_ratio / (tokenUnit === 'M' ? 1 : 1000)) * priceRate * usdExchangeRate
    : 0
  const outputPrice = model.completion_ratio
    ? (model.completion_ratio / (tokenUnit === 'M' ? 1 : 1000)) * priceRate * usdExchangeRate
    : 0

  return (
    <div className='fixed inset-0 z-50 flex justify-end'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/20' onClick={onClose} />
      {/* Sheet */}
      <div className='relative w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in-right'>
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-white'>
          <div className='flex items-center gap-2'>
            <Info className='w-5 h-5 text-[#004A8F]' />
            <h3 className='text-[16px] font-semibold text-[#1E293B]'>模型详情</h3>
          </div>
          <button onClick={onClose} className='p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#64748B]'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='px-6 py-6 space-y-5'>
          {/* Model identity */}
          <div className='flex items-center gap-3'>
            {identity?.vendor && getLobeIcon(identity.vendor, 40)}
            <div>
              <h4 className='text-[18px] font-bold text-[#1E293B]'>{identity?.short || model.model_name}</h4>
              <p className='text-[13px] text-[#94A3B8]'>{identity?.vendor || model.vendor_name || ''}</p>
            </div>
          </div>

          <div className='h-px bg-[#E2E8F0]' />

          {/* Model type & tags */}
          <div className='space-y-3'>
            <div className='flex items-center gap-1.5 text-[13px] text-[#64748B]'>
              <Layers className='w-3.5 h-3.5' />
              <span className='font-medium'>模型类型</span>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {model.model_type ? (
                <span className='inline-flex items-center rounded border border-[#91CAFF] bg-[#E6F4FF] px-2 py-0.5 text-[12px] text-[#0958D9]'>
                  {model.model_type}
                </span>
              ) : (
                <span className='text-[13px] text-[#94A3B8]'>未设置</span>
              )}
            </div>

            <div className='flex items-center gap-1.5 text-[13px] text-[#64748B]'>
              <Tag className='w-3.5 h-3.5' />
              <span className='font-medium'>应用场景</span>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {tags.length > 0 ? tags.map(tag => (
                <span key={tag} className='inline-flex items-center rounded border border-[#D3ADF7] bg-[#F9F0FF] px-2 py-0.5 text-[12px] text-[#531DAB]'>
                  {tag}
                </span>
              )) : (
                <span className='text-[13px] text-[#94A3B8]'>未设置</span>
              )}
            </div>
          </div>

          <div className='h-px bg-[#E2E8F0]' />

          {/* Pricing */}
          <div className='space-y-3'>
            <div className='flex items-center gap-1.5 text-[13px] text-[#64748B]'>
              <Zap className='w-3.5 h-3.5' />
              <span className='font-medium'>定价信息</span>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='bg-[#F8FAFC] rounded-lg p-3'>
                <p className='text-[11px] text-[#94A3B8] mb-0.5'>输入价格</p>
                <p className='text-[15px] font-bold text-[#1E293B]'>¥{inputPrice.toFixed(2)}</p>
                <p className='text-[11px] text-[#94A3B8]'>{unitSymbol}</p>
              </div>
              <div className='bg-[#F8FAFC] rounded-lg p-3'>
                <p className='text-[11px] text-[#94A3B8] mb-0.5'>输出价格</p>
                <p className='text-[15px] font-bold text-[#1E293B]'>¥{outputPrice.toFixed(2)}</p>
                <p className='text-[11px] text-[#94A3B8]'>{unitSymbol}</p>
              </div>
            </div>
          </div>

          <div className='h-px bg-[#E2E8F0]' />

          {/* Full model name */}
          <div className='space-y-1'>
            <p className='text-[11px] text-[#94A3B8] font-medium'>完整模型名</p>
            <p className='text-[13px] text-[#475569] font-mono break-all'>{model.model_name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
