/// ─── API Layer ──────────────────────────────────────────────
import { CreateProductDto, Extra, CreateExtraDto } from '@/types'
import axios from 'axios'
import { ReservationData } from './schemas'

const isServer = typeof window === 'undefined'

export const api = axios.create({
  // على السيرفر: العنوان من متغير البيئة | في المتصفح: عن طريق الجرسون
  baseURL: isServer ? process.env.API_URL : '/api/remote',
  // عشان لارافيل يرد JSON حتى في الأخطاء
  headers: { Accept: 'application/json' },
})
// ── 1️⃣ المنتجات (Products) ──
export const productApi = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data.data
  },
  // المنيو العام: المنتجات الـ active بس
  getActive: async () => {
    const response = await api.get('/products', { params: { is_active: 1 } })
    return response.data.data
  },
  // الفلترة من القايمة (ممكن نستخدم ?category_id= و ?name= من ريم بعدين)
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
  // إظهار/إخفاء المنتج: لارافيل بيطلب category_id وname (وbase_price لو من غير أحجام)
     setActive: (item: any, active: boolean) => {
    const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0

    // تعديل المنتج بأحجام محتاج sizes، ومش عارفين ريم بتستبدل ولا بتضيف
    if (hasSizes) {
      return Promise.reject(
        new Error('Hiding dishes with sizes needs a backend update (ask Reem for PATCH /products/{id}/status)')
      )
    }

    const fd = new FormData()
    fd.append('name', item.name)
    fd.append('category_id', String(item.category_id))
    fd.append('description', item.description ?? '')
    fd.append('base_price', String(item.base_price ?? 0))
    fd.append('is_active', active ? '1' : '0')
    fd.append('_method', 'PUT')
    return api.post(`/products/${item.id}`, fd)
  },

  delete: (id: string | number) => api.delete(`/products/${id}`),
}

// ── 2️⃣ الأقسام (Category) ──
export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data.data || response.data
  },

  create: async (data: { name: string; description?: string; imageFile?: File | null }) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description ?? data.name)
    if (data.imageFile) formData.append('image', data.imageFile)
    return api.post('/categories', formData)
  },

  update: async (id: string | number, data: { name: string; description?: string; imageFile?: File | null }) => {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', data.name)
    formData.append('description', data.description ?? data.name)
    if (data.imageFile) formData.append('image', data.imageFile)
    return api.post(`/categories/${Number(id)}`, formData)
  },

  delete: async (id: string | number) => {
    return api.delete(`/categories/${Number(id)}`)
  },
}

// ── 3️⃣ الطلبات والحجوزات (Orders) — نفس الـ endpoint ──
export type OrderType = 'delivery' | 'reservation'

export interface CreateOrderPayload {
  customerName: string
  customerPhone: string
  order_type: OrderType
  // دليفري
  address?: string
  latitude?: number
  longitude?: number
  // حجز
  numberOfGuests?: number
  dateOnly?: string // YYYY-MM-DD
  timeOnly?: string // HH:mm:ss
  notes?: string
  items: { product_id: number; size_id: number | null; quantity: number }[]
}

export const orderApi = {
  // عميل: إنشاء طلب دليفري أو حجز طاولة
  create: async (payload: CreateOrderPayload) => {
    const response = await api.post('/orders', payload)
    return response.data
  },

  // أدمن: كل الطلبات والحجوزات
  getAll: async () => {
    const response = await api.get('/orders')
    return response.data.data || response.data
  },

  // أدمن: pending | preparing | delivered | cancelled | completed
  updateStatus: async (id: string | number, status: string) => {
    return api.patch(`/orders/${Number(id)}/status`, { status })
  },

  // عميل: تتبع طلباته بالتليفون (لازم ريم تخليها query)
  track: async (phone: string) => {
    const response = await api.get('/orders/track', { params: { phone } })
    return response.data.data || response.data
  },
}

// ── 4️⃣ التقييمات (Reviews) — مربوطة بـ order_id ──
export interface CreateReviewPayload {
  order_id: number
  customerPhone: string
  rating: number
  comment: string
}

export const reviewApi = {
  getAll: async () => {
    const response = await api.get('/reviews')
    return response.data.data || response.data
  },
  create: async (data: CreateReviewPayload) => {
    const response = await api.post('/reviews', data)
    return response.data
  },
  delete: async (id: string | number) => {
    return api.delete(`/reviews/${Number(id)}`)
  },
}

// ── 5️⃣ الحجوزات (Legacy) — هتتشال لما نربط الحجز بـ orderApi ──
export const reservationApi = {
  getAll: async () => {
    const response = await api.get('/Reservation')
    return response.data.data || response.data
  },
  updateStatus: async (id: string | number, status: number) => {
    return api.patch(`/Reservation/${Number(id)}/status`, { orderStatus: status })
  },
  create: async (data: ReservationData) => {
    return api.post('/Reservation', data)
  },
}


// ── 6️⃣ العملاء (Customer) — من /dashboard/customers ──
export const customerApi = {
  getAll: async (params?: { name?: string; phone?: string }) => {
    const response = await api.get('/dashboard/customers', { params })
    return response.data.data
  },
}

// ── 7️⃣ الإضافات (Extra) — ريم لسه شغالة عليها ──
export const extraApi = {
    getAll: async (): Promise<Extra[]> => {
    const response = await api.get('/products/extras')
    const list = response.data.data ?? response.data
    // الحقول بالـ snake_case غالباً، فبنحوّلها للشكل اللي SizeModal بيقراه (تخمين لحد ما نشوف رد حقيقي)
    return (Array.isArray(list) ? list : []).map((e: any) => ({
      ...e,
      price: Number(e.price ?? 0),
      isAvailableAlone: e.isAvailableAlone ?? e.is_available_alone ?? true,
      isDeleted: e.isDeleted ?? e.is_deleted ?? e.is_active === false,
    }))
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
  },
}