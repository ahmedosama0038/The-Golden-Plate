'use client'

import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState }    from 'react'

import { orderApi } from '@/lib/api'
import { ReservationFormData, reservationFormSchema } from '@/lib/schemas'
import { useLang, type DictKey } from '@/lib/i18n'

const TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '18:00', '19:00', '20:00', '21:00',
]

const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// أول رسالة خطأ من لارافيل (errors أو message)
const getApiMessage = (err: any, fallback: string) => {
  const data = err?.response?.data
  const firstField = data?.errors ? Object.values(data.errors)[0] : null
  if (Array.isArray(firstField) && firstField[0]) return String(firstField[0])
  return data?.message ?? fallback
}

const errStyle = { color: '#ef4444', fontSize: '0.75rem' }

export default function ReservationForm() {
  const { t } = useLang()
  const tErr = (msg?: string) => (msg ? (t(msg as DictKey) ?? msg) : '')

  const [success,  setSuccess]  = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: { numberOfGuests: 2 },
  })

  const onSubmit = async (data: ReservationFormData) => {
    setApiError('')

    if (data.dateOnly < getToday()) {
      setApiError(t('err.datePast'))
      return
    }

    try {
      await orderApi.create({
        customerName:   data.customerName.trim(),
        customerPhone:  data.customerPhone,
        order_type:     'reservation',
        numberOfGuests: Number(data.numberOfGuests),
        dateOnly:       data.dateOnly,
        timeOnly:       data.timeOnly + ':00',
        notes:          data.notes?.trim() || undefined,
        items:          [],
      })

      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 6000)
    } catch (err: any) {
      console.error('Reservation failed:', err?.response?.status, err?.response?.data ?? err)
      setApiError(getApiMessage(err, t('res.apiError')))
    }
  }

  return (
    <div className="contact-form animate">
      <h2 className="form-title">{t('res.formTitle')}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label>{t('res.name')}</label>
          <input {...register('customerName')} placeholder={t('res.namePh')} />
          {errors.customerName && <span style={errStyle}>{tErr(errors.customerName.message)}</span>}
        </div>

        <div className="form-group">
          <label>{t('res.phone')}</label>
          <input {...register('customerPhone')} type="tel" dir="ltr" placeholder="01XXXXXXXXX" />
          {errors.customerPhone && <span style={errStyle}>{tErr(errors.customerPhone.message)}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('res.date')}</label>
            <input {...register('dateOnly')} type="date" min={getToday()} />
            {errors.dateOnly && <span style={errStyle}>{tErr(errors.dateOnly.message)}</span>}
          </div>
          <div className="form-group">
            <label>{t('res.time')}</label>
            <select {...register('timeOnly')}>
              <option value="">{t('res.selectTime')}</option>
              {TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
            {errors.timeOnly && <span style={errStyle}>{tErr(errors.timeOnly.message)}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>{t('res.guests')}</label>
          <input {...register('numberOfGuests', { valueAsNumber: true })} type="number" min="1" max="20" placeholder="2" />
          {/* رسالة ثابتة: لو الخانة فاضية زود بتطلع NaN برسالة zod الافتراضية */}
          {errors.numberOfGuests && <span style={errStyle}>{t('err.guests')}</span>}
        </div>

        <div className="form-group">
          <label>{t('res.notes')}</label>
          <textarea {...register('notes')} placeholder={t('res.notesPh')} />
          {errors.notes && <span style={errStyle}>{tErr(errors.notes.message)}</span>}
        </div>

        {apiError && (
          <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.82rem' }}>
            {apiError}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting
            ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginInlineEnd: '0.4rem' }} />{t('res.sending')}</>
            : <>{t('res.confirm')} <i className="fa-solid fa-arrow-right arrow-flip" style={{ marginInlineStart: '0.4rem' }} /></>
          }
        </button>

        {success && (
          <div style={{ marginTop: '1rem', padding: '0.9rem', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
            <i className="fa-solid fa-check-circle" style={{ marginInlineEnd: '0.4rem' }} />
            {t('res.success')}
          </div>
        )}

      </form>
    </div>
  )
}