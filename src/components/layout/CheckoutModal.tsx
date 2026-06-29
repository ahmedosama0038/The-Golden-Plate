'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, CheckoutFormData } from '@/lib/schemas'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: CheckoutFormData) => void
}

export default function CheckoutModal({ isOpen, onClose, onConfirm }: CheckoutModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

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

          <div className="co-input-group">
            <input
              {...register('customerName')}
              placeholder=" "
              id="customerName"
            />
            <label htmlFor="customerName">الاسم</label>
            {errors.customerName && (
              <span className="co-error-text">{errors.customerName.message}</span>
            )}
          </div>

          <div className="co-input-group">
            <input
              {...register('customerPhone')}
              type="tel"
              placeholder=" "
              id="customerPhone"
            />
            <label htmlFor="customerPhone">رقم التليفون</label>
            {errors.customerPhone && (
              <span className="co-error-text">{errors.customerPhone.message}</span>
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