'use client'
// ============================================================
//  lib/providers.tsx  —  كل الـ Providers في مكان واحد
// ============================================================
//
//  'use client' ← ضرورية هنا
//  Next.js App Router = كل component بيكون Server Component بـ default
//  Redux و TanStack Query محتاجين browser (client) عشان يشتغلوا
//  عشان كده لازم نقول لـ Next.js إن ده Client Component
//
//  الـ Providers Pattern:
//  بدل ما نحط كل provider في كل page، نعملهم wrapper واحد
//  وندي layout.tsx ده
// ============================================================

import { Provider } from 'react-redux'
// Provider من react-redux = بيخلي كل الـ components الجوا تقدر توصل للـ store

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// QueryClientProvider = نفس الفكرة لكن لـ TanStack Query
// QueryClient = الـ cache manager للـ API calls

import { store } from '@/store'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // useState لـ QueryClient عشان ما يتشاركش بين الـ requests في الـ server
  // كل user يحصل على instance منفصلة
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime = لما تعمل re-render، ما يعيدش الـ fetch لو البيانات لسه جديدة
            staleTime: 60 * 1000, // 60 ثانية
          },
        },
      })
  )

  return (
    // Redux Provider الخارجي
    <Provider store={store}>
      {/* TanStack Query Provider الداخلي */}
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}
