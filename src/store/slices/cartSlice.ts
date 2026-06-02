// ============================================================
//  store/slices/cartSlice.ts — إدارة الكارت بـ Redux Toolkit
// ============================================================
//
//  المفاهيم الأساسية (اتعلمها كويس!):
//  ────────────────────────────────────
//  State   = البيانات المحفوظة  (إيه اللي في الكارت؟)
//  Action  = الأمر/الحدث        (عايز تضيف أيتم)
//  Reducer = الدالة اللي بتنفّذ الأمر وتغيّر الـ State
//  Slice   = الـ 3 دول في ملف واحد منظم
//
//  مثال حياتي:
//  State   = جيبتك (فيها X فلوس)
//  Action  = "اشتري عيش" (addItem)
//  Reducer = بيطرح السعر من جيبتك ويضيف العيش
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '@/types'

// ── شكل الـ State ──
interface CartState {
  items: CartItem[]   // مصفوفة الأيتمز في الكارت
  isOpen: boolean     // هل الكارت panel مفتوح؟
}

// ── القيمة الابتدائية ──
const initialState: CartState = {
  items: [],
  isOpen: false,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    // إضافة أيتم
    // PayloadAction<CartItem> = الـ action بيجيب معاه CartItem
    addItem(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload
      // نشوف لو موجود بالفعل (نفس الـ id)
      const existing = state.items.find((i) => i.id === newItem.id)
      if (existing) {
        existing.quantity += newItem.quantity  // زود الكمية بس
      } else {
        state.items.push(newItem)  // أضفه جديد
      }
    },

    // إزالة أيتم بالـ id
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },

    // تغيير الكمية
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
    },

    // تفريغ الكارت كله
    clearCart(state) { state.items = [] },

    // فتح/إغلاق الـ panel
    toggleCart(state) { state.isOpen = !state.isOpen },
    openCart(state)   { state.isOpen = true },
    closeCart(state)  { state.isOpen = false },
  },
})

// نصدّر الـ Actions عشان نستخدمها في الـ components
export const {
  addItem, removeItem, updateQuantity,
  clearCart, toggleCart, openCart, closeCart,
} = cartSlice.actions

// ── Selectors ──
// دوال بتقرأ من الـ state — بنعرّفها هنا مش في كل component
import type { RootState } from '../index'
export const selectCartItems  = (s: RootState) => s.cart.items
export const selectCartCount  = (s: RootState) => s.cart.items.reduce((n, i) => n + i.quantity, 0)
export const selectCartTotal  = (s: RootState) => s.cart.items.reduce((n, i) => n + i.price * i.quantity, 0)
export const selectCartIsOpen = (s: RootState) => s.cart.isOpen

export default cartSlice.reducer
