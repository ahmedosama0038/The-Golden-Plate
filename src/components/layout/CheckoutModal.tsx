'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutFormData } from '@/lib/schemas'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: CheckoutFormData) => void
}

// تاريخ النهاردة بصيغة YYYY-MM-DD (لمنع اختيار تاريخ فات)
const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CheckoutModal({ isOpen, onClose, onConfirm }: CheckoutModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      order_type: 'delivery',
      numberOfGuests: '2',
    },
  })

  const orderType = watch('order_type')

  if (!isOpen) return null

  const onSubmit = (data: CheckoutFormData) => {
    onConfirm(data)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <div className="checkout-overlay" onClick={handleClose}>
      <div className="checkout-modal animate-up" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <i className="fa-solid fa-utensils" />
          <h1>The Golden Plate</h1>
          <p>بياناتك عشان نأكد طلبك</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">

          {/* نوع الطلب */}
          <div className="co-tabs">
            <button
              type="button"
              className={`co-tab ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setValue('order_type', 'delivery')}
            >
              <i className="fa-solid fa-motorcycle" /> دليفري
            </button>
            <button
              type="button"
              className={`co-tab ${orderType === 'reservation' ? 'active' : ''}`}
              onClick={() => setValue('order_type', 'reservation')}
            >
              <i className="fa-solid fa-chair" /> حجز طاولة
            </button>
          </div>

          {/* الاسم */}
          <div className="co-input-group">
            <input {...register('customerName')} placeholder=" " id="customerName" />
            <label htmlFor="customerName">الاسم</label>
            {errors.customerName && (
              <span className="co-error-text">{errors.customerName.message}</span>
            )}
          </div>

          {/* التليفون */}
          <div className="co-input-group">
            <input {...register('customerPhone')} type="tel" placeholder=" " id="customerPhone" />
            <label htmlFor="customerPhone">رقم التليفون</label>
            {errors.customerPhone && (
              <span className="co-error-text">{errors.customerPhone.message}</span>
            )}
          </div>

          {/* دليفري: العنوان */}
          {orderType === 'delivery' && (
            <div className="co-input-group">
              <input {...register('address')} placeholder=" " id="address" />
              <label htmlFor="address">العنوان بالتفصيل</label>
              {errors.address && (
                <span className="co-error-text">{errors.address.message}</span>
              )}
            </div>
          )}

          {/* حجز: عدد وتاريخ ووقت */}
          {orderType === 'reservation' && (
            <>
              <div className="co-field">
                <label htmlFor="numberOfGuests">عدد الأشخاص</label>
                <input
                  {...register('numberOfGuests')}
                  type="number"
                  min={1}
                  max={20}
                  id="numberOfGuests"
                />
                {errors.numberOfGuests && (
                  <span className="co-error-text">{errors.numberOfGuests.message}</span>
                )}
              </div>

              <div className="co-field">
                <label htmlFor="dateOnly">تاريخ الحجز</label>
                <input
                  {...register('dateOnly')}
                  type="date"
                  min={getToday()}
                  id="dateOnly"
                />
                {errors.dateOnly && (
                  <span className="co-error-text">{errors.dateOnly.message}</span>
                )}
              </div>

              <div className="co-field">
                <label htmlFor="timeOnly">وقت الحجز</label>
                <input {...register('timeOnly')} type="time" id="timeOnly" />
                {errors.timeOnly && (
                  <span className="co-error-text">{errors.timeOnly.message}</span>
                )}
              </div>
            </>
          )}

          {/* ملاحظات (للاتنين) */}
          <div className="co-field">
            <label htmlFor="notes">ملاحظات (اختياري)</label>
            <textarea {...register('notes')} id="notes" rows={2} />
            {errors.notes && (
              <span className="co-error-text">{errors.notes.message}</span>
            )}
          </div>

          <div className="checkout-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-confirm-order" disabled={isSubmitting}>
              {isSubmitting ? (
                <><i className="fa-solid fa-spinner fa-spin" /> جاري التأكيد...</>
              ) : (
                <>تأكيد الطلب <i className="fa-solid fa-arrow-right" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}