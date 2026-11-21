'use client'

import { useAnimate }  from '@/hooks/useAnimate'
import { useLang }     from '@/lib/i18n'
import InfoCards       from '@/components/contact/InfoCards'
import ReservationForm from '@/components/contact/ReservationForm'
import MapSection      from '@/components/contact/MapSection'

export default function ContactClient() {
  useAnimate()
  const { t } = useLang()

  return (
    <>
      <section className="hero hero-sm">
        <div className="hero-content">
          <h1>{t('res.title1')} <span>{t('res.title2')}</span></h1>
          <p>{t('res.subtitle')}</p>
        </div>
      </section>

      <div className="contact-layout">
        <InfoCards />
        <ReservationForm />
      </div>

      <MapSection />
    </>
  )
}
