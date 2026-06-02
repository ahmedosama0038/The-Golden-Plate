import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-box animate">
        <h2>Ready to Taste the Journey?</h2>
        <p>Step into our world. Reserve a table, explore our seasonal menu, or simply experience the art of dining reimagined.</p>
        <div className="cta-btns">
          <Link href="/menu" className="btn-primary">Explore the Menu</Link>
          <Link href="/contact" className="btn-outline">Make a Reservation</Link>
        </div>
      </div>
    </section>
  )
}
