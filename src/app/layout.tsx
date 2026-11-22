import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { LanguageProvider } from '@/lib/i18n'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import SplashScreen from '@/components/layout/SplashScreen'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | The Golden Plate',
    default: 'The Golden Plate | Fine Dining Experience',
  },
  description: 'An exquisite culinary journey crafted with passion, precision, and the finest ingredients.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={cairo.variable} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <Providers>
          <LanguageProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </LanguageProvider>
           <SplashScreen />
        </Providers>
      </body>
    </html>
  )
}