// ─── Menu ───────────────────────────────────────────────────
import { CreateProductDto, Extra, CreateExtraDto } from '@/types'
import axios from 'axios'
import { ReservationData, ReviewData } from './schemas'

const isServer = typeof window === "undefined"

export const api = axios.create({
  // 🆕 العنوان من متغير البيئة (على السيرفر) أو من الـ proxy (في المتصفح)
  baseURL: isServer ? process.env.API_URL : "/api/remote",
  // 🆕 عشان لارافيل يرد JSON حتى في الأخطاء
  headers: { Accept: 'application/json' },
})

// ── 1️⃣ خدمات المنتجات (Products) ──
export const productApi = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data.data
  },

  // 🆕 ريم ملهاش endpoint لمنتج واحد ولا لقسم ولا بحث، فبنفلتر من القايمة
  getById: async (id: string) => {
    const all = await productApi.getAll()
    return all.find((p: any) => String(p.id) === String(id))
  },
  getByCategory: async (categoryId: string) => {
    const all = await productApi.getAll()
    return all.filter((p: any) => String(p.category_id) === String(categoryId))
  },
  search: async (query: string) => {
    const all = await productApi.getAll()
    const q = query.toLowerCase()
    return all.filter((p: any) => p.name?.toLowerCase().includes(q))
  },

  create: (data: CreateProductDto | FormData) => api.post('/products', data),
 // لارافيل مابيقراش multipart مع PUT، فنبعت POST + _method=PUT
update: (id: string | number, data: FormData) => {
  data.append('_method', 'PUT')
  return api.post(`/products/${id}`, data)
},
  delete: (id: string | number) => api.delete(`/products/${id}`),
}

// ── 2️⃣ خدمات الأقسام (Category) ──
export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data.data || response.data
  },

  create: async (data: { name: string; description?: string; imageFile?: File | null }) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description ?? data.name)
    if (data.imageFile) {
      formData.append('image', data.imageFile)
    }
    return api.post('/categories', formData)
  },

  update: async (id: string | number, data: { name: string; description?: string; imageFile?: File | null }) => {
    const formData = new FormData()
    formData.append('_method', 'PUT') // 🆕 لارافيل مبيقراش multipart مع PUT مباشرة
    formData.append('name', data.name)
    formData.append('description', data.description ?? data.name)
    if (data.imageFile) {
      formData.append('image', data.imageFile)
    }
    return api.post(`/categories/${Number(id)}`, formData)
  },

  delete: async (id: string | number) => {
    return api.delete(`/categories/${Number(id)}`)
  },
}

// ── 3️⃣ خدمات الحجوزات (Reservation) — لسه ريم ما عملتهاش ──
export const reservationApi = {
  getAll: async () => {
    const response = await api.get('/Reservation')
    return response.data.data || response.data
  },

  updateStatus: async (id: string | number, status: number) => {
    const numericId = Number(id)
    return api.patch(`/Reservation/${numericId}/status`, {
      orderStatus: status
    })
  },

  create: async (data: ReservationData) => {
    return api.post('/Reservation', data)
  }
}

// ── 4️⃣ خدمات التقييمات (Review) — لسه ──
export const reviewApi = {
  getAll: async () => {
    const response = await api.get('/Review')
    return response.data.data || response.data
  },
  create: async (data: ReviewData) => {
    const response = await api.post('/Review', data)
    return response.data
  },
  delete: async (id: string | number) => {
    const numericId = Number(id)
    return api.delete(`/Review/${numericId}`)
  }
}

// ── 5️⃣ خدمات العملاء (Customer) — لسه ──
export const customerApi = {
  getAll: async () => {
    const response = await api.get('/Customer')
    return response.data.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/Customer/${id}`)
    return response.data.data
  },
  getStatistics: async (id: number) => {
    const response = await api.get(`/Customer/${id}/statistics`)
    return response.data.data
  },
  searchByPhone: async (phone: string) => {
    const response = await api.get(`/Customer/search/${phone}`)
    return response.data.data
  },
}

// ── 6️⃣ خدمات الإضافات (Extra) — لسه ──
export const extraApi = {
  getAll: async (): Promise<Extra[]> => {
    const response = await api.get('/Extra')
    return response.data.data || response.data
  },

  create: async (data: CreateExtraDto) => {
    return api.post('/Extra', data)
  },

  getAvailable: async (): Promise<Extra[]> => {
    const response = await api.get('/Extra/AvailableExtras')
    return response.data.data || response.data
  },

  getById: async (id: string | number): Promise<Extra> => {
    const response = await api.get(`/Extra/${id}`)
    return response.data.data || response.data
  },

  update: async (id: string | number, data: CreateExtraDto) => {
    return api.put(`/Extra/${id}`, data)
  },

  delete: async (id: string | number) => {
    return api.delete(`/Extra/${id}`)
  }
}

// ── 7️⃣ خدمات الأوردر (Order) — لسه ──
export const orderApi = {
  createCustomer: async (name: string, phone: string) => {
    const response = await api.post('/Customer', { name, phone })
    return response.data
  },

  createOrder: async (customerId: number, items: { product_id: number, quantity: number }[]) => {
    const response = await api.post('/Order', {
      customer_id: customerId,
      items
    })
    return response.data
  }
}