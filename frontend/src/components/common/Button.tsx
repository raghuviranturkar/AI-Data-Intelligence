import React from 'react'
import { cn } from '../../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600',
        secondary: 'bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 hover:border-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300',
        success: 'bg-success-500 text-white shadow-sm hover:bg-success-600 hover:shadow-md dark:bg-success-600 dark:hover:bg-success-700',
        danger: 'bg-danger-500 text-white shadow-sm hover:bg-danger-600 hover:shadow-md dark:bg-danger-600 dark:hover:bg-danger-700',
        warning: 'bg-warning-500 text-white shadow-sm hover:bg-warning-600 hover:shadow-md dark:bg-warning-600 dark:hover:bg-warning-700',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5',
        xl: 'px-8 py-4 text-xl gap-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, icon, iconPosition = 'left', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
