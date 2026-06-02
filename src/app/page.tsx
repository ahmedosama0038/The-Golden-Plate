// ============================================================
//  app/page.tsx — Home Page
//  نفس index.html بالظبط مع نفس الـ CSS classes
// ============================================================
//
//  Server Component (مفيش 'use client')
//  الصفحة نفسها بتتبنى على السيرفر
//  لكن الـ components الجوا اللي محتاجة browser بتقول 'use client'
// ============================================================

import type { Metadata } from 'next'
import HeroSection       from '@/components/home/HeroSection'
import FeaturesSection   from '@/components/home/FeaturesSection'
import MenuPreview       from '@/components/home/MenuPreview'
import ReviewsSection    from '@/components/home/ReviewsSection'
import CtaSection        from '@/components/home/CtaSection'

export const metadata: Metadata = {
  title: 'The Golden Plate | Fine Dining Experience',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MenuPreview />
      <ReviewsSection />
      <CtaSection />
    </>
  )
}
