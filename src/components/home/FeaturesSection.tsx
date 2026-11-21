'use client'

import { useLang, type DictKey } from '@/lib/i18n'

const FEATURES: { icon: string; title: DictKey; desc: DictKey; delay?: string }[] = [
  { icon: 'fa-solid fa-award',            title: 'features.f1.title', desc: 'features.f1.desc' },
  { icon: 'fa-solid fa-seedling',         title: 'features.f2.title', desc: 'features.f2.desc', delay: '0.1s' },
  { icon: 'fa-solid fa-champagne-glasses', title: 'features.f3.title', desc: 'features.f3.desc', delay: '0.2s' },
  { icon: 'fa-solid fa-utensils',         title: 'features.f4.title', desc: 'features.f4.desc', delay: '0.3s' },
]

export default function FeaturesSection() {
  const { t } = useLang()

  return (
    <section className="section section-bg">
      <div className="section-header animate">
        <span className="section-tag">{t('features.tag')}</span>
        <h2>{t('features.title')}</h2>
        <div className="divider-gold" />
      </div>

      <div className="features-grid">
        {FEATURES.map(({ icon, title, desc, delay }) => (
          <div
            key={title}
            className="feature-card animate"
            style={delay ? { transitionDelay: delay } : undefined}
          >
            <div className="feature-icon">
              <i className={icon} />
            </div>
            <h3>{t(title)}</h3>
            <p>{t(desc)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}