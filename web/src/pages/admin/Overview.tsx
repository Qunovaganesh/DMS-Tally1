import { KPICard } from '@/components/KPICard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart3, Users, Building, Package } from 'lucide-react'

export function AdminOverview() {
  // Mock data for demo
  const stats = {
    totalUsers: 3,
    totalManufacturers: 2,
    totalDistributors: 1,
    totalOrders: 0,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Active users"
        />
        <KPICard
          title="Manufacturers"
          value={stats.totalManufacturers}
          icon={Building}
          description="Registered manufacturers"
        />
        <KPICard
          title="Distributors"
          value={stats.totalDistributors}
          icon={Building}
          description="Active distributors"
        />
        <KPICard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          description="All time orders"
        />
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
              <p className="font-medium">API Server</p>
              <p className="text-sm text-text-secondary">Online</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
              <p className="font-medium">Database</p>
              <p className="text-sm text-text-secondary">Connected</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
              </div>
              <p className="font-medium">Integrations</p>
              <p className="text-sm text-text-secondary">Mock Mode</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}