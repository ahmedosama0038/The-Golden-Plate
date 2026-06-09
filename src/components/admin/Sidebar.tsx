'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  {
    section: 'Main',
    links: [
      { href: '/admin/dashboard',    label: 'Dashboard',    icon: 'fa-solid fa-chart-line'    },
      { href: '/admin/orders',       label: 'Orders',       icon: 'fa-solid fa-bag-shopping'  },
      { href: '/admin/reservations', label: 'Reservations', icon: 'fa-solid fa-calendar-days' },
      { href: '/admin/reviews',      label: 'Reviews',      icon: 'fa-solid fa-star'          },
      { href: '/admin/customers',    label: 'Customers',    icon: 'fa-solid fa-users'         },
    ],
  },
  {
    section: 'Content',
    links: [
      { href: '/admin/menu',         label: 'Menu Items',   icon: 'fa-solid fa-utensils'      },
      { href: '/admin/categories',   label: 'Categories',   icon: 'fa-solid fa-folder-open'   },
      { href: '/admin/extras',       label: 'Extras',       icon: 'fa-solid fa-plus-minus'    }, // ← أضفنا الإضافات هنا يا أبو حميد!
      { href: '/admin/hero',         label: 'Hero Section', icon: 'fa-solid fa-image'         },
      { href: '/admin/about',        label: 'About Page',   icon: 'fa-solid fa-circle-info'   },
      { href: '/admin/contact-info', label: 'Contact Info', icon: 'fa-solid fa-phone'         },
      { href: '/admin/images',       label: 'Images',       icon: 'fa-solid fa-photo-film'    },
    ],
  },
  {
    section: 'System',
    links: [
      { href: '/admin/account',      label: 'Account',      icon: 'fa-solid fa-user'          },
      { href: '/admin/settings',     label: 'Settings',     icon: 'fa-solid fa-gear'          },
    ],
  },
]

// 🎯 استقبلنا isOpen و onClose عشان الموبيل
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0'
    router.push('/admin')
  }

  return (
    <>
      {/* 🎯 الخلفية المظلمة اللي بتقفل السايدبار لما تضغط برا على الموبيل */}
      {isOpen && <div className="adm-sidebar-overlay" onClick={onClose} />}

      <aside className={`adm-sidebar ${isOpen ? 'mobile-open' : ''}`}>

        <div className="adm-logo">
          The Golden Plate
          <span>Admin Panel</span>
          {/* زرار قفل السايدبار على الموبيل بس */}
          <button className="adm-sidebar-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <nav className="adm-nav">
          {NAV.map(({ section, links }) => (
            <div key={section}>
              <div className="adm-nav-section">{section}</div>
              {links.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`adm-nav-link${pathname === href ? ' active' : ''}`}
                  onClick={onClose} // 🎯 يقفل السايدبار أوتوماتيك أول ما تضغط على لينك في الموبيل
                >
                  <i className={icon} />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            Logout
          </button>
        </div>

      </aside>
    </>
  )
}