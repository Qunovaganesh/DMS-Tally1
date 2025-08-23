import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ClipboardList, Eye, Check, X, Truck } from 'lucide-react'

export function ManufacturerOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const queryClient = useQueryClient()

  const { data: orders = [] } = useQuery({
    queryKey: ['manufacturer-orders', statusFilter],
    queryFn: () => api.getManufacturerOrders(statusFilter),
  })

  const acceptOrderMutation = useMutation({
    mutationFn: api.acceptOrder,
    onSuccess: () => {
      toast.success('Order accepted successfully')
      queryClient.invalidateQueries({ queryKey: ['manufacturer-orders'] })
      setSelectedOrder(null)
    },
    onError: () => {
      toast.error('Failed to accept order')
    },
  })

  const rejectOrderMutation = useMutation({
    mutationFn: api.rejectOrder,
    onSuccess: () => {
      toast.success('Order rejected')
      queryClient.invalidateQueries({ queryKey: ['manufacturer-orders'] })
      setSelectedOrder(null)
    },
    onError: () => {
      toast.error('Failed to reject order')
    },
  })

  const fulfillOrderMutation = useMutation({
    mutationFn: api.fulfillOrder,
    onSuccess: () => {
      toast.success('Order fulfilled successfully')
      queryClient.invalidateQueries({ queryKey: ['manufacturer-orders'] })
      setSelectedOrder(null)
    },
    onError: () => {
      toast.error('Failed to fulfill order')
    },
  })

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'placed', label: 'Placed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'rejected', label: 'Rejected' },
  ]

  if (selectedOrder) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedOrder(null)}
          >
            ← Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedOrder.id}</CardTitle>
              <StatusBadge status={selectedOrder.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-text-secondary">Distributor</p>
                <p className="font-medium">{selectedOrder.distributorName}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Order Date</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.skuName}</p>
                      <p className="text-sm text-text-secondary">
                        Qty: {item.qty} × {formatCurrency(item.rate)}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.line_grand_total)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedOrder.order_total)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST:</span>
                <span>{formatCurrency(selectedOrder.order_gst)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(selectedOrder.order_grand_total)}</span>
              </div>
            </div>

            {selectedOrder.status === 'placed' && (
              <div className="flex gap-4 mt-6">
                <Button
                  variant="danger"
                  onClick={() => rejectOrderMutation.mutate(selectedOrder.id)}
                  disabled={rejectOrderMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject Order
                </Button>
                <Button
                  onClick={() => acceptOrderMutation.mutate(selectedOrder.id)}
                  disabled={acceptOrderMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept Order
                </Button>
              </div>
            )}

            {selectedOrder.status === 'accepted' && (
              <div className="mt-6">
                <Button
                  onClick={() => fulfillOrderMutation.mutate(selectedOrder.id)}
                  disabled={fulfillOrderMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Mark as Fulfilled
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {/* Status Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No orders found"
              description="Orders matching your filter will appear here"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-text-secondary">
                      {order.distributorName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(order.order_grand_total)}
                      </p>
                      <StatusBadge status={order.status} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
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