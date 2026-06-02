// ============================================================
//  store/StoreProvider.tsx — ربط الـ Redux بالـ App
// ============================================================
//
//  'use client' ضرورية لأن Redux يحتاج browser environment
//  Next.js بـ default كل حاجة Server Component
//  لو ما قلناش 'use client' هيكسر!
// ============================================================

'use client'

import { Provider } from 'react-redux'
import { store } from './index'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
