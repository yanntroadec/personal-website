import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yann Troadec - Systems, layer by layer',
  description: 'Developer passionate about systems, networking, and building solutions.',
  authors: [{ name: 'Yann Troadec' }],
  keywords: ['Yann Troadec', 'developer', 'backend', 'Rust', 'Javascript', 'networking', 'IT', 'Rennes'],
  openGraph: {
    title: 'Systems, layer by layer',
    description: 'Developer passionate about systems, networking, and building solutions.',
    type: 'website',
    url: 'https://yanntroadec.com',
    images: ['/favicon.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Yann Troadec - Systems, layer by layer',
    description: 'Systems | Networking | Development',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
