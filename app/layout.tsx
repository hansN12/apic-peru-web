import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/app/hooks/useCart'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'APIC - Soluciones Audiovisuales y de Eventos',
  description: 'Fabricante peruano de soluciones audiovisuales y tecnología para eventos. Equipos cinematográficos, plataformas 360, fotocabinas y más.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/apic_icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apic_icon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/apic_icon.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apic_icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} bg-background scroll-smooth`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <CartProvider>
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
