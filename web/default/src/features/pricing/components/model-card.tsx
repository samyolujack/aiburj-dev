/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { memo, useMemo } from 'react'
import { ChevronRight,Copy, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import { resolveModelIdentity } from '@/lib/model-identity'
import { cn } from '@/lib/utils'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { DEFAULT_TOKEN_UNIT } from '../constants'
import { parseTags } from '../lib/filters'
import { isTokenBasedModel } from '../lib/model-helpers'
import { formatPrice, formatRequestPrice } from '../lib/price'
import type { PricingModel, TokenUnit } from '../types'
import { ModelPerfBadge, type ModelPerfBadgeData } from './model-perf-badge'

// ── Fallback: detect model type from name if backend field is empty ───────
const MODEL_TYPE_MAP: Record<string, string> = {
  kolors: '生图', image: '生图', video: '视频', wan: '视频', cogvideo: '视频',
  cosyvoice: '语音', speech: '语音', audio: '语音', voice: '语音', tts: '语音',
  vl: '对话', vision: '对话', embed: '嵌入', rerank: '重排序',
}

function detectModelType(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, label] of Object.entries(MODEL_TYPE_MAP)) {
    if (lower.includes(key)) return label
  }
  return ''
}

export interface ModelCardProps {
  model: PricingModel
  onClick: () => void
  priceRate?: number
  usdExchangeRate?: number
  tokenUnit?: TokenUnit
  showRechargePrice?: boolean
  perf?: ModelPerfBadgeData
}

export const ModelCard = memo(function ModelCard(props: ModelCardProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const tokenUnit = props.tokenUnit ?? DEFAULT_TOKEN_UNIT
  const tokenUnitLabel = tokenUnit === 'K' ? '1K' : '1M'
  const priceRate = props.priceRate ?? 1
  const usdExchangeRate = props.usdExchangeRate ?? 1
  const showRechargePrice = props.showRechargePrice ?? false
  const isTokenBased = isTokenBasedModel(props.model)
  const tags = parseTags(props.model.tags)
  const modelTypeVal = props.model.model_type || detectModelType(props.model.model_name || '') || '对话'

  const identity = resolveModelIdentity(props.model.model_name || '')
  const vendorIcon = props.model.vendor_icon
    ? getLobeIcon(props.model.vendor_icon, 28)
    : identity
      ? getLobeIcon(identity.icon, 28)
      : null
  const vendorName = props.model.vendor_name || identity?.vendor || ''
  const displayName = (props.model.model_name || '').includes('/')
    ? props.model.model_name!.split('/').pop()!
    : props.model.model_name || ''
  const initial = displayName.charAt(0).toUpperCase() || '?'

  const hasCachedPrice = isTokenBased && props.model.cache_ratio != null

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyToClipboard(props.model.model_name || '')
  }


  const cardRef = (el: HTMLDivElement | null) => {
    if (!el) return
    const onEnter = () => {
      el.style.transform = 'translateY(-2px)'
      el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
      el.style.borderColor = '#CBD5E1'
    }
    const onLeave = () => {
      el.style.transform = 'translateY(0)'
      el.style.boxShadow = 'none'
      el.style.borderColor = '#E2E8F0'
    }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave) }
  }

  return (
    <div
      ref={cardRef}
      onClick={props.onClick}
      className={cn(
        'group relative flex flex-col rounded-lg border border-[#E2E8F0] bg-[#EBF2FF] p-6 cursor-pointer',
        'transition-all duration-200',
      )}
      style={{ transition: 'all 0.2s ease' }}
    >
      {/* Row 1: Logo + vendor name | Type tag */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          {vendorIcon ? (
            <div className='shrink-0'>{vendorIcon}</div>
          ) : (
            <span className='text-[#64748B] text-xs font-bold'>{initial}</span>
          )}
          <span className='text-[14px] text-[#94A3B8] truncate max-w-[120px]'>{vendorName}</span>
        </div>
        <span className='inline-flex items-center rounded border border-[#91CAFF] bg-[#E6F4FF] px-1.5 py-0 text-[12px] text-[#0958D9] shrink-0'>
          {modelTypeVal}
        </span>
      </div>

      {/* Row 2: Model name + full id */}
      <div className='mb-4'>
        <h3 className='text-[16px] font-semibold text-[#1E293B] truncate mb-1'>{displayName}</h3>
        <p className='text-[12px] text-[#94A3B8] truncate'>{props.model.model_name}</p>
      </div>

      {/* Row 3: Scene tags */}
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mb-4'>
          {tags.map(tag => (
            <span
              key={tag}
              className='inline-flex items-center rounded border border-[#D3ADF7] bg-[#F9F0FF] px-1.5 py-0 text-[12px] font-medium text-[#531DAB]'
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Row 4: Price — with copy button on the right */}
      <div className='flex items-center gap-3 pt-3 border-t border-[#F1F5F9] text-[12px]'>
        {isTokenBased ? (
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <span className='text-[#531DAB] shrink-0'>
              {t('输入')}: <span className='font-medium'>{formatPrice(props.model, 'input', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}</span>
            </span>
            <span className='text-[#531DAB] shrink-0'>
              {t('输出')}: <span className='font-medium'>{formatPrice(props.model, 'output', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}</span>
            </span>
            {hasCachedPrice && (
              <>
                <span className='text-[#531DAB] shrink-0 flex items-center gap-0.5'>
                  <Zap className='size-3' />
                  {t('缓存')}: <span className='font-medium'>{formatPrice(props.model, 'cache', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}</span>
                </span>
              </>
            )}
            <span className='text-[#94A3B8] shrink-0 ml-auto flex items-center gap-0.5 group-hover:text-[#6366F1] transition-colors'>
              {t('详情')}<ChevronRight className='size-3' />
            </span>
          </div>
        ) : (
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <span className='text-[#531DAB] shrink-0'>
              {t('按请求')}: <span className='font-medium'>{formatRequestPrice(props.model, showRechargePrice, priceRate, usdExchangeRate)}</span>
            </span>
            <span className='text-[#94A3B8] shrink-0 ml-auto flex items-center gap-0.5 group-hover:text-[#6366F1] transition-colors'>
              {t('详情')}<ChevronRight className='size-3' />
            </span>
          </div>
        )}
        <button
          type='button'
          onClick={handleCopy}
          className='text-[#94A3B8]/40 hover:text-[#64748B] opacity-0 group-hover:opacity-100 rounded p-0.5 transition-all shrink-0'
          title={t('复制')}
        >
          <Copy className='size-3' />
        </button>
      </div>
    </div>
  )
})
