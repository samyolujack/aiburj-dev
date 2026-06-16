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
import { Fragment, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

interface FooterLink {
  text: string
  href: string
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: string
  name?: string
  columns?: FooterColumnProps[]
  copyright?: string
  className?: string
}

const NEW_API_FOOTER_ATTRIBUTION_KEY = [
  'footer',
  'new' + 'api',
  'projectAttributionSuffix',
].join('.')

function FooterLinkItem(props: { link: FooterLink }) {
  const { t } = useTranslation()
  const isExternal = props.link.href.startsWith('http')
  const label = t(props.link.text)

  if (isExternal) {
    return (
      <a
        href={props.link.href}
        target='_blank'
        rel='noopener noreferrer'
        className='text-muted-foreground hover:text-foreground text-base transition-colors duration-200'
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={props.link.href}
      className='text-muted-foreground hover:text-foreground text-base transition-colors duration-200'
    >
      {label}
    </Link>
  )
}

// Renders User Agreement / Privacy Policy links inline with the parent's
// copyright row when either is configured in System Settings → Site. Emits
// fragmented siblings so the parent flex container's gap controls spacing.
function LegalLinks(props: { leadingSeparator?: boolean }) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const items: { key: string; label: string; href: string }[] = []
  if (status?.user_agreement_enabled) {
    items.push({
      key: 'user-agreement',
      label: t('User Agreement'),
      href: '/user-agreement',
    })
  }
  if (status?.privacy_policy_enabled) {
    items.push({
      key: 'privacy-policy',
      label: t('Privacy Policy'),
      href: '/privacy-policy',
    })
  }
  if (items.length === 0) {
    return null
  }
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {(props.leadingSeparator || index > 0) && (
            <span aria-hidden='true' className='text-muted-foreground/30'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='hover:text-foreground transition-colors duration-200'
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </>
  )
}

// inline=true returns just the inner span for composition in a parent flex
// row. inline=false wraps in a centered/right-aligned div (default).
function ProjectAttribution(props: { currentYear: number; inline?: boolean }) {
  const { t } = useTranslation()
  const content = (
    <span className='text-muted-foreground/45'>
      &copy; {props.currentYear}{' '}
      <a
        href='https://github.com/QuantumNous/new-api'
        target='_blank'
        rel='noopener noreferrer'
        className='text-foreground/70 hover:text-foreground font-medium transition-colors'
      >
        {t('aiburj')}
      </a>
      . {t(NEW_API_FOOTER_ATTRIBUTION_KEY)}
    </span>
  )
  if (props.inline) {
    return content
  }
  return (
    <div className='text-muted-foreground/45 text-center text-xs sm:text-right'>
      {content}
    </div>
  )
}

export function Footer(props: FooterProps) {
  const { t } = useTranslation()
  const {
    systemName,
    logo: systemLogo,
    footerHtml,
    demoSiteEnabled,
  } = useSystemConfig()

  const displayLogo = systemLogo || props.logo || '/logo.png'
  const displayName = systemName || props.name || 'aiburj'
  const isDemoSiteMode = Boolean(demoSiteEnabled)
  const currentYear = new Date().getFullYear()

  const fallbackColumns = useMemo<FooterColumnProps[]>(
    () => [
      {
        title: '页面',
        links: [
          { text: '价格', href: '/pricing' },
          { text: '文档', href: '/docs' },
          { text: '模型广场', href: '/pricing' },
          { text: '排行榜', href: '/rankings' },
          { text: '关于', href: '/about' },
        ],
      },
      {
        title: '产品',
        links: [
          { text: '大模型 API 服务', href: '/pricing' },
          { text: '推理加速', href: '/pricing' },
          { text: '企业方案', href: '/pricing' },
          { text: '私有化部署', href: '/pricing' },
        ],
      },
      {
        title: '法律',
        links: [
          { text: '用户协议', href: '/user-agreement' },
          { text: '隐私协议', href: '/privacy-policy' },
        ],
      },
    ],
    []
  )

  const displayColumns = props.columns ?? fallbackColumns

  if (footerHtml) {
    return (
      <footer
        className={cn(
          'border-border/40 relative z-10 border-t',
          props.className
        )}
      >
        <div className='mx-auto w-full max-w-6xl px-6 py-5'>
          <div className='bg-muted/20 border-border/50 flex flex-col items-center justify-between gap-4 rounded-2xl border px-4 py-4 backdrop-blur-sm sm:flex-row sm:px-5'>
            <div
              className='custom-footer text-muted-foreground min-w-0 text-center text-sm sm:text-left'
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />
            <div className='border-border/60 text-muted-foreground/45 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t pt-4 text-xs sm:w-auto sm:justify-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5'>
              <LegalLinks />
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn('border-border/40 relative z-10 border-t bg-white', props.className)}
    >
      <div className='mx-auto max-w-6xl px-6 py-12 md:py-16'>
        <div className='flex flex-col justify-between gap-10 md:flex-row md:gap-16'>
          {/* Brand column */}
          <div className='shrink-0'>
            <Link to='/' className='group flex items-center'>
              <img
                src={displayLogo}
                alt={displayName}
                style={{ height: 96, width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p className='text-muted-foreground/60 mt-3 max-w-[220px] text-sm leading-relaxed'>
              汇聚中国 AI 力量，一站式大模型 API 聚合平台
            </p>
            {/* Social links — multiple platforms */}
            <div className='mt-4 flex items-center gap-4'>
              <a href='https://github.com/QuantumNous/new-api' target='_blank' rel='noopener noreferrer' className='text-muted-foreground/40 hover:text-foreground/70 transition-colors' aria-label='GitHub'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/>
                </svg>
              </a>
              {/* WeChat placeholder */}
              <span style={{ position: 'relative', cursor: 'pointer' }}
                onMouseEnter={e => { const qr = e.currentTarget.querySelector('[data-qr]') as HTMLElement; if (qr) qr.style.opacity = '1'; qr.style.pointerEvents = 'auto' }}
                onMouseLeave={e => { const qr = e.currentTarget.querySelector('[data-qr]') as HTMLElement; if (qr) qr.style.opacity = '0'; qr.style.pointerEvents = 'none' }}
              >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' className='text-muted-foreground/40 hover:text-foreground/70 transition-colors'>
                  <path d='M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-6 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7.93-11.88C18.73 1.46 15.12 0 12 0 5.37 0 0 4.66 0 10.42c0 3.17 1.63 6.04 4.19 7.92l-1.05 3.93 4.3-2.15c1.41.45 2.93.7 4.56.7.37 0 .73-.01 1.09-.04A7.04 7.04 0 0 1 12 18c-1.52 0-3-.29-4.32-.82l-3.08 1.54.81-3.03C3.26 14.3 2 12.46 2 10.42 2 5.61 6.49 1.7 12 1.7c.43 0 .85.02 1.27.07A7.07 7.07 0 0 1 22 7.93c0 .11 0 .22-.01.33a7 7 0 0 1 .01.74v.21A7.04 7.04 0 0 1 20.43 3.62z'/>
                </svg>
                <span data-qr style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 12, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #E8ECF2', padding: 12, opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s', zIndex: 20 }}>
                  <div style={{ width: 120, height: 120, background: '#F0F4FA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#4A6A8A' }}>
                    公众号<br/>敬请期待
                  </div>
                </span>
              </span>
              {/* Email */}
              <a href='mailto:contact@aiburj.com' className='text-muted-foreground/40 hover:text-foreground/70 transition-colors' aria-label='Email'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='2' y='4' width='20' height='16' rx='2'/>
                  <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns — always visible, siliconflow style */}
          <div className='grid grid-cols-3 gap-8 md:gap-16'>
            {displayColumns.map((column, index) => (
              <div key={index}>
                <p className='text-muted-foreground/50 mb-3 text-base font-medium'>
                  {column.title}
                </p>
                <ul className='space-y-2.5'>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright + optional legal links inline on the left, project
            attribution on the right; wraps on narrow screens. */}
        <div className='border-border/30 mt-12 flex flex-col items-center justify-between gap-x-3 gap-y-2 border-t pt-6 sm:flex-row'>
          <div className='text-muted-foreground/40 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm sm:justify-start'>
            <span>
              &copy; {currentYear} {displayName}.{' '}
              {props.copyright ?? t('footer.defaultCopyright')}
            </span>
            <LegalLinks leadingSeparator />
          </div>
        </div>
      </div>
    </footer>
  )
}
