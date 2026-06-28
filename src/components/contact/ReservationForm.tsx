'use client'

import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState }    from 'react'

import { reservationApi } from '@/lib/api'
import { ReservationData, reservationSchema } from '@/lib/schemas'


const TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '18:00', '19:00', '20:00', '21:00',
]

export default function ReservationForm() {
  const [success,  setSuccess]  = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { numberOfGuests: 2 },
  })

  const onSubmit = async (data: ReservationData) => {
    setApiError('')
    try {
      const payload = {
        customerName:   data.customerName,
        customerPhone:  data.customerPhone,
        address:        data.address,
        dateOnly:       data.dateOnly,
        timeOnly:       data.timeOnly + ':00',  // ← "21:00" → "21:00:00"
        numberOfGuests: Number(data.numberOfGuests),
        notes:          data.notes || '',
        latitude:       0,
        longitude:      0,
      }

      await reservationApi.create(payload as any) // 👈 ممكن تحتاج "as any" عشان تتجاوز مشكلة الـ TypeScript لو الـ API مش بيرجع نفس الحقول بالضبط
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setApiError(err?.response?.data?.message ?? 'Something went wrong.')
    }
  }

  return (
    <div className="contact-form animate">
      <h2 className="form-title">Make a Reservation</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input {...register('customerName')} placeholder="James Mitchell" />
          {errors.customerName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.customerName.message}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone</label>
          <input {...register('customerPhone')} type="tel" placeholder="01151343694" />
          {errors.customerPhone && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.customerPhone.message}</span>}
        </div>

        {/* Address ← بدل City */}
        <div className="form-group">
          <label>Address</label>
          <input {...register('address')} placeholder="123 Main St, Cairo" />
          {errors.address && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.address.message}</span>}
        </div>

        {/* Date + Time */}
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input {...register('dateOnly')} type="date" />
            {errors.dateOnly && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.dateOnly.message}</span>}
          </div>
          <div className="form-group">
            <label>Time</label>
            <select {...register('timeOnly')}>
              <option value="">Select time</option>
              {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.timeOnly && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.timeOnly.message}</span>}
          </div>
        </div>

        {/* Guests */}
        <div className="form-group">
          <label>Number of Guests</label>
          <input {...register('numberOfGuests', { valueAsNumber: true })} type="number" min="1" max="20" placeholder="2" />
          {errors.numberOfGuests && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.numberOfGuests.message}</span>}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label>Special Requests</label>
          <textarea {...register('notes')} placeholder="Dietary restrictions, occasion, seating preference..." />
        </div>

        {/* Error */}
        {apiError && (
          <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.82rem' }}>
            {apiError}
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting
            ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.4rem' }} />Sending...</>
            : <>Confirm Reservation <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.4rem' }} /></>
          }
        </button>

        {/* Success */}
        {success && (
          <div style={{ marginTop: '1rem', padding: '0.9rem', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
            <i className="fa-solid fa-check-circle" style={{ marginRight: '0.4rem' }} />
            Reservation confirmed! We&apos;ll be in touch shortly.
          </div>
        )}

      </form>
    </div>
  )
}
