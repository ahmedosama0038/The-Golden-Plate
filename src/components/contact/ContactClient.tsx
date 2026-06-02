'use client'


import { useAnimate } from '@/hooks/useAnimate'
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
          <h1>Get in <span>Touch</span></h1>
          <p>Reserve a table, ask a question, or simply say hello — we&apos;d love to hear from you.</p>
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
