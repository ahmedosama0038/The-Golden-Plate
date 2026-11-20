'use client'

import { useAnimate }  from '@/hooks/useAnimate'
import InfoCards       from '@/components/contact/InfoCards'
import ReservationForm from '@/components/contact/ReservationForm'
import MapSection      from '@/components/contact/MapSection'

export default function ContactClient() {
  // call client-only hook
  useAnimate()

  return (
    <>
      {/* Hero */}
      <section className="hero hero-sm">
        <div className="hero-content">
          <h1>Reserve a <span>Table</span></h1>
          <p>Book your table in a few clicks, or message us on WhatsApp for anything else.</p>
        </div>
      </section>

      {/* .contact-layout = grid: 1fr 1.4fr */}
      <div className="contact-layout">
        <InfoCards />
        <ReservationForm />
      </div>

      {/* الخريطة */}
      <MapSection />
    </>
  )
}
