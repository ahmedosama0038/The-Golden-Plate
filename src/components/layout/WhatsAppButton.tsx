import { restaurantData } from '@/data/restaurant'

export default function WhatsAppButton() {
  const { whatsapp } = restaurantData.contact

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Contact us on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp" />
    </a>
  )
}