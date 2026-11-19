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
  sizeId:      selectedSize?.id != null ? Number(selectedSize.id) : null, // 🆕
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
  const lines = items.map((i) => {
    const extras = i.selectedExtras?.length
      ? ` + ${i.selectedExtras.map((e) => e.name).join(', ')}`
      : ''
    return `- ${i.name}${i.size ? ` (${i.size})` : ''}${extras} x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} ${currency}`
  })

  const typeLines =
    customer.order_type === 'delivery'
      ? ['*Type:* Delivery', `*Address:* ${customer.address}`]
      : [
          '*Type:* Table Reservation',
          `*Guests:* ${customer.numberOfGuests}`,
          `*Date:* ${customer.dateOnly}`,
          `*Time:* ${customer.timeOnly}`,
        ]

  const notesLine = customer.notes?.trim()
    ? [`*Notes:* ${customer.notes.trim()}`]
    : []

  const msg = [
    '*New Order - The Golden Plate*',
    '',
    `*Name:* ${customer.customerName}`,
    `*Phone:* ${customer.customerPhone}`,
    ...typeLines,
    ...notesLine,
    '',
    ...lines,
    '',
    `*Total: ${total.toFixed(2)} ${currency}*`,
  ].join('\n')

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
}

  // 🆕 الباك لسه مفيهوش إضافات، فبنكتبها في notes
const buildExtrasNote = () =>
  items
    .filter((i) => i.selectedExtras && i.selectedExtras.length > 0)
    .map(
      (i) =>
        `${i.name}${i.size ? ` (${i.size})` : ''}: ${i.selectedExtras!
          .map((e) => e.name)
          .join(', ')}`
    )
    .join(' | ')

  return { items, count, total, isOpen, addToCart, removeFromCart, changeQuantity, emptyCart, toggle, open, close, buildWhatsAppMessage , buildExtrasNote }
}