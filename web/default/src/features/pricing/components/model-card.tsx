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
import { ChevronRight, Copy,Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import { resolveModelIdentity } from '@/lib/model-identity'
import { cn } from '@/lib/utils'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { StatusBadge } from '@/components/status-badge'
import { DEFAULT_TOKEN_UNIT } from '../constants'
import {
  getDynamicDisplayGroupRatio,
  getDynamicPricingSummary,
} from '../lib/dynamic-price'
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
  const priceRate = props.priceRate ?? 1
  const usdExchangeRate = props.usdExchangeRate ?? 1
  const showRechargePrice = props.showRechargePrice ?? false
  const isTokenBased = isTokenBasedModel(props.model)
  const tokenUnitLabel = tokenUnit === 'K' ? '1K' : '1M'
  const tags = parseTags(props.model.tags)
  const endpoints = props.model.supported_endpoint_types || []

  const identity = resolveModelIdentity(props.model.model_name || '')
  const vendorIcon = props.model.vendor_icon
    ? getLobeIcon(props.model.vendor_icon, 24)
    : identity
      ? getLobeIcon(identity.icon, 24)
      : null
  const vendorName = props.model.vendor_name || identity?.vendor || ''
  const displayName = (props.model.model_name || '').includes('/')
    ? props.model.model_name!.split('/').pop()!
    : props.model.model_name || ''
  const initial = displayName.charAt(0).toUpperCase() || '?'

  const isDynamicPricing =
    props.model.billing_mode === 'tiered_expr' &&
    Boolean(props.model.billing_expr)
  const hasCachedPrice = isTokenBased && props.model.cache_ratio != null

  const primaryType = endpoints[0] || 'chat'

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyToClipboard(props.model.model_name || '')
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border bg-card p-4 transition-all duration-300',
        'hover:border-[#004A8F20] hover:shadow-[0_8px_30px_rgba(0,74,143,0.08)]',
      )}
      style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Top accent bar */}
      <div className='absolute top-0 left-4 right-4 h-[3px] rounded-b-sm opacity-60'
        style={{ background: 'linear-gradient(90deg, #004A8F, #0080C0, #00A0E0)' }} />

      {/* Header row: icon + name + actions */}
      <div className='flex items-start justify-between gap-3 mt-1'>
        <div className='flex items-start gap-3 min-w-0'>
          {/* Vendor icon */}
          <div className='bg-gradient-to-br from-[#F0F5FC] to-[#E8F0FA] dark:from-[#1A2740] dark:to-[#142036] flex size-9 shrink-0 items-center justify-center rounded-lg'>
            {vendorIcon || (
              <span className='text-muted-foreground text-sm font-bold'>{initial}</span>
            )}
          </div>

          <div className='min-w-0'>
            {/* Vendor + type row */}
            <div className='flex items-center gap-2 mb-0.5'>
              {vendorName && (
                <span className='text-muted-foreground/60 text-[11px] font-medium truncate'>
                  {vendorName}
                </span>
              )}
              {primaryType && (
                <span className='text-muted-foreground/40 text-[10px] font-medium px-1.5 py-0.5 rounded border border-border/50 bg-muted/30'>
                  {primaryType}
                </span>
              )}
            </div>

            {/* Model name */}
            <h3 className='text-foreground truncate text-sm font-bold leading-tight'>
              {displayName}
            </h3>
          </div>
        </div>

        {/* Actions */}
        <div className='flex shrink-0 items-center gap-1'>
          <button
            type='button'
            onClick={props.onClick}
            className='text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors'
          >
            {t('详情')}
            <ChevronRight className='size-3' />
          </button>
          <button
            type='button'
            onClick={handleCopy}
            className='text-muted-foreground hover:text-foreground hover:bg-muted rounded-md border p-1.5 transition-colors'
            title={t('复制')}
          >
            <Copy className='size-3' />
          </button>
        </div>
      </div>

      {/* Price row — clear horizontal split */}
      <div className='mt-3 pt-3 border-t border-border/40'>
        {isTokenBased ? (
          <div className='flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1.5'>
              <span className='text-muted-foreground/70'>{t('输入')}</span>
              <span className='text-foreground font-mono font-semibold'>
                {formatPrice(props.model, 'input', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}
              </span>
              <span className='text-muted-foreground/40 text-[10px]'>/{tokenUnitLabel}</span>
            </div>
            <div className='w-px h-3 bg-border/50' />
            <div className='flex items-center gap-1.5'>
              <span className='text-muted-foreground/70'>{t('输出')}</span>
              <span className='text-foreground font-mono font-semibold'>
                {formatPrice(props.model, 'output', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}
              </span>
              <span className='text-muted-foreground/40 text-[10px]'>/{tokenUnitLabel}</span>
            </div>
            {hasCachedPrice && (
              <>
                <div className='w-px h-3 bg-border/50' />
                <div className='flex items-center gap-1.5'>
                  <Zap className='size-3 text-amber-500' />
                  <span className='text-muted-foreground/70'>{t('缓存')}</span>
                  <span className='text-foreground font-mono font-semibold'>
                    {formatPrice(props.model, 'cache', tokenUnit, showRechargePrice, priceRate, usdExchangeRate)}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className='flex items-center gap-1.5 text-xs'>
            <span className='text-muted-foreground/70'>{t('按请求')}</span>
            <span className='text-foreground font-mono font-semibold'>
              {formatRequestPrice(props.model, showRechargePrice, priceRate, usdExchangeRate)}
            </span>
          </div>
        )}
      </div>

      {/* Tags row */}
      {tags.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-1'>
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className='text-muted-foreground/50 text-[10px] bg-muted/30 px-1.5 py-0.5 rounded'>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Performance badge */}
      <ModelPerfBadge perf={props.perf} className='mt-2 self-start' />
    </div>
  )
})
