
// ============================================================
//  app/about/page.tsx — صفحة About
//  Server Component — بس بيجمع الـ components
// ============================================================

import type { Metadata } from 'next'
import AboutContent from '@/components/about/AboutContent'

export const metadata: Metadata = {
  title: 'Our Story',
}

export default function AboutPage() {
  return <AboutContent />
}