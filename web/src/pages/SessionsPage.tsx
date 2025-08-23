import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { User, LogOut } from 'lucide-react'

export function SessionsPage() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Sessions</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Role</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Status</p>
              <p className="font-medium text-success">Active</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="danger"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}