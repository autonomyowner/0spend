import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-surface-700 border border-surface-500 p-6',
          hover && 'hover:bg-surface-600 hover:border-amber/20 transition-all duration-200',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
