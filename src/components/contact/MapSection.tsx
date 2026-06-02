
// ============================================================
//  MapSection.tsx — الخريطة
//  Server Component — iframe ثابت
// ============================================================

import { restaurantData } from '@/data/restaurant'

export default function MapSection() {
  const { contact } = restaurantData

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
          title="Restaurant Location"
        />
      </div>
    </div>
  )
}