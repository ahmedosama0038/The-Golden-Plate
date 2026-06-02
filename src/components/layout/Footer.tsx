// ============================================================
//  Footer.tsx — نفس <footer> من كل صفحة HTML
//  Server Component (مفيش 'use client') → أسرع
// ============================================================

import Link from 'next/link'

const LINKS = [
  { href: '/',        label: 'Home'      },
  { href: '/menu',    label: 'Menu'      },
  { href: '/about',   label: 'Our Story' },
  { href: '/contact', label: 'Contact'   },
]

const SOCIALS = [
  { icon: 'fa-brands fa-instagram', href: '#', label: 'Instagram' },
  { icon: 'fa-brands fa-facebook-f', href: '#', label: 'Facebook'  },
  { icon: 'fa-brands fa-x-twitter',  href: '#', label: 'Twitter'   },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    // نفس <footer> من style.css بالظبط
    <footer>
      {/* footer::before الخط الذهبي فوقه → من CSS مش هنا */}

      <div className="footer-logo">The Golden Plate</div>
      <div className="footer-tagline">Crafted for the discerning palate.</div>

      <div className="footer-links">
        {LINKS.map(({ href, label }) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </div>

      {/* .socials من style.css */}
      <div className="socials">
        {SOCIALS.map(({ icon, href, label }) => (
          <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
            <i className={icon} />
          </a>
        ))}
      </div>

      <p className="copy">
        &copy; {year}{' '}
        <span className="footer-logo" style={{ fontSize: 'inherit', display: 'inline' }}>
          The Golden Plate
        </span>
        . All rights reserved.
      </p>
    </footer>
  )
}
