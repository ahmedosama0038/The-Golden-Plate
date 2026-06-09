// ============================================================
//  CartSidebar.tsx — نفس .cart-overlay + .cart-panel من style.css
// ============================================================
'use client'

import { useCart } from '@/hooks/useCart'

const CURRENCY = '$'
const WA_NUMBER = '201021245010'

export default function CartSidebar() {
  const { items, total, isOpen, close, removeFromCart, changeQuantity, buildWhatsAppMessage, emptyCart } = useCart()

  // 🎯 الدالة الذكية لترتيب خطوات الطلب
  const handleCheckout = () => {
    if (items.length === 0) return

    // 1️⃣ أولاً: بنجيب رابط الواتساب الجاهز المبني بالداتا الحالية
    const whatsappUrl = buildWhatsAppMessage(WA_NUMBER, CURRENCY)

    // 2️⃣ ثانياً: بنفتح الرابط في صفحة جديدة
    window.open(whatsappUrl, '_blank')

    // 3️⃣ ثالثاً: بنصفر السلة ونقفل الـ Sidebar براحتنا على نظافة
    emptyCart()
    close()
  }

  return (
    <>
      {/* .cart-overlay — الخلفية الداكنة */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        id="cartOverlay"
        onClick={close}
      />

      {/* .cart-panel */}
      <aside className={`cart-panel${isOpen ? ' open' : ''}`} id="cartPanel">

        {/* .cart-header */}
        <div className="cart-header">
          <h2>
            <i className="fa-solid fa-bag-shopping" /> Your Selection
          </h2>
          <button className="icon-btn close-cart" onClick={close}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* .cart-body */}
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
  
  {/* ← أضف السطر ده */}
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

                {/* .cart-qty-ctrl */}
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

        {/* .cart-footer */}
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span id="cartTotal">{CURRENCY}{total.toFixed(2)}</span>
          </div>
          
          {/* 👈 حولناه لـ button عشان نتحكم في الـ Flow بشكل سليم وميطلعش الـ WhatsApp فاضي */}
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={items.length === 0}
            style={{ 
              display: 'block', 
              width: '100%', 
              textAlign: 'center', 
              border: 'none', 
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              opacity: items.length === 0 ? 0.5 : 1
            }}
          >
            Order via WhatsApp
          </button>
        </div>

      </aside>
    </>
  )
}