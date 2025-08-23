import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { User, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react'

// Mock auth state
const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  
  const login = (email: string) => {
    if (email === 'admin@demo.com') {
      setUser({ id: 1, email, role: 'admin', name: 'Admin User' })
    } else if (email === 'manu@demo.com') {
      setUser({ id: 2, email, role: 'manufacturer', name: 'Manufacturer User' })
    } else if (email === 'dist@demo.com') {
      setUser({ id: 3, email, role: 'distributor', name: 'Distributor User' })
    }
  }
  
  const logout = () => setUser(null)
  
  return { user, login, logout }
}

// Login Page
const LoginPage = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('')
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">BizzPlus DMS</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={() => onLogin(email)}
            className="w-full bg-accent text-white p-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 text-sm text-secondary space-y-1">
          <p>Demo accounts:</p>
          <p>• admin@demo.com / 123456</p>
          <p>• manu@demo.com / 123456</p>
          <p>• dist@demo.com / 123456</p>
        </div>
      </div>
    </div>
  )
}

// Dashboard Components
const Dashboard = ({ user }: { user: any }) => {
  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { icon: BarChart3, label: 'Overview', path: '/overview' },
          { icon: Users, label: 'Users', path: '/users' },
        ]
      case 'manufacturer':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
          { icon: ShoppingCart, label: 'Orders', path: '/orders' },
        ]
      case 'distributor':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
          { icon: ShoppingCart, label: 'Place Order', path: '/place-order' },
          { icon: Package, label: 'Inventory', path: '/inventory' },
        ]
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-surface/80 backdrop-blur-xl border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-danger rounded-full"></div>
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
            <h1 className="text-lg font-semibold">BizzPlus DMS</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary">{user.name}</span>
            <button className="text-sm text-accent hover:underline">Logout</button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-surface/50 backdrop-blur-xl border-r border-border min-h-screen p-4">
          <nav className="space-y-2">
            {getNavItems().map((item) => (
              <div
                key={item.path}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-background/50 cursor-pointer"
              >
                <item.icon className="w-5 h-5 text-secondary" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
            <p className="text-secondary">
              You're logged in as a <span className="font-medium text-accent">{user.role}</span>.
            </p>
            
            {user.role === 'distributor' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">Open Orders</h3>
                  <p className="text-2xl font-semibold mt-1">3</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">SKUs in Stock</h3>
                  <p className="text-2xl font-semibold mt-1">127</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">This Month</h3>
                  <p className="text-2xl font-semibold mt-1">₹2.4L</p>
                </div>
              </div>
            )}

            {user.role === 'manufacturer' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">Pending Orders</h3>
                  <p className="text-2xl font-semibold mt-1">8</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">Fulfilled Today</h3>
                  <p className="text-2xl font-semibold mt-1">12</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">Revenue</h3>
                  <p className="text-2xl font-semibold mt-1">₹8.7L</p>
                </div>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">Total Users</h3>
                  <p className="text-2xl font-semibold mt-1">156</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">Active Sessions</h3>
                  <p className="text-2xl font-semibold mt-1">23</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <h3 className="font-medium text-sm text-secondary">System Health</h3>
                  <p className="text-2xl font-semibold mt-1 text-success">Good</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App
function App() {
  const { user, login, logout } = useAuth()

  if (!user) {
    return <LoginPage onLogin={login} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  )
}

export default App