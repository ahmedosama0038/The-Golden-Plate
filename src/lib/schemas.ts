import { z } from 'zod'

// ─── Login ───────────────────────────────────────────────────
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must contain letters and numbers'),
})
export type LoginData = z.infer<typeof loginSchema>

// ─── Reservation ─────────────────────────────────────────────
export const reservationSchema = z.object({
  customerName:   z.string().min(2, 'Name is required'),
  customerPhone:  z.string().min(10, 'Phone number is required'),
     address:        z.string().min(2,  'Address is required'),  // ← address مش customerCity
  numberOfGuests: z.number().min(1, 'Number of guests is required'),
  dateOnly:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timeOnly:       z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  notes:          z.string().max(200, 'Notes are too long').optional(),
})
export type ReservationData = z.infer<typeof reservationSchema>

// ─── Review ──────────────────────────────────────────────────
export const reviewSchema = z.object({
  customerName:  z.string().min(2,  'Name is required'),
  customerPhone: z.string().min(10, 'Phone is required'),
  rating:        z.coerce.number().min(1).max(5),
  comment:       z.string().min(10, 'Review must be at least 10 characters'),
})

export type ReviewData = z.infer<typeof reviewSchema>


// 1️⃣ الـ Schema بتاع الفورم
  export const checkoutSchema = z.object({
  customerName: z.string().min(3, 'الاسم لازم يكون 3 حروف على الأقل'),
  customerPhone: z.string().regex(/^01[0125][0-9]{8}$/, 'رقم تليفون مصري غير صحيح'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
