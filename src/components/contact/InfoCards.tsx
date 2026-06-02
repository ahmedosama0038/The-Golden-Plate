
// ============================================================
//  InfoCards.tsx — بيانات التواصل على الشمال
//  Server Component — بيانات ثابتة، مفيش تفاعل
// ============================================================

import { restaurantData } from '@/data/restaurant'

export default function InfoCards() {
  const { contact } = restaurantData

  return (
    <div className="info-cards animate">

      {/* العنوان */}
      <div className="info-card">
        <div className="info-icon">
          <i className="fa-solid fa-location-dot" />
        </div>
        <div>
          <div className="info-label">Our Address</div>
          <div className="info-val">{contact.address}</div>
        </div>
      </div>

      {/* التليفون */}
      <div className="info-card">
        <div className="info-icon">
          <i className="fa-solid fa-phone" />
        </div>
        <div>
          <div className="info-label">Phone</div>
          <a href={`tel:${contact.phone}`} className="info-val">
            {contact.phone}
          </a>
        </div>
      </div>

      {/* الإيميل */}
      <div className="info-card">
        <div className="info-icon">
          <i className="fa-solid fa-envelope" />
        </div>
        <div>
          <div className="info-label">Email</div>
          <a href={`mailto:${contact.email}`} className="info-val">
            {contact.email}
          </a>
        </div>
      </div>

      {/* واتساب */}
      <div className="info-card">
        <div className="info-icon">
          <i className="fa-brands fa-whatsapp" />
        </div>
        <div>
          <div className="info-label">WhatsApp Orders</div>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="info-val"
          >
            Message us to place an order
          </a>
        </div>
      </div>

      {/* ساعات العمل */}
      <div>
        <p style={{
          fontSize: '0.7rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '1.5px',
          color: 'var(--text-muted)', marginBottom: '0.7rem'
        }}>
          Opening Hours
        </p>
        <div className="hours-grid">
          <div className="hours-item">
            <div className="hours-day">Weekdays</div>
            <div className="hours-time">{contact.hoursWeekday}</div>
          </div>
          <div className="hours-item">
            <div className="hours-day">Weekend</div>
            <div className="hours-time">{contact.hoursWeekend}</div>
          </div>
        </div>
      </div>

    </div>
  )
}