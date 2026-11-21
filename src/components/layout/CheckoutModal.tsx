'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutFormData } from '@/lib/schemas'
import { useLang, type DictKey } from '@/lib/i18n'

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
  const { t } = useLang()

  // بيترجم مفتاح الخطأ، ولو مش مفتاح بيعرض الرسالة زي ما هي
  const tErr = (msg?: string) => (msg ? (t(msg as DictKey) ?? msg) : '')

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
          <p>{t('checkout.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">

          {/* نوع الطلب */}
          <div className="co-tabs">
            <button
              type="button"
              className={`co-tab ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setValue('order_type', 'delivery')}
            >
              <i className="fa-solid fa-motorcycle" /> {t('checkout.delivery')}
            </button>
            <button
              type="button"
              className={`co-tab ${orderType === 'reservation' ? 'active' : ''}`}
              onClick={() => setValue('order_type', 'reservation')}
            >
              <i className="fa-solid fa-chair" /> {t('checkout.reservation')}
            </button>
          </div>

          {/* الاسم */}
          <div className="co-input-group">
            <input {...register('customerName')} placeholder=" " id="customerName" />
            <label htmlFor="customerName">{t('checkout.name')}</label>
            {errors.customerName && (
              <span className="co-error-text">{tErr(errors.customerName.message)}</span>
            )}
          </div>

          {/* التليفون */}
          <div className="co-input-group">
            <input {...register('customerPhone')} type="tel" placeholder=" " id="customerPhone" />
            <label htmlFor="customerPhone">{t('checkout.phone')}</label>
            {errors.customerPhone && (
              <span className="co-error-text">{tErr(errors.customerPhone.message)}</span>
            )}
          </div>

          {/* دليفري: العنوان */}
          {orderType === 'delivery' && (
            <div className="co-input-group">
              <input {...register('address')} placeholder=" " id="address" />
              <label htmlFor="address">{t('checkout.address')}</label>
              {errors.address && (
                <span className="co-error-text">{tErr(errors.address.message)}</span>
              )}
            </div>
          )}

          {/* حجز: عدد وتاريخ ووقت */}
          {orderType === 'reservation' && (
            <>
              <div className="co-field">
                <label htmlFor="numberOfGuests">{t('checkout.guests')}</label>
                <input
                  {...register('numberOfGuests')}
                  type="number"
                  min={1}
                  max={20}
                  id="numberOfGuests"
                />
                {errors.numberOfGuests && (
                  <span className="co-error-text">{tErr(errors.numberOfGuests.message)}</span>
                )}
              </div>

              <div className="co-field">
                <label htmlFor="dateOnly">{t('checkout.date')}</label>
                <input
                  {...register('dateOnly')}
                  type="date"
                  min={getToday()}
                  id="dateOnly"
                />
                {errors.dateOnly && (
                  <span className="co-error-text">{tErr(errors.dateOnly.message)}</span>
                )}
              </div>

              <div className="co-field">
                <label htmlFor="timeOnly">{t('checkout.time')}</label>
                <input {...register('timeOnly')} type="time" id="timeOnly" />
                {errors.timeOnly && (
                  <span className="co-error-text">{tErr(errors.timeOnly.message)}</span>
                )}
              </div>
            </>
          )}

          {/* ملاحظات (للاتنين) */}
          <div className="co-field">
            <label htmlFor="notes">{t('checkout.notes')}</label>
            <textarea {...register('notes')} id="notes" rows={2} />
            {errors.notes && (
              <span className="co-error-text">{tErr(errors.notes.message)}</span>
            )}
          </div>

          <div className="checkout-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              {t('checkout.cancel')}
            </button>
            <button type="submit" className="btn-confirm-order" disabled={isSubmitting}>
              {isSubmitting ? (
                <><i className="fa-solid fa-spinner fa-spin" /> {t('checkout.confirming')}</>
              ) : (
                <>{t('checkout.confirm')} <i className="fa-solid fa-arrow-right arrow-flip" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}