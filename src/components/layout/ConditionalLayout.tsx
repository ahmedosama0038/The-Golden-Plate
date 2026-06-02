// ============================================================
//  ConditionalLayout.tsx
//  بيحدد لو الصفحة الحالية تاخد Navbar + Footer + Cart أو لأ
//
//  ليه محتاجينه؟
//  صفحات الـ Admin ملهاش Navbar ولا Footer عادي
//  عشان كده بنشوف الـ pathname ونقرر
// ============================================================
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import CartSidebar from './CartSidebar'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // صفحات الأدمن ملهاش الـ layout العادي
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    // الأدمن بيعمل layout خاص بيه في src/app/admin/layout.tsx
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
