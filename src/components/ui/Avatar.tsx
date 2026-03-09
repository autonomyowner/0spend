import { cn } from '@/lib/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colors = [
  'bg-amber/20 text-amber',
  'bg-success/20 text-success',
  'bg-danger/20 text-danger',
  'bg-blue-500/20 text-blue-400',
  'bg-purple-500/20 text-purple-400',
  'bg-pink-500/20 text-pink-400',
]

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function hashName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const colorIdx = hashName(name) % colors.length
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        sizes[size],
        colors[colorIdx],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
