'use client'
import { restaurantData } from '@/data/restaurant'
import { toWaNumber } from '@/lib/adminWhatsApp'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useCart } from '@/hooks/useCart'
import { useLang } from '@/lib/i18n'
import CheckoutModal from './CheckoutModal'
import { CheckoutFormData } from '@/lib/schemas'
import { orderApi, type CreateOrderPayload } from '@/lib/api'
import { toast } from '@/lib/toast'

const WA_NUMBER = toWaNumber(restaurantData.contact.whatsapp)

export default function CartSidebar() {
  const {
    items, total, isOpen, close,
    removeFromCart, changeQuantity,
    buildWhatsAppMessage, buildExtrasNote, emptyCart,
  } = useCart()
  const { t } = useLang()
  const router = useRouter()
  const currency = t('currency')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  const buildPayload = (data: CheckoutFormData): CreateOrderPayload => {
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

    const time = data.timeOnly ?? ''
    return {
      ...base,
      numberOfGuests: Number(data.numberOfGuests),
      dateOnly: data.dateOnly,
      timeOnly: time.length === 5 ? `${time}:00` : time,
    }
  }

  const finishOrder = (data: CheckoutFormData) => {
    const whatsappUrl = buildWhatsAppMessage(WA_NUMBER, currency, data)
    window.open(whatsappUrl, '_blank')
    emptyCart()
    setIsCheckoutModalOpen(false)
    close()
  }

  const orderMutation = useMutation({
    mutationFn: (data: CheckoutFormData) => orderApi.create(buildPayload(data)),

    // ← هنا: لما الطلب ينجح
    onSuccess: (_res, data) => {
      toast.orderSuccess(
        data.order_type === 'delivery'
          ? t('cart.toast.orderOk')
          : t('cart.toast.reservationOk'),
        t('trk.cta'),
        t('trk.close'),
        () => router.push(`/track?phone=${data.customerPhone}`)
      )
      finishOrder(data)
    },

    onError: (error: any, data) => {
      console.error('Order failed, falling back to WhatsApp:', error?.response?.data ?? error)
      toast.error(error?.response?.data?.message ?? t('cart.toast.failed'))
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
          <h2><i className="fa-solid fa-bag-shopping" /> {t('cart.title')}</h2>
          <button className="icon-btn close-cart" onClick={close}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cart-body" id="cartBody">
          {items.length === 0 ? (
            <p className="cart-empty">{t('cart.empty')}</p>
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
                    {item.price.toFixed(2)} {currency} {t('cart.each')}
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
            <span>{t('cart.total')}</span>
            <span id="cartTotal">{total.toFixed(2)} {currency}</span>
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
            {orderMutation.isPending ? t('cart.placing') : t('cart.placeOrder')}
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