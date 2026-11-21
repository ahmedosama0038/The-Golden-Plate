'use client'

import { restaurantData } from '@/data/restaurant'
import { useLang } from '@/lib/i18n'

export default function InfoCards() {
  const { contact } = restaurantData
  const { t } = useLang()

  return (
    <div className="info-cards animate">

      <div className="info-card">
        <div className="info-icon">
          <i className="fa-solid fa-location-dot" />
        </div>
        <div>
          <div className="info-label">{t('info.address')}</div>
          <div className="info-val">{contact.address}</div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-icon">
          <i className="fa-solid fa-phone" />
        </div>
        <div>
          <div className="info-label">{t('info.phone')}</div>
          <a href={`tel:${contact.phone}`} className="info-val" dir="ltr" style={{ display: 'inline-block' }}>
            {contact.phone}
          </a>
        </div>
      </div>

      <div className="info-card">
        <div className="info-icon">
          <i className="fa-solid fa-envelope" />
        </div>
        <div>
          <div className="info-label">{t('info.email')}</div>
          <a href={`mailto:${contact.email}`} className="info-val" dir="ltr" style={{ display: 'inline-block' }}>
            {contact.email}
          </a>
        </div>
      </div>

      <div className="info-card">
        <div className="info-icon">
          <i className="fa-brands fa-whatsapp" />
        </div>
        <div>
          <div className="info-label">{t('info.whatsapp')}</div>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="info-val"
          >
            {t('info.whatsappCta')}
          </a>
        </div>
      </div>

      <div>
        <p style={{
          fontSize: '0.7rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '1.5px',
          color: 'var(--text-muted)', marginBottom: '0.7rem'
        }}>
          {t('info.hours')}
        </p>
        <div className="hours-grid">
          <div className="hours-item">
            <div className="hours-day">{t('info.weekdays')}</div>
            <div className="hours-time">{contact.hoursWeekday}</div>
          </div>
          <div className="hours-item">
            <div className="hours-day">{t('info.weekend')}</div>
            <div className="hours-time">{contact.hoursWeekend}</div>
          </div>
        </div>
      </div>

    </div>
  )
}