import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { Package, TrendingDown } from 'lucide-react'

export function InventoryPage() {
  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory,
  })

  const handleSimulateSale = (skuId: string) => {
    toast.success('Sale simulated - inventory updated!')
    // In a real app, this would call an API endpoint
  }

  const totalValue = inventory.reduce((sum: any, item: any) => sum + (item.onHand * item.rate), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Total Value</p>
          <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Stock on Hand
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No inventory found"
              description="Your inventory items will appear here once you receive orders"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3">SKU</th>
                    <th className="text-left py-3">Name</th>
                    <th className="text-right py-3">Rate</th>
                    <th className="text-right py-3">On Hand</th>
                    <th className="text-right py-3">Value</th>
                    <th className="text-center py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item: any) => (
                    <tr key={item.skuId} className="border-b border-border last:border-0">
                      <td className="py-3 font-mono text-sm">{item.skuCode}</td>
                      <td className="py-3">{item.skuName}</td>
                      <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-3 text-right font-medium">{item.onHand}</td>
                      <td className="py-3 text-right">{formatCurrency(item.onHand * item.rate)}</td>
                      <td className="py-3 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSimulateSale(item.skuId)}
                          className="flex items-center gap-1"
                        >
                          <TrendingDown className="w-3 h-3" />
                          Simulate Sale
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