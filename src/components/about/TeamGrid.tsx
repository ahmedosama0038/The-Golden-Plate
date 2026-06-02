
//  TeamGrid.tsx — "Meet Our Artisans" من about.html
//  Server Component — صور وأسماء ثابتة
// ============================================================

import { restaurantData } from '@/data/restaurant'

export default function TeamGrid() {
  const { team } = restaurantData

  return (
    <section className="section">

      <div className="section-header animate">
        <span className="section-tag">The Hands Behind the Magic</span>
        <h2>Meet Our Artisans</h2>
        <div className="divider-gold" />
      </div>

      {/* .team-grid = repeat(auto-fit, minmax(220px, 1fr)) */}
      <div className="team-grid">
        {team.map((member) => (
          <div key={member.id} className="team-card animate">

            {/* .team-img */}
            <div className="team-img">
              <img src={member.image} alt={member.name} loading="lazy" />
            </div>

            {/* .team-body */}
            <div className="team-body">
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}
