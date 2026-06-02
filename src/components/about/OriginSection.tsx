// ============================================================
//  OriginSection.tsx — "From a Modest Kitchen" من about.html
//  Server Component — بس نص وصور، مفيش تفاعل
// ============================================================

import Image from 'next/image'
import { restaurantData } from '@/data/restaurant'

export default function OriginSection() {
  const { story, story2 } = restaurantData.about

  return (
    <section className="section">
      <div className="narrow animate">

        {/* Tag + Title */}
        <span className="section-tag" style={{ display: 'block', marginBottom: '0.6rem' }}>
          The Beginning
        </span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.7rem, 2.8vw, 2.2rem)',
          marginBottom: '0.8rem'
        }}>
          From a Modest Kitchen to a Culinary Sanctuary
        </h2>
        <div className="divider-gold" style={{ margin: '1rem 0' }} />

        {/* النص */}
        <p className="lead">{story}</p>
        <p className="lead2">{story2}</p>

        {/* الصورتين باستخدام Next.js Image */}
        <div className="origin-grid">
          <div className="origin-img" style={{ position: 'relative', width: '100%', height: '350px' }}>
            <Image
              src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&w=600"
              alt="Kitchen"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={false} // الـ lazy loading شغال تلقائي هنا
            />
          </div>
          <div className="origin-img" style={{ position: 'relative', width: '100%', height: '350px' }}>
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
              alt="Dining"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  )
}