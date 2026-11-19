// ============================================================
//  hooks/useCart.ts — Custom Hook للكارت
//  بيجمع كل عمليات الكارت في مكان واحد
// ============================================================
import { useAppDispatch, useAppSelector } from './redux'
import {
  addItem, removeItem, updateQuantity,
  clearCart, toggleCart, openCart, closeCart,
  selectCartItems, selectCartCount, selectCartTotal, selectCartIsOpen,
} from '@/store/slices/cartSlice'
import type { CartItem, MenuItem, MenuItemSize, Extra } from '@/types'
import type { CheckoutFormData } from '@/lib/schemas'

export function useCart() {
  const dispatch = useAppDispatch()
  const items    = useAppSelector(selectCartItems)
  const count    = useAppSelector(selectCartCount)
  const total    = useAppSelector(selectCartTotal)
  const isOpen   = useAppSelector(selectCartIsOpen)

  const addToCart = (item: MenuItem, selectedSize?: MenuItemSize, selectedExtras?: Extra[]) => {
    const extrasTotal = selectedExtras?.reduce((sum, e) => sum + e.price, 0) ?? 0
    const price       = (selectedSize ? selectedSize.price : item.price) + extrasTotal

    // الـ id بيتبني من: المنتج + الحجم + الإضافات
    const extrasKey = (selectedExtras ?? [])
      .map((e) => e.id)
      .sort()
      .join('-')

    const baseId     = selectedSize ? `${item.id}_${selectedSize.label}` : String(item.id)
    const cartItemId = extrasKey ? `${baseId}_${extrasKey}` : baseId

    const cartItem: CartItem = {
      id:          String(cartItemId),
      menuItemId:  String(item.id),
      name:        item.name,
      price,
      image:       item.image,
      quantity:    1,
      size:        selectedSize?.label,
      selectedExtras: selectedExtras ?? [],
    }
    dispatch(addItem(cartItem))
  }

  const removeFromCart  = (id: string) => dispatch(removeItem(id))
  const changeQuantity  = (id: string, qty: number) => dispatch(updateQuantity({ id, quantity: qty }))
  const emptyCart       = () => dispatch(clearCart())
  const toggle          = () => dispatch(toggleCart())
  const open            = () => dispatch(openCart())
  const close           = () => dispatch(closeCart())

  const buildWhatsAppMessage = (
    waNumber: string,
    currency: string,
    customer: CheckoutFormData
  ) => {
    // 🆕 بنكتب الإضافات في سطر كل منتج
    const lines = items.map((i) => {
      const extras = i.selectedExtras?.length
        ? ` + ${i.selectedExtras.map((e) => e.name).join(', ')}`
        : ''
      return `• ${i.name}${i.size ? ` (${i.size})` : ''}${extras} x${i.quantity} = ${currency}${(i.price * i.quantity).toFixed(2)}`
    })

    const customerLines = [
      `👤 *Name:* ${customer.customerName}`,
      `📞 *Phone:* ${customer.customerPhone}`,
    ]

    const msg = [
      '🍽️ *New Order — The Golden Plate*',
      '',
      ...customerLines,
      '',
      ...lines,
      '',
      `*Total: ${currency}${total.toFixed(2)}*`,
    ].join('\n')

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
  }

  return { items, count, total, isOpen, addToCart, removeFromCart, changeQuantity, emptyCart, toggle, open, close, buildWhatsAppMessage }
}