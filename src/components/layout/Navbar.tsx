// ============================================================
//  Navbar.tsx
//  نفس الـ <nav class="navbar"> من كل صفحة HTML
// ============================================================
// 'use client' ضرورية عشان بنستخدم:
//   useState  → لفتح/إغلاق المنيو على موبايل
//   useEffect → لمتابعة الـ scroll وإضافة class "scrolled"
//   usePathname → عشان نعرف أي link هو "active"
// ============================================================
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { selectCartCount } from '@/store/slices/cartSlice'
import { useCart } from '@/hooks/useCart'

const NAV_LINKS = [
  { href: '/',        label: 'Home'    },
  { href: '/menu',    label: 'Menu'    },
  { href: '/about',   label: 'Story'   },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname  = usePathname()
  const cartCount = useAppSelector(selectCartCount)
  const { open }  = useCart()

  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  // scroll listener → يضيف class "scrolled" على الـ navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // أقفل المنيو تلقائي لما الصفحة تتغير
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    // className بيحاكي نفس .navbar و .navbar.scrolled من style.css
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">

      {/* ── Logo ── */}
      <Link href="/" className="nav-logo">
        The Golden Plate
      </Link>

      {/* ── Desktop Links + Mobile Overlay ── */}
      {/* نفس div.nav-links — بيتحول لـ overlay على موبايل */}
      <div className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? 'active' : ''}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* ── Actions ── */}
      <div className="nav-actions">

        {/* Cart Button */}
        <button className="icon-btn cart-toggle" aria-label="Cart" onClick={open}>
          <i className="fa-solid fa-bag-shopping" />
          {/* عداد الكارت — نفس .cart-count من style.css */}
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn icon-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`} />
        </button>

      </div>
    </nav>
  )
}
