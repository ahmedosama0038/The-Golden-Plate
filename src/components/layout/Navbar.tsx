'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { selectCartCount } from '@/store/slices/cartSlice'
import { useCart } from '@/hooks/useCart'
import { useLang, type DictKey } from '@/lib/i18n'

const NAV_LINKS: { href: string; key: DictKey }[] = [
  { href: '/',            key: 'nav.home'        },
  { href: '/menu',        key: 'nav.menu'        },
  { href: '/about',       key: 'nav.story'       },
  { href: '/reservation', key: 'nav.reservation' },
]

export default function Navbar() {
  const pathname  = usePathname()
  const cartCount = useAppSelector(selectCartCount)
  const { open }  = useCart()
  const { lang, setLang, t } = useLang()

  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">

      <Link href="/" className="nav-logo">
        The Golden Plate
      </Link>

      <div className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
        {NAV_LINKS.map(({ href, key }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={isActive ? 'active' : ''}>
              {t(key)}
            </Link>
          )
        })}
      </div>

      <div className="nav-actions">

        {/* Language toggle: بيعرض اللغة اللي هتروحلها */}
        <button
          className="icon-btn lang-toggle"
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
        <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
        </button>

        <button className="icon-btn cart-toggle" aria-label="Cart" onClick={open}>
          <i className="fa-solid fa-bag-shopping" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>

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