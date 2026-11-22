'use client'

import { restaurantData } from '@/data/restaurant'
import { useLang } from '@/lib/i18n'

export default function MapSection() {
  const { contact } = restaurantData
  const { t } = useLang()

  // مفيش رابط خريطة حقيقي = مفيش خريطة
  if (!contact.mapEmbedUrl) return null

  return (
    <div style={{
      padding: '0 clamp(1.5rem,4vw,3rem) 5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div className="map-wrap">
        <iframe
          src={contact.mapEmbedUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t('info.mapTitle')}
        />
      </div>
    </div>
  )
}