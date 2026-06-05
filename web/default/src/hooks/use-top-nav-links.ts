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
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { parseHeaderNavModulesFromStatus } from '@/lib/nav-modules'
import { useStatus } from '@/hooks/use-status'

export type TopNavLink = {
  title: string
  href: string
  disabled?: boolean
  requiresAuth?: boolean
  external?: boolean
  children?: TopNavLink[]
}

/**
 * Generate top navigation links based on HeaderNavModules configuration from backend /api/status
 * Backend format example (stringified JSON):
 * {
 *   home: true,
 *   console: true,
 *   pricing: { enabled: true, requireAuth: false },
 *   rankings: { enabled: true, requireAuth: false },
 *   docs: true,
 *   about: true
 * }
 */
export function useTopNavLinks(): TopNavLink[] {
  const { t } = useTranslation()
  const { status } = useStatus()
  const { auth } = useAuthStore()

  // Parse HeaderNavModules
  const modules = useMemo(() => {
    return parseHeaderNavModulesFromStatus(
      status as Record<string, unknown> | null
    )
  }, [status])

  // Documentation link (may be external)
  const docsLink: string | undefined = status?.docs_link as string | undefined

  const isAuthed = !!auth?.user

  const links: TopNavLink[] = []

  // Home
  if (modules?.home !== false) {
    links.push({ title: t('Home'), href: '/' })
  }

  // Console -> /dashboard (new console path)
  if (modules?.console !== false) {
    links.push({ title: t('Console'), href: '/dashboard' })
  }

  // Pricing
  const pricing = modules?.pricing
  if (pricing && typeof pricing === 'object' && pricing.enabled) {
    const requiresAuth = pricing.requireAuth && !isAuthed
    links.push({ title: t('Model Square'), href: '/pricing', requiresAuth })
  }

  // Rankings
  const rankings = modules?.rankings
  if (rankings && typeof rankings === 'object' && rankings.enabled) {
    const requiresAuth = rankings.requireAuth && !isAuthed
    links.push({ title: t('Rankings'), href: '/rankings', requiresAuth })
  }

  // Docs (supports external links)
  if (modules?.docs !== false) {
    const isExternalDocs = docsLink && (docsLink.startsWith('http://') || docsLink.startsWith('https://'))
    if (isExternalDocs) {
      links.push({ title: t('Docs'), href: docsLink!, external: true })
    } else {
      links.push({ title: t('Docs'), href: '/docs', children: [
        { title: t('快速入门'), href: '/docs' },
        { title: t('API 手册'), href: '/docs/api' },
        { title: t('模型列表'), href: '/pricing' },
        { title: t('常见问题'), href: '/docs/faq' },
      ]})
    }
  }

  // About
  if (modules?.about !== false) {
    links.push({ title: t('About'), href: '/about', children: [
      { title: t('公司介绍'), href: '/about' },
      { title: t('品牌理念'), href: '/about/brand' },
      { title: t('资讯动态'), href: '/about/news' },
    ]})
  }

  return links
}
