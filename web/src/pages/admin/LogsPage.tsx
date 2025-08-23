import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/EmptyState'
import { formatDate } from '@/lib/utils'
import { FileText, RefreshCw } from 'lucide-react'

export function AdminLogsPage() {
  const [logs] = useState([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'User admin@demo.com logged in',
      source: 'auth'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'info',
      message: 'System startup completed',
      source: 'system'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'warning',
      message: 'Mock API mode active - no real integrations',
      source: 'system'
    }
  ])

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'error':
        return 'danger'
      case 'warning':
        return 'warning'
      case 'info':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">System Logs</h1>
        <Button variant="ghost" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Activity ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No logs found"
              description="System logs will appear here"
            />
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-xl"
                >
                  <Badge variant={getLevelBadgeVariant(log.level)}>
                    {log.level.toUpperCase()}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{log.message}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span>{formatDate(log.timestamp)}</span>
                      <span>Source: {log.source}</span>
                    </div>
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