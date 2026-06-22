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
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'

type HeaderProps = React.HTMLAttributes<HTMLElement>

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-[var(--app-header-height,3rem)] w-full shrink-0',
        className
      )}
      style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
        padding: '0 32px',
      }}
      {...props}
    >
      <div className='flex h-full items-center gap-2'>
        <SidebarTrigger variant='ghost' className='size-8' />
        {children}
      </div>
    </header>
  )
}
