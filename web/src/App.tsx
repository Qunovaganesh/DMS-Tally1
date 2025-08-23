import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import { LoginPage } from './pages/LoginPage'
import { SessionsPage } from './pages/SessionsPage'
import { AppShell } from './components/AppShell'
import { DistributorDashboard } from './pages/distributor/Dashboard'
import { PlaceOrderPage } from './pages/distributor/PlaceOrderPage'
import { InventoryPage } from './pages/distributor/InventoryPage'
import { ManufacturerDashboard } from './pages/manufacturer/Dashboard'
import { ManufacturerOrdersPage } from './pages/manufacturer/OrdersPage'
import { AdminOverview } from './pages/admin/Overview'
import { AdminUsersPage } from './pages/admin/UsersPage'
import { AdminLogsPage } from './pages/admin/LogsPage'

function App() {
  const { token, user } = useAuthStore()

  if (!token || !user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/sessions" element={<SessionsPage />} />
        
        {user.role === 'distributor' && (
          <>
            <Route path="/dashboard" element={<DistributorDashboard />} />
            <Route path="/place-order" element={<PlaceOrderPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
        
        {user.role === 'manufacturer' && (
          <>
            <Route path="/dashboard" element={<ManufacturerDashboard />} />
            <Route path="/orders" element={<ManufacturerOrdersPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
        
        {user.role === 'admin' && (
          <>
            <Route path="/overview" element={<AdminOverview />} />
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/logs" element={<AdminLogsPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </>
        )}
      </Routes>
    </AppShell>
  )
}

export default App