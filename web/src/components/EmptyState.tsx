import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-text-secondary mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-text-secondary max-w-sm">{description}</p>
    </div>
  )
}