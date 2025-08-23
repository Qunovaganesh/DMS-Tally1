import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-border text-text-primary': variant === 'default',
            'bg-success/10 text-success': variant === 'success',
            'bg-warning/10 text-warning': variant === 'warning',
            'bg-danger/10 text-danger': variant === 'danger',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'