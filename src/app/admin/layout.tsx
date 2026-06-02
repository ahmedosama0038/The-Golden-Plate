'use client'

import '@/app/admin/admin.css'
import Sidebar from '@/components/admin/Sidebar'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // 🎯 الـ State السحرية للموبيل

  const isLoginPage = pathname === '/admin'

  return (
    <div className="adm-wrap">
      {/* باصينا الـ State والتحكم للـ Sidebar */}
      {!isLoginPage && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      <main className="adm-main" style={isLoginPage ? { width: '100%', padding: 0, margin: 0 } : {}}>
        
        {/* 🎯 هيدر علوي للموبيل فقط يحتوي على زرار الـ ☰ لفتح السايدبار */}
        {!isLoginPage && (
          <header className="adm-mobile-header">
            <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa-solid fa-bars" />
            </button>
            <div className="mobile-title">The Golden Plate</div>
          </header>
        )}

        <div className="adm-content-padding">
          {children}
        </div>
      </main>
    </div>
  )
}