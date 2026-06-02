// ============================================================
//  FeaturesSection.tsx — نفس section "Why Choose Us" من index.html
// ============================================================
// Server Component
// ============================================================

const FEATURES = [
  {
    icon: 'fa-solid fa-award',
    title: 'Award-Winning Cuisine',
    desc: 'Recognized three times for culinary excellence, our dishes are crafted to impress even the most discerning palate.',
    delay: '',
  },
  {
    icon: 'fa-solid fa-seedling',
    title: 'Farm-to-Table',
    desc: 'We partner with local farms and artisanal suppliers to bring you the freshest, most sustainable ingredients every day.',
    delay: '0.1s',
  },
  {
    icon: 'fa-solid fa-champagne-glasses',
    title: 'Curated Pairings',
    desc: 'Our head sommelier personally selects wines and cocktails to complement every dish on our ever-evolving menu.',
    delay: '0.2s',
  },
  {
    icon: 'fa-solid fa-utensils',
    title: 'Private Dining',
    desc: 'Host intimate gatherings or celebrations in our exclusive private dining rooms, tailored to your vision.',
    delay: '0.3s',
  },
]

export default function FeaturesSection() {
  return (
    // .section + .section-bg من globals.css
    <section className="section section-bg">

      {/* .section-header */}
      <div className="section-header animate">
        <span className="section-tag">Why Choose Us</span>
        <h2>An Unrivalled Experience</h2>
        {/* .divider-gold = الخط الذهبي تحت العنوان */}
        <div className="divider-gold" />
      </div>

      {/* .features-grid = repeat(auto-fit, minmax(230px, 1fr)) */}
      <div className="features-grid">
        {FEATURES.map(({ icon, title, desc, delay }) => (
          // .feature-card + .animate
          // style={{ transitionDelay }} = نفس style="transition-delay:0.1s" في HTML
          <div
            key={title}
            className="feature-card animate"
            style={delay ? { transitionDelay: delay } : undefined}
          >
            {/* .feature-icon = الأيقونة في المربع */}
            <div className="feature-icon">
              <i className={icon} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

    </section>
  )
}
