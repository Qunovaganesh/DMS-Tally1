import { useAuthStore } from '@/stores/auth'

const API_BASE = '/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { token } = useAuthStore.getState()
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => fetchApi('/me'),

  // Distributor
  getManufacturers: (q?: string) =>
    fetchApi(`/manufacturers${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  getManufacturerSkus: (manufacturerId: string, params?: { q?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.set('q', params.q)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString())
    
    return fetchApi(`/manufacturers/${manufacturerId}/skus?${searchParams}`)
  },

  createOrder: (data: { manufacturerId: string; items: Array<{ skuId: string; qty: number }> }) =>
    fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getInventory: () => fetchApi('/inventory'),

  // Manufacturer
  getManufacturerOrders: (status?: string) =>
    fetchApi(`/m/orders${status ? `?status=${status}` : ''}`),

  getManufacturerOrder: (id: string) => fetchApi(`/m/orders/${id}`),

  acceptOrder: (id: string) =>
    fetchApi(`/m/orders/${id}/accept`, { method: 'POST' }),

  rejectOrder: (id: string) =>
    fetchApi(`/m/orders/${id}/reject`, { method: 'POST' }),

  fulfillOrder: (id: string) =>
    fetchApi(`/m/orders/${id}/fulfill`, { method: 'POST' }),

  // Admin
  getUsers: () => fetchApi('/admin/users'),

  toggleUserStatus: (id: string) =>
    fetchApi(`/admin/users/${id}/disable`, { method: 'POST' }),
}