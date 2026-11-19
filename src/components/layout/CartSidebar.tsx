'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useCart } from '@/hooks/useCart'
import CheckoutModal from './CheckoutModal'
import { CheckoutFormData } from '@/lib/schemas'
import { orderApi, type CreateOrderPayload } from '@/lib/api'
import { toast } from '@/lib/toast'

const CURRENCY = 'ج.م'
const WA_NUMBER = '201021245010'

export default function CartSidebar() {
  const {
    items, total, isOpen, close,
    removeFromCart, changeQuantity,
    buildWhatsAppMessage, buildExtrasNote, emptyCart,
  } = useCart()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // ── تحويل بيانات الفورم + الكارت لشكل ريم ──
  const buildPayload = (data: CheckoutFormData): CreateOrderPayload => {
    // الباك لسه مفيهوش إضافات، فبنكتبها في notes
    const extrasNote = buildExtrasNote()
    const notes = [
      data.notes?.trim(),
      extrasNote ? `الإضافات: ${extrasNote}` : '',
    ]
      .filter(Boolean)
      .join(' | ')

    const base = {
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone,
      order_type: data.order_type,
      notes: notes || undefined,
      items: items.map((item) => ({
        product_id: Number(item.menuItemId),
        size_id: item.sizeId ?? null,
        quantity: item.quantity,
      })),
    }

    if (data.order_type === 'delivery') {
      return { ...base, address: data.address?.trim() }
    }

    // الفورم بيطلّع HH:mm والباك عايز HH:mm:ss
    const time = data.timeOnly ?? ''
    return {
      ...base,
      numberOfGuests: Number(data.numberOfGuests),
      dateOnly: data.dateOnly,
      timeOnly: time.length === 5 ? `${time}:00` : time,
    }
  }

  const finishOrder = (data: CheckoutFormData) => {
    // لازم نبني رابط الواتساب قبل ما نفضّي الكارت
    const whatsappUrl = buildWhatsAppMessage(WA_NUMBER, CURRENCY, data)
    window.open(whatsappUrl, '_blank')
    emptyCart()
    setIsCheckoutModalOpen(false)
    close()
  }

  const orderMutation = useMutation({
    mutationFn: (data: CheckoutFormData) => orderApi.create(buildPayload(data)),

    // نجح: الطلب في الأدمن، ونفتح واتساب للمطعم
    onSuccess: (_res, data) => {
      toast.success(
        data.order_type === 'delivery'
          ? 'تم تسجيل الطلب بنجاح'
          : 'تم تسجيل الحجز بنجاح'
      )
      finishOrder(data)
    },

    // فشل: نعرض سبب ريم، ونفتح واتساب عشان الطلب ما يضيعش
    onError: (error: any, data) => {
      console.error('Order failed, falling back to WhatsApp:', error?.response?.data ?? error)
      toast.error(
        error?.response?.data?.message ?? 'تعذر تسجيل الطلب، هنكمل على واتساب'
      )
      finishOrder(data)
    },
  })

  const handleCheckout = () => {
    if (items.length === 0) return
    setIsCheckoutModalOpen(true)
  }

  const handleConfirmCheckout = (data: CheckoutFormData) => {
    orderMutation.mutate(data)
  }

  const disabled = items.length === 0 || orderMutation.isPending

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        id="cartOverlay"
        onClick={close}
      />

      <aside className={`cart-panel${isOpen ? ' open' : ''}`} id="cartPanel">

        <div className="cart-header">
          <h2><i className="fa-solid fa-bag-shopping" /> Your Selection</h2>
          <button className="icon-btn close-cart" onClick={close}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cart-body" id="cartBody">
          {items.length === 0 ? (
            <p className="cart-empty">Your selection is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="cart-item-name">
                    {item.name}
                    {item.size && <span className="size-tag">{item.size}</span>}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        + {item.selectedExtras.map((e) => e.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="cart-item-price">
                    {item.price.toFixed(2)} {CURRENCY} each
                  </div>
                </div>

                <div className="cart-qty-ctrl">
                  <button className="qty-btn" onClick={() => changeQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="del-btn" onClick={() => removeFromCart(item.id)}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span id="cartTotal">{total.toFixed(2)} {CURRENCY}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={disabled}
            style={{
              display: 'block', width: '100%', textAlign: 'center', border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {orderMutation.isPending ? 'Placing order...' : 'Place Order'}
          </button>
        </div>

      </aside>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmCheckout}
      />
    </>
  )
}