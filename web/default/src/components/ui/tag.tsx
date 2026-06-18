import { cn } from '@/lib/utils'

type TagVariant = 'blue' | 'green' | 'purple' | 'orange' | 'amber'

type TagProps = {
  children: React.ReactNode
  variant?: TagVariant
  className?: string
}

/**
 * aiburj card tag component — pill-shaped labels for model cards,
 * feature badges, and categorization.
 *
 * Usage:
 *   <Tag variant="blue">文本</Tag>
 *   <Tag variant="purple">推理模型</Tag>
 */
export function Tag({ children, variant = 'blue', className }: TagProps) {
  return (
    <span className={cn('tag', `tag-${variant}`, className)}>
      {children}
    </span>
  )
}
