import type { Metadata } from 'next'
import { Geist, Geist_Mono, Montserrat } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: 'Safety',
  description: 'Incident management',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/IncidentesLogo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/IncidentesLogo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/IncidentesLogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" translate="no" className={montserrat.variable}>
      <head>
        <meta name="google" content="notranslate"/>
      </head>
      <body className={`font-montserrat antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
