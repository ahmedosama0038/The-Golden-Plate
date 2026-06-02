'use client'

import { useAnimate } from '@/hooks/useAnimate'
import OriginSection from '@/components/about/OriginSection'
import Timeline      from '@/components/about/Timeline'
import StatsCounter  from '@/components/about/StatsCounter'
import TeamGrid      from '@/components/about/TeamGrid'
import Gallery       from '@/components/about/Gallery'
import CtaSection    from '@/components/home/CtaSection'

export default function AboutContent() {
  useAnimate()

  return (
    <>
      {/* Hero */}
      <section className="hero hero-sm">
        <div className="hero-content">
          <h1>A Legacy of Flavor, <span>Crafted with Soul</span></h1>
          <p>Where tradition meets innovation, and every plate tells a story of passion, precision, and purpose.</p>
        </div>
      </section>

      <OriginSection />
      <Timeline />
      <StatsCounter />
      <TeamGrid />
      <Gallery />
      <CtaSection />
    </>
  )
}
