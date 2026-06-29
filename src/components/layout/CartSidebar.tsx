'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query' // 🆕 استورد useMutation
import { useCart } from '@/hooks/useCart'
import CheckoutModal from './CheckoutModal'
import { CheckoutFormData } from '@/lib/schemas'
import { orderApi } from '@/lib/api' // 🆕 استورد orderApi
import { toast } from '@/lib/toast'
const CURRENCY = '$'
const WA_NUMBER = '201021245010'

export default function CartSidebar() {
  const { items, total, isOpen, close, removeFromCart, changeQuantity, buildWhatsAppMessage, emptyCart } = useCart()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // 🆕 useMutation بدل async/await المباشر
  const orderMutation = useMutation({
    
    // mutationFn: الدالة اللي بتتنفذ لما نناديها
    // بتاخد customerData (الاسم والتليفون) من المودال
    mutationFn: async (customerData: CheckoutFormData) => {
      
      // الخطوة 1: سجّل العميل
      const customerResponse = await orderApi.createCustomer(
        customerData.customerName,
        customerData.customerPhone
      )
      const customerId = customerResponse?.data?.id ?? customerResponse?.id

      // الخطوة 2: حوّل items للشكل المطلوب
      const orderItems = items.map(item => ({
        product_id: Number(item.menuItemId),
        quantity: item.quantity
      }))

      // الخطوة 3: ابعت الأوردر
      return orderApi.createOrder(customerId, orderItems)
    },

    // onSuccess: بيتنفذ لو كل حاجة نجحت
    onSuccess: () => {
      emptyCart()
      setIsCheckoutModalOpen(false)
      close()
     toast.success('Order placed successfully!') 
    },

    // onError: بيتنفذ لو حصل أي error → fallback للواتساب
    onError: (error, customerData) => {
      console.error('Order failed, falling back to WhatsApp:', error)
      const whatsappUrl = buildWhatsAppMessage(WA_NUMBER, CURRENCY, customerData)
      window.open(whatsappUrl, '_blank')
      emptyCart()
      setIsCheckoutModalOpen(false)
      close()
    }
  })

  const handleCheckout = () => {
    if (items.length === 0) return
    setIsCheckoutModalOpen(true)
  }

  // 🆕 بدل ما نكتب الـ logic هنا، بنناديها بـ mutate فقط
  const handleConfirmCheckout = (customerData: CheckoutFormData) => {
    orderMutation.mutate(customerData)
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
            // 🆕 orderMutation.isPending جاهز تلقائياً من TanStack Query
            disabled={items.length === 0 || orderMutation.isPending}
            style={{
              display: 'block', width: '100%', textAlign: 'center', border: 'none',
              cursor: (items.length === 0 || orderMutation.isPending) ? 'not-allowed' : 'pointer',
              opacity: (items.length === 0 || orderMutation.isPending) ? 0.5 : 1
            }}
          >
            {/* 🆕 isPending بيتغير تلقائياً لما الـ mutation شغالة */}
           {orderMutation.isPending ? 'Placing order...' : 'Order via WhatsApp'}
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