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

export const metadata: Metadata = {
  title: {
    default: 'Desaparecidos Tamaulipas',
    template: '%s | Desaparecidos Tamaulipas',
  },
  description:
    'Plataforma ciudadana para la búsqueda de personas desaparecidas en Tamaulipas, México. Reporta, busca y recibe alertas.',
  keywords: ['personas desaparecidas', 'Tamaulipas', 'búsqueda', 'Reynosa', 'Matamoros', 'Nuevo Laredo'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Desaparecidos Tamaulipas',
    title: 'Desaparecidos Tamaulipas',
    description: 'Plataforma ciudadana para la búsqueda de personas desaparecidas en Tamaulipas.',
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
