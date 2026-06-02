// ============================================================
//  store/index.ts — الـ Redux Store الرئيسي
// ============================================================
//
//  Store = المستودع المركزي للـ State
//  زي database صغير في الـ browser
//
//  configureStore بيجمع كل الـ slices في store واحد
// ============================================================

import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // هنضيف هنا لاحقاً لما علياء تخلص الـ API:
    // admin: adminReducer,
  },
})

// TypeScript: استنتاج تلقائي لشكل الـ State والـ Dispatch
export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
