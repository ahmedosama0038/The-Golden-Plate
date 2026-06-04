// ============================================================
//  app/layout.tsx — الـ Root Layout
//  بيلف كل الـ app — بيتحمّل مرة واحدة بس
// ============================================================
export const dynamic = "force-dynamic";
import type { Metadata } from 'next'
import './globals.css'
// 💡 1. استيراد الـ Providers الشامل الجديد من الـ lib
import { Providers } from '@/lib/providers' 
import ConditionalLayout from '@/components/layout/ConditionalLayout'

export const metadata: Metadata = {
  title: {
    template: '%s | The Golden Plate',
    default: 'The Golden Plate | Fine Dining Experience',
  },
  description: 'An exquisite culinary journey crafted with passion, precision, and the finest ingredients.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          />
      </head>
      <body>
        {/*
          💡 2. استبدلنا StoreProvider بـ Providers الجديد
          كده الـ Redux والـ TanStack Query شغالين مع بعض في نفس الوقت وساندين التطبيق كله
        */}
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}