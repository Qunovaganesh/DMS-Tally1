import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { KPICard } from '@/components/KPICard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShoppingCart, Package, ClipboardList, TrendingUp } from 'lucide-react'

export function DistributorDashboard() {
  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory,
  })

  // Mock recent orders for demo
  const recentOrders = [
    {
      id: 'ORD-001',
      manufacturerName: 'ABC Manufacturing',
      status: 'placed',
      order_grand_total: 2500,
      createdAt: new Date().toISOString(),
    },
  ]

  const totalOnHand = inventory.reduce((sum: number, item: any) => sum + item.onHand, 0)
  const totalValue = inventory.reduce((sum: number, item: any) => sum + (item.onHand * item.rate), 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Open Orders"
          value={recentOrders.length}
          icon={ShoppingCart}
          description="Pending orders"
        />
        <KPICard
          title="SKUs On Hand"
          value={inventory.length}
          icon={Package}
          description="Different products"
        />
        <KPICard
          title="Total Inventory"
          value={totalOnHand}
          icon={TrendingUp}
          description="Units in stock"
        />
        <KPICard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          icon={TrendingUp}
          description="Total stock value"
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
          {recentOrders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No recent orders"
              description="Your recent orders will appear here"
            />
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-text-secondary">
                      {order.manufacturerName}
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