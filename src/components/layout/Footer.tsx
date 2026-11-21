'use client'

import Link from 'next/link'
import { useLang, type DictKey } from '@/lib/i18n'

const LINKS: { href: string; key: DictKey }[] = [
  { href: '/',            key: 'nav.home'        },
  { href: '/menu',        key: 'nav.menu'        },
  { href: '/about',       key: 'footer.story'    },
  { href: '/reservation', key: 'nav.reservation' },
  { href: '/admin',       key: 'footer.login'    },
]

const SOCIALS = [
  { icon: 'fa-brands fa-instagram',  href: '#', label: 'Instagram' },
  { icon: 'fa-brands fa-facebook-f', href: '#', label: 'Facebook'  },
  { icon: 'fa-brands fa-x-twitter',  href: '#', label: 'Twitter'   },
]

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-logo">The Golden Plate</div>
      <div className="footer-tagline">{t('footer.tagline')}</div>

      <div className="footer-links">
        {LINKS.map(({ href, key }) => (
          <Link key={href} href={href}>{t(key)}</Link>
        ))}
      </div>

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
        . {t('footer.rights')}
      </p>
    </footer>
  )
}