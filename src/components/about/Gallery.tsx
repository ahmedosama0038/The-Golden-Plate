
// ============================================================
//  Gallery.tsx — "Step Into Our World" من about.html
//  Server Component — صور ثابتة
// ============================================================

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600', alt: 'Interior' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600',    alt: 'Table'    },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600', alt: 'Food' },
  { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600', alt: 'Bar'      },
]

export default function Gallery() {
  return (
    <section className="section">

      <div className="section-header animate">
        <span className="section-tag">The Atmosphere</span>
        <h2>Step Into Our World</h2>
        <div className="divider-gold" />
      </div>

      {/* .gallery-grid = repeat(4, 1fr) */}
      <div className="gallery-grid">
        {IMAGES.map(({ src, alt }, i) => (
          <div
            key={alt}
            className="gal-item animate"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <img src={src} alt={alt} loading="lazy" />
          </div>
        ))}
      </div>

    </section>
  )
}