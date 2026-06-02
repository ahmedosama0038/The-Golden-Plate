
// ============================================================
//  app/contact/page.tsx — صفحة Contact
//  Server Component — يجمع الـ components ويمتلك `metadata`
// ============================================================

import type { Metadata } from 'next'
import ContactClient from '@/components/contact/ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return <ContactClient />
}