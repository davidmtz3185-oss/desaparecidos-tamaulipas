import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://desaparecidostamaulipas.mx'

export const metadata: Metadata = {
  title: {
    default: 'Desaparecidos Tamaulipas',
    template: '%s | Desaparecidos Tamaulipas',
  },
  description:
    'Plataforma ciudadana para la búsqueda de personas desaparecidas en Tamaulipas, México. Reporta, busca y recibe alertas.',
  keywords: ['personas desaparecidas', 'Tamaulipas', 'búsqueda', 'Reynosa', 'Matamoros', 'Nuevo Laredo'],
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: APP_URL,
    siteName: 'Desaparecidos Tamaulipas',
    title: 'Desaparecidos Tamaulipas — Búsqueda de personas',
    description: 'Plataforma ciudadana para la búsqueda de personas desaparecidas en Tamaulipas. Reporta, busca y recibe alertas por tu municipio.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desaparecidos Tamaulipas',
    description: 'Plataforma ciudadana para la búsqueda de personas desaparecidas en Tamaulipas.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
