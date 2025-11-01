import './globals.css'
import type { Metadata, Viewport } from 'next'

/**
 * Metadata Configuration
 * 
 * Defines SEO metadata, Open Graph tags, and Twitter cards
 * for the entire application.
 */
export const metadata: Metadata = {
  title: 'Yann Troadec - Systems, layer by layer',
  description: 'Developer passionate about systems, networking, and building solutions.',
  authors: [{ name: 'Yann Troadec' }],
  keywords: ['Yann Troadec', 'developer', 'backend', 'Rust', 'Javascript', 'networking', 'IT', 'Rennes'],
  
  // Open Graph metadata for social media sharing
  openGraph: {
    title: 'Yann Troadec - Systems, layer by layer',
    description: 'Developer passionate about systems, networking, and building solutions.',
    type: 'website',
    url: 'https://yanntroadec.com',
    siteName: 'Yann Troadec',
    locale: 'en_US',
    images: [
      {
        url: '/favicon.svg',
        width: 512,
        height: 512,
        alt: 'Yann Troadec Logo',
      },
    ],
  },
  
  // Twitter card metadata
  twitter: {
    card: 'summary',
    title: 'Yann Troadec - Systems, layer by layer',
    description: 'Systems | Networking | Development',
    creator: '@yanntroadec',
  },
  
  // Search engine directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Favicon and icons (Next.js 16 way)
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  
  // Additional metadata
  metadataBase: new URL('https://yanntroadec.com'),
  alternates: {
    canonical: '/',
  },
}

/**
 * Viewport Configuration
 * 
 * Defines viewport settings for responsive design.
 * Separated from metadata in Next.js 14+
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
  ],
}

/**
 * Root Layout Component
 * 
 * The main layout wrapper for all pages in the application.
 * Includes global styles and HTML structure.
 * 
 * @param children - Page content to be rendered
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}