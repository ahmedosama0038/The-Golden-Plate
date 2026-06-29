'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import CheckoutModal from './CheckoutModal'
import { CheckoutFormData } from '@/lib/schemas'

const CURRENCY = '$'
const WA_NUMBER = '201021245010'

export default function CartSidebar() {
  const { items, total, isOpen, close, removeFromCart, changeQuantity, buildWhatsAppMessage, emptyCart } = useCart()

  // 🆕 الحالة اللي بتتحكم في فتح/قفل المودال
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // 🎯 دلوقتي الدالة دي بس بتفتح المودال، مش بتعمل الـ WhatsApp مباشرة
  const handleCheckout = () => {
      console.log('Checkout clicked, items:', items.length) // 🆕 سطر مؤقت
    if (items.length === 0) return
    setIsCheckoutModalOpen(true)
  }

  // 🆕 الدالة دي بتاخد بيانات العميل من المودال وتكمل الفلو القديم
  const handleConfirmCheckout = (customerData: CheckoutFormData) => {
    const whatsappUrl = buildWhatsAppMessage(WA_NUMBER, CURRENCY, customerData)

    window.open(whatsappUrl, '_blank')

    emptyCart()
    setIsCheckoutModalOpen(false)
    close()
  }

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
                + {item.selectedExtras.map(e => e.name).join(', ')}
              </div>
            )}
          </div>
          <div className="cart-item-price">
            {CURRENCY}{item.price.toFixed(2)} each
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
            <span id="cartTotal">{CURRENCY}{total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={items.length === 0}
            style={{
              display: 'block', width: '100%', textAlign: 'center', border: 'none',
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              opacity: items.length === 0 ? 0.5 : 1
            }}
          >
            Order via WhatsApp
          </button>
        </div>

      </aside>

      {/* 🆕 المودال بتاع بيانات العميل — بره الـ aside بس لسه جوه نفس الكومبوننت */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmCheckout}
      />
    </>
  )
}