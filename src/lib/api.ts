// ─── Menu ───────────────────────────────────────────────────
export const dynamic = "force-dynamic";
import { CreateProductDto, Extra, CreateExtraDto } from '@/types'
import axios from 'axios'
import { ReservationData, ReviewData } from './schemas'

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer
    ? "https://myrestaurant.runasp.net/api"
    : "/api/remote",
});

// Interceptor — بيضيف الـ token تلقائي في كل request (شغال زي ما هو ومفيهوش أي مشكلة)
api.interceptors.request.use((config) => {
  const token = typeof document !== 'undefined'
    ? document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1]
    : undefined

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── 1️⃣ خدمات المنتجات (Products) ──
export const productApi = {
  getAll: async () => {
    const response = await api.get('/Product')
    return response.data.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/Product/${id}`)
    return response.data.data
  },
  getByCategory: async (categoryId: string) => {
    const response = await api.get(`/Product/category/${categoryId}`)
    return response.data.data
  },
  search: async (query: string) => {
    const response = await api.get('/Product/search', { params: { query } })
    return response.data.data
  },
  create: (data: CreateProductDto) => api.post('/Product', data),
  update:  (id: string, data: any) => api.put(`/Product/${id}`, data),
  delete: (id: string | number) => api.put(`/Product/${id}/SoftDelete`),
}

// ── 2️⃣ خدمات الأقسام (Category) ──
export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/Category')
    return response.data.data || response.data
  },
  
  create: async (data: { name: string; imageFile?: File | null }) => {
    const formData = new FormData()
    formData.append('Name', data.name)
    if (data.imageFile) {
      formData.append('ImageOfCategory', data.imageFile)
    }

    return api.post('/Category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update: async (id: string | number, data: { name: string; imageFile?: File | null }) => {
    const numericId = Number(id)
    const formData = new FormData()
    
    formData.append('Id', String(numericId))
    formData.append('Name', data.name)
    
    if (data.imageFile) {
      formData.append('ImageOfCategory', data.imageFile)
    }

    return api.put(`/Category/${numericId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete: async (id: string | number) => {
    const numericId = Number(id)
    return api.delete(`/Category/${numericId}`)
  }
}

// ── 3️⃣ خدمات الحجوزات (Reservation) ──
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

// ── 4️⃣ خدمات التقييمات (Review) ──
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

// ── 5️⃣ خدمات العملاء (Customer) ──
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

// ── 6️⃣ خدمات الإضافات (Extra) ──
export const extraApi = {
  // 1. GET ALL EXTRAS
  getAll: async (): Promise<Extra[]> => {
    const response = await api.get('/Extra')
    return response.data.data || response.data
  },

  // 2. POST (ADD NEW EXTRA)
  create: async (data: CreateExtraDto) => {
    return api.post('/Extra', data)
  },

  // 3. GET AVAILABLE EXTRAS ONLY
  getAvailable: async (): Promise<Extra[]> => {
    const response = await api.get('/Extra/AvailableExtras')
    return response.data.data || response.data
  },

  // 4. GET EXTRA BY ID
  getById: async (id: string | number): Promise<Extra> => {
    const response = await api.get(`/Extra/${id}`)
    return response.data.data || response.data
  },

  // 5. PUT (UPDATE EXTRA)
  update: async (id: string | number, data: CreateExtraDto) => {
    return api.put(`/Extra/${id}`, data)
  },

  // 6. DELETE EXTRA
  delete: async (id: string | number) => {
    return api.delete(`/Extra/${id}`)
  }
}