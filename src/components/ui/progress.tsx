import * as React from 'react'
import { cn } from '../../utils/cn'

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-secondary', className)}>
      <div
        className="h-2 rounded-full bg-primary"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

