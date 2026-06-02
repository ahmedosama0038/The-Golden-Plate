
// ============================================================
//  Timeline.tsx — "Milestones That Shaped Us" من about.html
//  Server Component — بيانات ثابتة، مفيش تفاعل
// ============================================================

import { restaurantData } from '@/data/restaurant'

export default function Timeline() {
  const { timeline } = restaurantData

  return (
    <section className="section">

      {/* Header */}
      <div className="section-header animate">
        <span className="section-tag">Our Journey</span>
        <h2>Milestones That Shaped Us</h2>
        <div className="divider-gold" />
      </div>

      {/* .timeline-wrap — الخط في النص + الأيتمز على جنبيه */}
      <div className="timeline-wrap">
        {timeline.map((item, index) => (
          <div key={item.year} className="tl-item animate">

            {/* السنة */}
            <div className="tl-year">{item.year}</div>

            {/* النقطة الذهبية على الخط */}
            <div className="tl-dot" />

            {/* الكارد */}
            <div className="tl-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}