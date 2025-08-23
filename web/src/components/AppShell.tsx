import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  Users, 
  BarChart3, 
  FileText,
  Settings
} from 'lucide-react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuthStore()
  const location = useLocation()

  const getNavItems = () => {
    switch (user?.role) {
      case 'distributor':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/place-order', label: 'Place Order', icon: ShoppingCart },
          { path: '/inventory', label: 'Inventory', icon: Package },
        ]
      case 'manufacturer':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/orders', label: 'Orders', icon: ClipboardList },
        ]
      case 'admin':
        return [
          { path: '/overview', label: 'Overview', icon: BarChart3 },
          { path: '/users', label: 'Users', icon: Users },
          { path: '/logs', label: 'Logs', icon: FileText },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-surface/80 backdrop-blur-xl border-r border-border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="mac-traffic-lights mb-4">
              <div className="mac-traffic-light red"></div>
              <div className="mac-traffic-light yellow"></div>
              <div className="mac-traffic-light green"></div>
            </div>
            <h1 className="text-xl font-semibold">BizzPlus DMS</h1>
            <p className="text-sm text-text-secondary mt-1">{user?.name}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-accent text-white'
                          : 'text-text-secondary hover:text-text-primary hover:bg-border/50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Link
              to="/sessions"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Sessions
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}