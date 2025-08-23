import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function KPICard({ title, value, icon: Icon, description }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-text-secondary mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}