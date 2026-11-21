'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'

export default function CtaSection() {
  const { t } = useLang()

  return (
    <section className="cta-section">
      <div className="cta-box animate">
        <h2>{t('cta.title')}</h2>
        <p>{t('cta.desc')}</p>
        <div className="cta-btns">
          <Link href="/menu" className="btn-primary">{t('hero.cta')}</Link>
          <Link href="/reservation" className="btn-outline">{t('cta.reserve')}</Link>
        </div>
      </div>
    </section>
  )
}