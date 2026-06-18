import {
  ReceiptText,
  FileText,
  MessageCircle,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PagePlaceholderProps = {
  icon: string
  title: string
  description: string
}

const iconMap: Record<string, LucideIcon> = {
  receipt: ReceiptText,
  invoice: FileText,
  ticket: MessageCircle,
  users: Users,
}

const colorMap: Record<string, string> = {
  receipt: 'text-[#0080C0]',
  invoice: 'text-[#0080C0]',
  ticket: 'text-[#004A8F]',
  users: 'text-[#0080C0]',
}

const bgMap: Record<string, string> = {
  receipt: 'bg-[#0080C0]/[0.06]',
  invoice: 'bg-[#0080C0]/[0.06]',
  ticket: 'bg-[#004A8F]/[0.06]',
  users: 'bg-[#0080C0]/[0.06]',
}

export function PagePlaceholder({ icon, title, description }: PagePlaceholderProps) {
  const Icon = iconMap[icon] || ReceiptText
  const iconColor = colorMap[icon] || 'text-[#0080C0]'
  const iconBg = bgMap[icon] || 'bg-[#0080C0]/[0.06]'

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        {/* Icon circle */}
        <div className={cn(
          'flex size-20 items-center justify-center rounded-2xl',
          iconBg
        )}>
          <Icon className={cn('size-10', iconColor)} />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#0080C0]/20" />
          <span className="size-1.5 rounded-full bg-[#0080C0]/40" />
          <span className="size-1.5 rounded-full bg-[#0080C0]/15" />
        </div>
      </div>
    </div>
  )
}
