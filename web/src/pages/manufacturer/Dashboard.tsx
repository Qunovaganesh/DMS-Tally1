import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { KPICard } from '@/components/KPICard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react'

export function ManufacturerDashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ['manufacturer-orders'],
    queryFn: () => api.getManufacturerOrders(),
  })

  const placedOrders = orders.filter((order: any) => order.status === 'placed')
  const acceptedOrders = orders.filter((order: any) => order.status === 'accepted')
  const fulfilledOrders = orders.filter((order: any) => order.status === 'fulfilled')
  const rejectedOrders = orders.filter((order: any) => order.status === 'rejected')

  const totalRevenue = fulfilledOrders.reduce((sum: number, order: any) => sum + order.order_grand_total, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Pending Orders"
          value={placedOrders.length}
          icon={Clock}
          description="Awaiting action"
        />
        <KPICard
          title="Accepted Orders"
          value={acceptedOrders.length}
          icon={CheckCircle}
          description="In progress"
        />
        <KPICard
          title="Fulfilled Orders"
          value={fulfilledOrders.length}
          icon={CheckCircle}
          description="Completed"
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={CheckCircle}
          description="From fulfilled orders"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No orders yet"
              description="Orders from distributors will appear here"
            />
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-text-secondary">
                      {order.distributorName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(order.order_grand_total)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}