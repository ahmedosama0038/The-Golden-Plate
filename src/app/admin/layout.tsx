'use client'

import '@/app/admin/admin.css'
import Sidebar from '@/components/admin/Sidebar'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useNewOrderAlert } from '@/hooks/useNewOrderAlert'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isLoginPage = pathname === '/admin'

  // التنبيه شغال في أي صفحة أدمن ما عدا اللوجين
  const { soundOn, toggleSound } = useNewOrderAlert(!isLoginPage)

  return (
    <div className="adm-wrap">
      {!isLoginPage && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      <main className="adm-main" style={isLoginPage ? { width: '100%', padding: 0, margin: 0 } : {}}>

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

        {/* زرار تفعيل صوت الطلبات الجديدة */}
        {!isLoginPage && (
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle new order sound"
            style={{
              position: 'fixed',
              bottom: '1.2rem',
              right: '1.2rem',
              zIndex: 50,
              padding: '0.6rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--adm-gold)',
              background: soundOn ? 'var(--adm-gold)' : 'var(--adm-surface, #1e1e1e)',
              color: soundOn ? '#000' : 'var(--adm-gold)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <i className={`fa-solid ${soundOn ? 'fa-bell' : 'fa-bell-slash'}`} />{' '}
            {soundOn ? 'Alerts on' : 'Enable alerts'}
          </button>
        )}
      </main>
    </div>
  )
}