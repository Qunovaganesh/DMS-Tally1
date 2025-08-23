import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/EmptyState'
import { Users, UserCheck, UserX } from 'lucide-react'

export function AdminUsersPage() {
  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: api.getUsers,
  })

  const toggleUserMutation = useMutation({
    mutationFn: api.toggleUserStatus,
    onSuccess: () => {
      toast.success('User status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to update user status')
    },
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger'
      case 'manufacturer':
        return 'warning'
      case 'distributor':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Users will appear here once they register"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Role</th>
                    <th className="text-center py-3">Status</th>
                    <th className="text-center py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-text-secondary">{user.email}</td>
                      <td className="py-3">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant={user.disabled ? 'danger' : 'success'}>
                          {user.disabled ? 'Disabled' : 'Active'}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleUserMutation.mutate(user.id)}
                          disabled={toggleUserMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          {user.disabled ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Enable
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              Disable
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}