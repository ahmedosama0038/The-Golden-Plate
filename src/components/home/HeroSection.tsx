// ============================================================
//  HeroSection.tsx — نفس section.hero من index.html
// ============================================================
// Server Component — محتاجش browser
// الـ hero-content بيتحرك بـ CSS animation مش JS
// ============================================================

import Link from 'next/link'

const BADGES = [
  { icon: 'fa-solid fa-star',        text: '3× Culinary Award Winner'   },
  { icon: 'fa-solid fa-leaf',        text: 'Locally Sourced Ingredients' },
  { icon: 'fa-solid fa-wine-glass',  text: 'Curated Wine Selection'      },
]

export default function HeroSection() {
  return (
    // .hero من globals.css = min-height: 90vh + flex center
    <section className="hero">
      <div className="hero-content">

        {/* .hero-badges — الـ badges الصغيرة فوق العنوان */}
        <div className="hero-badges animate">
          {BADGES.map(({ icon, text }) => (
            <div key={text} className="hero-badge">
              <i className={icon} />
              {text}
            </div>
          ))}
        </div>

        {/* .hero h1 — العنوان الرئيسي */}
        {/* h1 span → color: var(--gold) + font-style: italic */}
        <h1>
          Where <span>Flavor</span> Meets Elegance
        </h1>

        {/* .hero p */}
        <p>
          An exquisite culinary journey crafted with passion, precision,
          and the finest ingredients. Taste the artistry in every bite.
        </p>

        {/* .btn-primary */}
        <Link href="/menu" className="btn-primary">
          Explore the Menu
        </Link>

        {/* السهم اللي بيتحرك لأسفل */}
        <div className="scroll-hint">
          <i className="fa-solid fa-chevron-down" />
        </div>

      </div>
    </section>
  )
}
