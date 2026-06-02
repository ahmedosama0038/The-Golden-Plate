// ============================================================
//  store/cartSlice.ts  —  إدارة عربية التسوق بـ Redux Toolkit
// ============================================================
//
//  Redux Toolkit = أحدث طريقة لـ Redux (أسهل وأقل كود)
//
//  المفاهيم الأساسية:
//  ┌─────────────────────────────────────────────────┐
//  │  State   = البيانات (محتوى الكارت)              │
//  │  Action  = أمر (addItem, removeItem, ...)        │
//  │  Reducer = الدالة اللي بتعدّل الـ state          │
//  │  Slice   = State + Actions + Reducers في ملف واحد│
//  └─────────────────────────────────────────────────┘
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//  createSlice  = بتنشئ الـ slice بسهولة
//  PayloadAction = type للـ action اللي بتيجي بـ data

import type { CartItem } from '@/types'

// ─────────────────────────────────────────────────────────────
//  STATE SHAPE  —  شكل الـ state للكارت
// ─────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[]        // مصفوفة الأيتمز في الكارت
  isOpen: boolean          // هل الكارت panel مفتوح؟
}

// القيمة الابتدائية للـ state
const initialState: CartState = {
  items: [],
  isOpen: false,
}

// ─────────────────────────────────────────────────────────────
//  THE SLICE
// ─────────────────────────────────────────────────────────────

export const cartSlice = createSlice({
  name: 'cart',       // اسم الـ slice (بيظهر في Redux DevTools)
  initialState,

  // reducers = الدوال اللي بتغير الـ state
  // ملاحظة: Redux Toolkit بيستخدم Immer تحت الغطا
  // يعني ممكن تكتب state.items.push(...) وهو بيعملها immutable تلقائي
  reducers: {

    // ── addItem: إضافة أيتم للكارت ──
    addItem(state, action: PayloadAction<CartItem>) {
      // PayloadAction<CartItem> = الـ action.payload هو CartItem

      const newItem = action.payload

      // نشوف لو الأيتم موجود بالفعل (نفس الـ id)
      const existing = state.items.find((i) => i.id === newItem.id)

      if (existing) {
        // لو موجود → زود الكمية بس
        existing.quantity += newItem.quantity
      } else {
        // لو مش موجود → أضفه للمصفوفة
        state.items.push(newItem)
      }
    },

    // ── removeItem: إزالة أيتم من الكارت ──
    removeItem(state, action: PayloadAction<string>) {
      // PayloadAction<string> = الـ payload هو الـ id بس
      state.items = state.items.filter((i) => i.id !== action.payload)
    },

    // ── updateQuantity: تغيير كمية أيتم ──
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          // لو الكمية صفر أو أقل → إزله
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
    },

    // ── clearCart: تفريغ الكارت ──
    clearCart(state) {
      state.items = []
    },

    // ── toggleCart: فتح/إغلاق الـ panel ──
    toggleCart(state) {
      state.isOpen = !state.isOpen
    },

    // ── openCart / closeCart ──
    openCart(state) {
      state.isOpen = true
    },
    closeCart(state) {
      state.isOpen = false
    },
  },
})

// ─────────────────────────────────────────────────────────────
//  EXPORTS
// ─────────────────────────────────────────────────────────────

// نصدّر الـ actions عشان نستخدمها في الـ components
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions

// ─────────────────────────────────────────────────────────────
//  SELECTORS  —  دوال بتستخرج بيانات من الـ state
//  أسهل من كتابة state.cart.items في كل مكان
// ─────────────────────────────────────────────────────────────

import type { RootState } from './index'

// كل الأيتمز
export const selectCartItems = (state: RootState) => state.cart.items

// عدد الأيتمز الكلي (مجموع الكميات)
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

// المجموع الكلي بالسعر
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

// هل الكارت مفتوح؟
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen

export default cartSlice.reducer
