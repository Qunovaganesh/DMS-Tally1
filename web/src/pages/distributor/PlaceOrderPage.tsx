import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { Search, ShoppingCart, Package } from 'lucide-react'

interface OrderItem {
  skuId: string
  skuName: string
  qty: number
  rate: number
}

export function PlaceOrderPage() {
  const [selectedManufacturer, setSelectedManufacturer] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const queryClient = useQueryClient()

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: () => api.getManufacturers(),
  })

  const { data: skusData } = useQuery({
    queryKey: ['manufacturer-skus', selectedManufacturer, searchQuery],
    queryFn: () => api.getManufacturerSkus(selectedManufacturer, { q: searchQuery }),
    enabled: !!selectedManufacturer,
  })

  const createOrderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      toast.success('Order placed successfully!')
      setOrderItems([])
      setShowConfirm(false)
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
    onError: () => {
      toast.error('Failed to place order')
    },
  })

  const skus = skusData?.data || []

  const updateQuantity = (skuId: string, qty: number) => {
    if (qty === 0) {
      setOrderItems(items => items.filter(item => item.skuId !== skuId))
      return
    }

    const sku = skus.find((s: any) => s.id === skuId)
    if (!sku) return

    setOrderItems(items => {
      const existing = items.find(item => item.skuId === skuId)
      if (existing) {
        return items.map(item =>
          item.skuId === skuId ? { ...item, qty } : item
        )
      } else {
        return [...items, { skuId, skuName: sku.name, qty, rate: sku.rate }]
      }
    })
  }

  const getItemQuantity = (skuId: string) => {
    return orderItems.find(item => item.skuId === skuId)?.qty || 0
  }

  const orderTotal = orderItems.reduce((sum, item) => sum + (item.qty * item.rate), 0)
  const orderGst = orderTotal * 0.18
  const orderGrandTotal = orderTotal + orderGst

  const handleConfirmOrder = () => {
    if (orderItems.length === 0) {
      toast.error('Please add items to your order')
      return
    }

    createOrderMutation.mutate({
      manufacturerId: selectedManufacturer,
      items: orderItems.map(item => ({ skuId: item.skuId, qty: item.qty }))
    })
  }

  if (showConfirm) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Confirm Order</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.skuId} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{item.skuName}</p>
                    <p className="text-sm text-text-secondary">Qty: {item.qty} × {formatCurrency(item.rate)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.qty * item.rate)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>{formatCurrency(orderGst)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(orderGrandTotal)}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleConfirmOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Placing Order...' : 'Confirm Order'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Place Order</h1>

      {/* Manufacturer Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Manufacturer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {manufacturers.map((manufacturer: any) => (
              <button
                key={manufacturer.id}
                onClick={() => setSelectedManufacturer(manufacturer.id)}
                className={`p-4 border rounded-xl text-left transition-colors ${
                  selectedManufacturer === manufacturer.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <p className="font-medium">{manufacturer.name}</p>
                <p className="text-sm text-text-secondary">{manufacturer.email}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedManufacturer && (
        <>
          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search SKUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* SKUs Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Available SKUs</CardTitle>
            </CardHeader>
            <CardContent>
              {skus.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No SKUs found"
                  description="Try adjusting your search or select a different manufacturer"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3">SKU</th>
                        <th className="text-left py-3">Name</th>
                        <th className="text-left py-3">Category</th>
                        <th className="text-right py-3">Rate</th>
                        <th className="text-center py-3">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skus.map((sku: any) => (
                        <tr key={sku.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-mono text-sm">{sku.code}</td>
                          <td className="py-3">{sku.name}</td>
                          <td className="py-3 text-text-secondary">{sku.category}</td>
                          <td className="py-3 text-right">{formatCurrency(sku.rate)}</td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => updateQuantity(sku.id, Math.max(0, getItemQuantity(sku.id) - 1))}
                              >
                                -
                              </Button>
                              <span className="w-12 text-center">{getItemQuantity(sku.id)}</span>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => updateQuantity(sku.id, getItemQuantity(sku.id) + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          {orderItems.length > 0 && (
            <Card className="sticky bottom-4">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {orderItems.length} items • Total: {formatCurrency(orderGrandTotal)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Subtotal: {formatCurrency(orderTotal)} + GST: {formatCurrency(orderGst)}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Proceed to Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}