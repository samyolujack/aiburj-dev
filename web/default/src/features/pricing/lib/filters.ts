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
import {
  SORT_OPTIONS,
  FILTER_ALL,
  QUOTA_TYPES,
  QUOTA_TYPE_VALUES,
  ENDPOINT_TYPES,
} from '../constants'
import type { PricingModel } from '../types'

// ----------------------------------------------------------------------------
// Filter Utilities
// ----------------------------------------------------------------------------

/**
 * Filter models by search query
 */
export function filterBySearch(
  models: PricingModel[],
  query: string
): PricingModel[] {
  if (!query) return models

  const lowerQuery = query.toLowerCase()
  return models.filter(
    (m) =>
      m.model_name?.toLowerCase().includes(lowerQuery) ||
      m.description?.toLowerCase().includes(lowerQuery) ||
      m.tags?.toLowerCase().includes(lowerQuery) ||
      m.vendor_name?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter models by vendor
 */
export function filterByVendor(
  models: PricingModel[],
  vendor: string
): PricingModel[] {
  if (vendor === FILTER_ALL) return models
  return models.filter((m) => m.vendor_name === vendor)
}

/**
 * Filter models by group
 */
export function filterByGroup(
  models: PricingModel[],
  group: string
): PricingModel[] {
  if (group === FILTER_ALL) return models
  return models.filter((m) => m.enable_groups?.includes(group))
}

/**
 * Filter models by quota type
 */
export function filterByQuotaType(
  models: PricingModel[],
  quotaType: string
): PricingModel[] {
  if (quotaType === QUOTA_TYPES.ALL) return models
  const targetType =
    quotaType === QUOTA_TYPES.TOKEN
      ? QUOTA_TYPE_VALUES.TOKEN
      : QUOTA_TYPE_VALUES.REQUEST
  return models.filter((m) => m.quota_type === targetType)
}

/**
 * Filter models by endpoint type
 */
export function filterByEndpointType(
  models: PricingModel[],
  endpointType: string
): PricingModel[] {
  if (endpointType === ENDPOINT_TYPES.ALL) return models
  // First try exact match on supported_endpoint_types
  const exact = models.filter((m) =>
    m.supported_endpoint_types?.includes(endpointType)
  )
  if (exact.length > 0) return exact
  // Fallback: match against model_type or detect from model name
  return models.filter((m) => {
    const mt = m.model_type || ''
    if (mt === endpointType) return true
    // Auto-detect from model name
    const name = (m.model_name || '').toLowerCase()
    const map: Record<string, string> = {
      '对话': 'chat', '生图': 'image', '嵌入': 'embed',
      '重排序': 'rerank', '语音': 'speech', '视频': 'video',
    }
    const kw = map[endpointType]
    if (!kw) return false
    if (name.includes(kw)) return true
    // Extra keywords for speech/video
    if (endpointType === '语音' && (name.includes('cosyvoice') || name.includes('tts') || name.includes('audio'))) return true
    if (endpointType === '视频' && (name.includes('wan') || name.includes('cogvideo'))) return true
    if (kw === 'chat' && !name.includes('image') && !name.includes('embed') && !name.includes('rerank') && !name.includes('speech') && !name.includes('video')) return true
    return false
  })
}

/**
 * Get model price for sorting
 */
function getModelPrice(model: PricingModel): number {
  return model.quota_type === 0 ? model.model_ratio : model.model_price || 0
}

/**
 * Sort models by specified option
 */
export function sortModels(
  models: PricingModel[],
  sortBy: string
): PricingModel[] {
  const sorted = [...models]

  switch (sortBy) {
    case SORT_OPTIONS.NAME:
      sorted.sort((a, b) =>
        (a.model_name || '').localeCompare(b.model_name || '')
      )
      break
    case SORT_OPTIONS.PRICE_LOW:
      sorted.sort((a, b) => getModelPrice(a) - getModelPrice(b))
      break
    case SORT_OPTIONS.PRICE_HIGH:
      sorted.sort((a, b) => getModelPrice(b) - getModelPrice(a))
      break
  }

  return sorted
}

/**
 * Apply all filters and sorting to models
 */
export function filterAndSortModels(
  models: PricingModel[],
  filters: {
    search: string
    vendor: string
    group: string
    quotaType: string
    endpointType: string
    tag: string
    sortBy: string
  }
): PricingModel[] {
  let result = filterBySearch(models, filters.search)
  result = filterByVendor(result, filters.vendor)
  result = filterByGroup(result, filters.group)
  result = filterByQuotaType(result, filters.quotaType)
  result = filterByEndpointType(result, filters.endpointType)
  result = filterByTag(result, filters.tag)
  result = sortModels(result, filters.sortBy)

  return result
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagsString?: string): string[] {
  if (!tagsString) return []
  return tagsString
    .split(/[,;|\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * Extract all unique tags from models
 */
export function extractAllTags(models: PricingModel[]): string[] {
  const tagSet = new Set<string>()

  models.forEach((model) => {
    if (model.tags) {
      const tags = parseTags(model.tags)
      tags.forEach((tag) => {
        tagSet.add(tag.toLowerCase())
      })
    }
  })

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

/**
 * Filter models by tag
 */
export function filterByTag(
  models: PricingModel[],
  tag: string
): PricingModel[] {
  if (tag === FILTER_ALL) return models

  const tagLower = tag.toLowerCase()
  // First try exact match on backend tags string
  const exact = models.filter((m) => {
    if (!m.tags) return false
    const modelTags = parseTags(m.tags).map((t) => t.toLowerCase())
    return modelTags.includes(tagLower)
  })
  if (exact.length > 0) return exact
  // Fallback: detect from model name
  return models.filter((m) => {
    const name = (m.model_name || '').toLowerCase()
    const sceneMap: Record<string, string[]> = {
      '旗舰全能': ['pro'],
      'vibe coding': ['coder', 'code'],
      'rag': ['rag'],
      '长文本': ['long', '32k', '128k', '200k', '1m'],
      '快速响应': ['flash', 'turbo', 'air', 'lite'],
      '多模态': ['vl', 'vision', 'video', 'image'],
      '语音交互': ['speech', 'audio', 'voice', 'cosyvoice'],
      '图像生成': ['kolors', 'image'],
      '视频生成': ['wan', 'cogvideo', 'video'],
    }
    const kws = sceneMap[tagLower]
    if (!kws) return false
    return kws.some(kw => name.includes(kw))
  })
}
