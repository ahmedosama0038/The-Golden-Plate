import { z } from 'zod'

// تليفون مصري (يتستخدم في كل الفورمات)
const egyptPhone = z
  .string()
  .regex(/^01[0125][0-9]{8}$/, 'رقم تليفون مصري غير صحيح')

// ─── Login ───────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginData = z.infer<typeof loginSchema>

// ─── Reservation (Legacy) ────────────────────────────────────
// ريم مفيهاش address في الحجز، فشلناه. الحجز الفعلي دلوقتي بيعدي من checkoutSchema
export const reservationSchema = z.object({
  customerName:   z.string().min(2, 'Name is required'),
  customerPhone:  egyptPhone,
  numberOfGuests: z.number().min(1, 'Number of guests is required'),
  dateOnly:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timeOnly:       z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  notes:          z.string().max(200, 'Notes are too long').optional(),
})
export type ReservationData = z.infer<typeof reservationSchema>

// ─── Review (مربوط بـ order_id عند ريم) ──────────────────────
export const reviewSchema = z.object({
  order_id:      z.coerce.number().int().positive('اختار الطلب'),
  customerPhone: egyptPhone,
  rating:        z.coerce.number().min(1, 'اختار تقييم').max(5),
  comment:       z.string().min(10, 'Review must be at least 10 characters'),
})
export type ReviewData = z.infer<typeof reviewSchema>

// ─── Checkout: دليفري أو حجز طاولة ───────────────────────────
export const checkoutSchema = z
  .object({
    customerName: z.string().min(3, 'الاسم لازم يكون 3 حروف على الأقل'),
    customerPhone: egyptPhone,
    order_type: z.enum(['delivery', 'reservation']),

    // دليفري
    address: z.string().optional(),

    // حجز (strings في الفورم، وبنحوّلهم وقت الإرسال)
    numberOfGuests: z.string().optional(),
    dateOnly: z.string().optional(),
    timeOnly: z.string().optional(),

    notes: z.string().max(200, 'الملاحظات طويلة').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.order_type === 'delivery') {
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: 'custom',
          path: ['address'],
          message: 'اكتب العنوان بالتفصيل',
        })
      }
      return
    }

    // reservation
    const guests = Number(data.numberOfGuests)
    if (!guests || guests < 1 || guests > 20) {
      ctx.addIssue({
        code: 'custom',
        path: ['numberOfGuests'],
        message: 'عدد الأشخاص من 1 لـ 20',
      })
    }

    if (!data.dateOnly || !/^\d{4}-\d{2}-\d{2}$/.test(data.dateOnly)) {
      ctx.addIssue({
        code: 'custom',
        path: ['dateOnly'],
        message: 'اختار تاريخ الحجز',
      })
    } else {
      // مينفعش تاريخ فات (مقارنة نصية YYYY-MM-DD بتشتغل صح)
      const now = new Date()
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      if (data.dateOnly < today) {
        ctx.addIssue({
          code: 'custom',
          path: ['dateOnly'],
          message: 'التاريخ ده فات',
        })
      }
    }

    if (!data.timeOnly || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.timeOnly)) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeOnly'],
        message: 'اختار وقت الحجز',
      })
    }
  })

export type CheckoutFormData = z.infer<typeof checkoutSchema>