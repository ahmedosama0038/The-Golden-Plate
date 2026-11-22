'use client'

import Link from 'next/link'
import { useLang, type DictKey } from '@/lib/i18n'
const BADGES: { icon: string; key: DictKey }[] = [
  { icon: 'fa-solid fa-bag-shopping',   key: 'hero.badge1' },
  { icon: 'fa-solid fa-calendar-check', key: 'hero.badge2' },
  { icon: 'fa-solid fa-truck-fast',     key: 'hero.badge3' },
]

export default function HeroSection() {
  const { t } = useLang()

  return (
    <section className="hero">
      <div className="hero-content">

        <div className="hero-badges animate">
          {BADGES.map(({ icon, key }) => (
            <div key={key} className="hero-badge">
              <i className={icon} />
              {t(key)}
            </div>
          ))}
        </div>

        <h1>
          {t('hero.title1')} <span>{t('hero.title2')}</span> {t('hero.title3')}
        </h1>

        <p>{t('hero.subtitle')}</p>

        <Link href="/menu" className="btn-primary">
          {t('hero.cta')}
        </Link>

        <div className="scroll-hint">
          <i className="fa-solid fa-chevron-down" />
        </div>

      </div>
    </section>
  )
}