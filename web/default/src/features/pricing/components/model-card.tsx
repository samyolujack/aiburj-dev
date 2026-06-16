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
import { memo } from 'react'
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
  const endpoints = props.model.supported_endpoint_types || []

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
      el.style.boxShadow = '0 8px 30px rgba(124,58,237,0.08), 0 0 0 1px rgba(99,102,241,0.12)'
    }
    const onLeave = () => {
      el.style.transform = 'translateY(0)'
      el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
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
        'group relative flex flex-col rounded-xl border bg-card p-4 cursor-pointer',
        'transition-all duration-300',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      )}
      style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Top accent bar — purple gradient */}
      <div className='absolute top-0 left-3 right-3 h-[3px] rounded-b-sm opacity-60'
        style={{ background: 'linear-gradient(90deg, #7C3AED, #6366F1, #3B82F6)' }} />

      {/* Row 1: Icon + vendor & type + model name */}
      <div className='flex items-center gap-3 mt-1.5'>
        <div className='bg-gradient-to-br from-[#F5F0FF] to-[#EDE9FE] dark:from-[#1E1740] dark:to-[#181430] flex size-8 shrink-0 items-center justify-center rounded-lg'>
          {vendorIcon || <span className='text-muted-foreground text-xs font-bold'>{initial}</span>}
        </div>
        <div className='min-w-0 flex-1'>
          {vendorName && (
            <span className='text-muted-foreground/55 text-[10px] font-medium block truncate'>{vendorName}</span>
          )}
          <h3 className='text-foreground truncate text-[13px] font-bold leading-tight'>{displayName}</h3>
        </div>
        <button
          type='button'
          onClick={handleCopy}
          className='text-muted-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100 rounded-md p-1 transition-all'
          title={t('复制')}
        >
          <Copy className='size-3' />
        </button>
      </div>

      {/* Row 2: Price — compact */}
      <div className='mt-2.5 pt-2.5 border-t border-border/30 flex items-center gap-3 text-xs'>
        {isTokenBased ? (
          <>
            <span className='text-muted-foreground/60 text-[10px]'>{t('输入')}</span>
            <span className='text-foreground font-mono font-semibold'>
              {formatPrice(props.model, 'input', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}
            </span>
            <span className='text-muted-foreground/30 text-[10px]'>/</span>
            <span className='text-muted-foreground/60 text-[10px]'>{t('输出')}</span>
            <span className='text-foreground font-mono font-semibold'>
              {formatPrice(props.model, 'output', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}
            </span>
            {hasCachedPrice && (
              <>
                <span className='text-muted-foreground/30 text-[10px]'>|</span>
                <Zap className='size-3 text-amber-500' />
                <span className='text-muted-foreground/60 text-[10px]'>{t('缓存')}</span>
                <span className='text-foreground font-mono font-semibold'>
                  {formatPrice(props.model, 'cache', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <span className='text-muted-foreground/60 text-[10px]'>{t('按请求')}</span>
            <span className='text-foreground font-mono font-semibold'>
              {formatRequestPrice(props.model, showRechargePrice, priceRate, usdExchangeRate)}
            </span>
          </>
        )}
        <span className='text-muted-foreground/60 ml-auto text-[10px] flex items-center gap-0.5 group-hover:text-[#6366F1] transition-colors'>
          {t('详情')}<ChevronRight className='size-3' />
        </span>
      </div>
    </div>
  )
})
