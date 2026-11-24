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
    setActive: (item: any, active: boolean) => {
    const fd = new FormData()
    const nameEn = item.name_en || item.name
    // مؤقت: name_ar فاضي عند أغلب المنتجات والباك بيطلبه. بنستخدم الاسم الإنجليزي
    // مكانه، ودي بتكتب فعلاً في الداتا لو كان فاضي
    const nameAr = item.name_ar || nameEn

    fd.append('name', item.name)
    fd.append('name_en', nameEn)
    fd.append('name_ar', nameAr)
    fd.append('category_id', String(item.category_id))
    fd.append('description', item.description ?? '')
    if (item.description_en) fd.append('description_en', item.description_en)
    if (item.description_ar) fd.append('description_ar', item.description_ar)
    fd.append('is_active', active ? '1' : '0')

    const sizes = Array.isArray(item.sizes) ? item.sizes : []
    if (sizes.length > 0) {
      sizes.forEach((s: any, i: number) => {
        fd.append(`sizes[${i}][size_name]`, String(s.size_name ?? s.label ?? s.name))
        fd.append(`sizes[${i}][price]`, String(s.price))
      })
    } else {
      fd.append('base_price', String(item.base_price ?? 0))
    }

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

// ── 7️⃣ الإضافات (Extra) ──
// موديل ريم: الإكسترا بتتضاف وتتعدل من مسارات المنتجات بالـ id،
// والإكسترا ممكن يبقى ليها أحجام بأسعار زي المنتج بالظبط.
// الإكسترا = منتج جوه قسم اسمه "Extra" (أحمد أكد، وظاهر في categories?include_extra=1).
// بنجيب رقم القسم بالاسم مش برقم ثابت، ولو القسم مش موجود الحفظ بيقف برسالة واضحة.
const EXTRA_CATEGORY_NAME = 'extra'

export const getExtraCategoryId = async (): Promise<number> => {
  const response = await api.get('/categories', { params: { include_extra: 1 } })
  const list = response.data.data || response.data
  const cat = (Array.isArray(list) ? list : []).find(
    (c: any) => String(c.name ?? '').trim().toLowerCase() === EXTRA_CATEGORY_NAME
  )
  if (!cat) throw new Error('قسم Extra مش موجود في Categories. اعمله الأول وبعدين احفظ الإكسترا.')
  return Number(cat.id)
}

// تحويل رد الباك (snake_case) للشكل اللي الواجهة بتقراه
const mapExtra = (e: any): Extra => {
  const sizes: { id?: string | number; size_name: string; price: number }[] =
    Array.isArray(e.sizes)
      ? e.sizes.map((s: any) => ({ id: s.id, size_name: s.size_name ?? s.name ?? s.label, price: Number(s.price ?? 0) }))
      : []
  const hasSizes = Boolean(e.has_sizes ?? e.hasSizes ?? sizes.length > 0)
  return {
    ...e,
    // السعر: لو مفيش أحجام خد base_price/price، لو فيه أحجام خد أقل سعر للعرض
    price: sizes.length ? Math.min(...sizes.map((s) => s.price)) : Number(e.price ?? e.base_price ?? 0),
    isAvailableAlone: ![false, 0, '0', 'false'].includes(e.isAvailableAlone ?? e.is_available_alone ?? e.is_active ?? true),
    isDeleted: e.isDeleted ?? e.is_deleted ?? false,
    hasSizes,
    sizes,
  }
}

// بناء الفورم داتا بنفس شكل المنتج (لارافيل multipart: sizes[0][size_name] ...)
const buildExtraFormData = (
  data: CreateExtraDto,
  categoryId: number,
  methodOverride?: 'PUT'
): FormData => {
  const fd = new FormData()
  fd.append('category_id', String(categoryId))
    const nameEn = data.name.trim()
  const desc = data.description?.trim() || nameEn
  fd.append('name', nameEn)
  fd.append('name_en', nameEn)
  // الباك بيرفض name_ar الفاضي، فبنستخدم الاسم الإنجليزي (مفيش حقل عربي في فورم الإكسترا لسه)
  fd.append('name_ar', nameEn)
  fd.append('description', desc)
  fd.append('description_en', desc)
  fd.append('is_active', data.isAvailableAlone ? '1' : '0')
  if (data.imageFile) fd.append('image', data.imageFile)
  const sizes = data.hasSizes ? (data.sizes ?? []).filter((s) => s.size_name && s.price >= 0) : []
  if (sizes.length) {
    sizes.forEach((s, i) => {
      fd.append(`sizes[${i}][size_name]`, s.size_name)
      fd.append(`sizes[${i}][price]`, String(s.price))
    })
  } else {
    fd.append('base_price', String(data.price ?? 0))
  }
  if (methodOverride) fd.append('_method', methodOverride) // لارافيل مابيقراش multipart مع PUT
  return fd
}

export const extraApi = {
    getAll: async (): Promise<Extra[]> => {
    const response = await api.get('/products/extras')
    const list = response.data.data ?? response.data
    return (Array.isArray(list) ? list : []).map(mapExtra)
  },
  // إضافة إكسترا: POST /products بـ category_id بتاع قسم Extra
  create: async (data: CreateExtraDto) => {
    return api.post('/products', buildExtraFormData(data, await getExtraCategoryId()))
  },
  // تعديل إكسترا: نفس مسار المنتج بالـ id
  update: async (id: string | number, data: CreateExtraDto) => {
    return api.post(`/products/${Number(id)}`, buildExtraFormData(data, await getExtraCategoryId(), 'PUT'))
  },
  delete: async (id: string | number) => {
    return api.delete(`/products/${Number(id)}`)
  },
}