import type { Metadata } from 'next'
import ContactClient from '@/components/contact/ContactClient'

export const metadata: Metadata = {
  title: 'Reservation',
}

export default function ReservationPage() {
  return <ContactClient />
}