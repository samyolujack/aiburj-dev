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
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PanelLeftClose,PanelLeftOpen } from 'lucide-react'
import { PublicLayout } from '@/components/layout'
import { PageTransition } from '@/components/page-transition'
import {
  LoadingSkeleton,
  EmptyState,
  SearchBar,
  PricingTable,
  PricingSidebar,
  PricingToolbar,
  ModelCardGrid,
  ModelDetailsDrawer,
} from './components'
import { EXCLUDED_GROUPS,VIEW_MODES } from './constants'
import { resolveModelIdentity } from '@/lib/model-identity'
import { useFilters } from './hooks/use-filters'
import { usePricingData } from './hooks/use-pricing-data'

const HOT_MODELS = ['deepseek-v4-pro','qwen3-235b-a22b','glm-5.1','Kwai-Kolors/Kolors','cogview-4','Qwen/Qwen-Image']

export function Pricing() {
  const { t } = useTranslation()
  const [selectedModelName, setSelectedModelName] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    models,
    vendors,
    groupRatio,
    usableGroup,
    endpointMap,
    autoGroups,
    isLoading,
    priceRate,
    usdExchangeRate,
  } = usePricingData()

  const {
    searchInput,
    sortBy,
    vendorFilter,
    groupFilter,
    quotaTypeFilter,
    endpointTypeFilter,
    tagFilter,
    tokenUnit,
    viewMode,
    showRechargePrice,
    setSearchInput,
    setSortBy,
    setVendorFilter,
    setGroupFilter,
    setQuotaTypeFilter,
    setEndpointTypeFilter,
    setTagFilter,
    setTokenUnit,
    setViewMode,
    setShowRechargePrice,
    filteredModels,
    hasActiveFilters,
    activeFilterCount,
    availableTags,
    clearFilters,
    clearSearch,
  } = useFilters(models || [])

  const handleModelClick = useCallback((modelName: string) => {
    setSelectedModelName(modelName)
  }, [])

  const selectedModel = useMemo(
    () =>
      selectedModelName
        ? (models || []).find(
            (model) => model.model_name === selectedModelName
          ) || null
        : null,
    [models, selectedModelName]
  )

  const availableGroups = useMemo(
    () =>
      Object.keys(usableGroup || {}).filter(
        (g) => !EXCLUDED_GROUPS.includes(g)
      ),
    [usableGroup]
  )

  const handleClearAll = useCallback(() => {
    clearFilters()
    clearSearch()
  }, [clearFilters, clearSearch])

  const handleHotModelClick = useCallback((modelName: string) => {
    setSearchInput(modelName)
  }, [setSearchInput])

  const renderPricingContent = () => {
    if (filteredModels.length === 0) {
      return (
        <EmptyState
          searchQuery={searchInput}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearAll}
        />
      )
    }

    if (viewMode === VIEW_MODES.CARD) {
      return (
        <ModelCardGrid
          models={filteredModels}
          onModelClick={handleModelClick}
          priceRate={priceRate}
          usdExchangeRate={usdExchangeRate}
          tokenUnit={tokenUnit}
          showRechargePrice={showRechargePrice}
        />
      )
    }

    return (
      <PricingTable
        models={filteredModels}
        priceRate={priceRate}
        usdExchangeRate={usdExchangeRate}
        tokenUnit={tokenUnit}
        showRechargePrice={showRechargePrice}
        onModelClick={handleModelClick}
      />
    )
  }

  if (isLoading) {
    return (
      <PublicLayout showMainContainer={false}>
        <div className='mx-auto w-full max-w-[1800px] px-3 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 xl:px-8'>
          <LoadingSkeleton viewMode={viewMode} />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <div className='relative'>
        {/* Background layers (matches homepage style) */}
        {/* Layer 1: Radial gradients */}
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-25 dark:opacity-[0.12]'
          style={{
            background: [
              'radial-gradient(ellipse 60% 50% at 20% 20%, oklch(0.72 0.18 250 / 80%) 0%, transparent 70%)',
              'radial-gradient(ellipse 50% 40% at 80% 15%, oklch(0.65 0.15 200 / 60%) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 35% at 50% 70%, oklch(0.70 0.12 280 / 40%) 0%, transparent 70%)',
            ].join(', '),
          }}
        />
        {/* Layer 2: Grid pattern */}
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_10%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.06]'
        />
        {/* Layer 3: Custom background image (overlay) */}
        <div
          aria-hidden
          className='pointer-events-none absolute inset-x-0 top-0 h-[600px]'
          style={{
            backgroundImage: `url('/model-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            opacity: 0.18,
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
          }}
        />
        <PageTransition className='relative mx-auto w-full max-w-[1800px] px-3 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 xl:px-8'>
          <header className='mx-auto mb-5 max-w-3xl pt-5 text-center sm:mb-10 sm:pt-10'>
            <p className='text-muted-foreground mb-3 text-xs font-medium tracking-widest uppercase'>
              {t('模型市场')}
            </p>
            <h1 className='text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.15] font-bold tracking-tight'>
              {t('国产大模型价格总览')}
            </h1>
            <p className='text-muted-foreground/80 mt-3 text-sm sm:mt-4 sm:text-base'>
              {t('当前已接入 {{count}} 款模型', {
                count: models?.length || 0,
              })}
            </p>
            <p className='text-muted-foreground/60 mx-auto mt-2 max-w-2xl text-xs leading-relaxed sm:text-sm'>
              {t('浏览国产大模型，对比价格与能力，选择适合你的模型。')}
            </p>
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onClear={clearSearch}
              placeholder={t(
                'Search model name, provider, endpoint, or tag...'
              )}
              className='mx-auto mt-4 max-w-2xl sm:mt-6'
            />
            {/* Feature badges */}
            <div className='mt-3 flex flex-wrap items-center justify-center gap-3 text-xs'>
              <span className='text-muted-foreground/70 inline-flex items-center gap-1.5'>
                <svg className='size-3 text-green-500' viewBox='0 0 16 16' fill='none'><circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='1.5'/><path d='M5 8l2 2 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                {t('实时价格同步')}
              </span>
              <span className='text-muted-foreground/70 inline-flex items-center gap-1.5'>
                <svg className='size-3 text-blue-500' viewBox='0 0 16 16' fill='none'><circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='1.5'/><path d='M8 4v4M8 12h.01' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                {t('仅展示可用模型')}
              </span>
              <span className='text-muted-foreground/70 inline-flex items-center gap-1.5'>
                <svg className='size-3 text-purple-500' viewBox='0 0 16 16' fill='none'><rect x='2' y='2' width='12' height='12' rx='2' stroke='currentColor' strokeWidth='1.5'/><path d='M5 6h6M5 9h4M5 12h3' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/></svg>
                {t('按厂商快速定位')}
              </span>
            </div>
            {/* Hot models quick entry */}
            <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
              <span className='text-muted-foreground mr-1 text-xs font-semibold'>{t('热门模型')}</span>
              {HOT_MODELS.map(m => {
                const identity = resolveModelIdentity(m)
                const label = m.includes('/') ? m.split('/').pop()! : m
                return (
                  <button
                    key={m}
                    type='button'
                    onClick={() => handleHotModelClick(m)}
                    className='inline-flex items-center gap-1.5 rounded-full border border-[#E0E7EF] bg-white px-3 py-1.5 text-xs font-medium text-[#4A6A8A] transition-all hover:border-[#004A8F40] hover:text-[#004A8F] hover:bg-[#004A8F08]'
                  >
                    {identity?.vendor && (
                      <span className='text-[11px] text-muted-foreground/60'>{identity.vendor}</span>
                    )}
                    {label}
                  </button>
                )
              })}
            </div>
            {/* Model type & scene chips */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#4A6A8A', marginRight: 4, lineHeight: '32px' }}>模型类型</span>
                {['全部','对话','生图','嵌入','重排序','语音','视频'].map(tag => (
                  <button key={tag}
                    onClick={() => setEndpointTypeFilter(tag === '全部' ? '' : tag)}
                    style={{
                      padding: '6px 16px', borderRadius: 20, border: `1px solid ${endpointTypeFilter === tag || (tag === '全部' && !endpointTypeFilter) ? '#004A8F' : '#E8ECF2'}`,
                      background: endpointTypeFilter === tag || (tag === '全部' && !endpointTypeFilter) ? '#004A8F0d' : '#fff',
                      color: endpointTypeFilter === tag || (tag === '全部' && !endpointTypeFilter) ? '#004A8F' : '#4A6A8A',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!(endpointTypeFilter === tag || (tag === '全部' && !endpointTypeFilter))) { e.currentTarget.style.borderColor = '#004A8F40'; e.currentTarget.style.color = '#004A8F' } }}
                    onMouseLeave={e => { if (!(endpointTypeFilter === tag || (tag === '全部' && !endpointTypeFilter))) { e.currentTarget.style.borderColor = '#E8ECF2'; e.currentTarget.style.color = '#4A6A8A' } }}
                  >{tag}</button>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#4A6A8A', marginRight: 4, lineHeight: '32px' }}>应用场景</span>
                {['全部','旗舰全能','Vibe Coding','RAG','长文本','快速响应','多模态','语音交互','图像生成','视频生成'].map(tag => (
                  <button key={tag}
                    onClick={() => setTagFilter(tag === '全部' ? '' : tag)}
                    style={{
                      padding: '6px 16px', borderRadius: 20, border: `1px solid ${tagFilter === tag || (tag === '全部' && !tagFilter) ? '#004A8F' : '#E8ECF2'}`,
                      background: tagFilter === tag || (tag === '全部' && !tagFilter) ? '#004A8F0d' : '#fff',
                      color: tagFilter === tag || (tag === '全部' && !tagFilter) ? '#004A8F' : '#4A6A8A',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!(tagFilter === tag || (tag === '全部' && !tagFilter))) { e.currentTarget.style.borderColor = '#004A8F40'; e.currentTarget.style.color = '#004A8F' } }}
                    onMouseLeave={e => { if (!(tagFilter === tag || (tag === '全部' && !tagFilter))) { e.currentTarget.style.borderColor = '#E8ECF2'; e.currentTarget.style.color = '#4A6A8A' } }}
                  >{tag}</button>
                ))}
              </div>
            </div>
          </header>

          {/* Cards section with muted background for visual layering */}
          <div className='-mx-3 sm:-mx-6 xl:-mx-8 px-3 sm:px-6 xl:px-8 py-6 sm:py-8 bg-muted/30 border-y border-border/30'>
          <div className='flex items-start gap-4'>
            {/* Sidebar toggle button */}
            <button
              type='button'
              onClick={() => setSidebarOpen(o => !o)}
              className='shrink-0 mt-2 p-2 rounded-lg border border-border/60 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors'
              title={sidebarOpen ? t('收起筛选') : t('展开筛选')}
            >
              {sidebarOpen ? <PanelLeftClose className='size-4' /> : <PanelLeftOpen className='size-4' />}
            </button>

            {/* Sidebar panel */}
            {sidebarOpen && (
              <PricingSidebar
                quotaTypeFilter={quotaTypeFilter}
                endpointTypeFilter={endpointTypeFilter}
                vendorFilter={vendorFilter}
                groupFilter={groupFilter}
                tagFilter={tagFilter}
                onQuotaTypeChange={setQuotaTypeFilter}
                onEndpointTypeChange={setEndpointTypeFilter}
                onVendorChange={setVendorFilter}
                onGroupChange={setGroupFilter}
                onTagChange={setTagFilter}
                vendors={vendors || []}
                groups={availableGroups}
                groupRatios={groupRatio}
                tags={availableTags}
                models={models || []}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                className='shrink-0 w-[300px] max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-xl border bg-card/60 p-3'
              />
            )}

            <main className='min-w-0 flex-1 space-y-4'>
              <PricingToolbar
                filteredCount={filteredModels.length}
                totalCount={models?.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                tokenUnit={tokenUnit}
                onTokenUnitChange={setTokenUnit}
                showRechargePrice={showRechargePrice}
                onRechargePriceChange={setShowRechargePrice}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                quotaTypeFilter={quotaTypeFilter}
                endpointTypeFilter={endpointTypeFilter}
                vendorFilter={vendorFilter}
                groupFilter={groupFilter}
                tagFilter={tagFilter}
                onQuotaTypeChange={setQuotaTypeFilter}
                onEndpointTypeChange={setEndpointTypeFilter}
                onVendorChange={setVendorFilter}
                onGroupChange={setGroupFilter}
                onTagChange={setTagFilter}
                vendors={vendors || []}
                groups={availableGroups}
                groupRatios={groupRatio}
                tags={availableTags}
                models={models || []}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                onClearFilters={clearFilters}
              />

              {renderPricingContent()}
            </main>
          </div>
          </div>{/* end cards section */}

          {selectedModel && (
            <ModelDetailsDrawer
              open={Boolean(selectedModel)}
              onOpenChange={(open) => {
                if (!open) setSelectedModelName(null)
              }}
              model={selectedModel}
              groupRatio={groupRatio || {}}
              usableGroup={usableGroup || {}}
              endpointMap={
                (endpointMap as Record<
                  string,
                  { path?: string; method?: string }
                >) || {}
              }
              autoGroups={autoGroups || []}
              priceRate={priceRate ?? 1}
              usdExchangeRate={usdExchangeRate ?? 1}
              tokenUnit={tokenUnit}
              showRechargePrice={showRechargePrice}
            />
          )}
        </PageTransition>
      </div>
    </PublicLayout>
  )
}
