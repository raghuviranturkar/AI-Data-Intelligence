import React from 'react'
import { cn } from '../../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
        success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
        warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
        danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
