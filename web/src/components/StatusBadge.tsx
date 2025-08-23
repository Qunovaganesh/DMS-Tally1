import { Badge } from './ui/Badge'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case 'placed':
        return 'default'
      case 'accepted':
        return 'warning'
      case 'fulfilled':
        return 'success'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <Badge variant={getVariant(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}