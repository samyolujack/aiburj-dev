import {
  ReceiptText,
  FileText,
  MessageCircle,
  Users,
  type LucideIcon,
} from 'lucide-react'

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

export function PagePlaceholder({ icon, title, description }: PagePlaceholderProps) {
  const Icon = iconMap[icon] || ReceiptText

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/50">
          <Icon className="size-10 text-muted-foreground/40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
