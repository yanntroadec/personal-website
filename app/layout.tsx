import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";

/**
 * Metadata Configuration
 *
 * Defines SEO metadata, Open Graph tags, and Twitter cards
 * for the entire application.
 */
export const metadata: Metadata = {
  title: {
    default: "Yann Troadec - Systems, layer by layer",
    template: "%s | Yann Troadec",
  },
  description:
    "IT Technician focused on networking. Building hands-on skills through Cisco labs and documentation. CompTIA A+ certified.",
  authors: [{ name: "Yann Troadec" }],
  keywords: [
    "Yann Troadec",
    "IT technician",
    "network technician",
    "networking",
    "Cisco",
    "Cisco IOS",
    "VLAN",
    "TCP/IP",
    "switching",
    "routing",
    "CompTIA A+",
    "Packet Tracer",
    "Rennes",
    "France",
  ],

  // Open Graph metadata for social media sharing
  openGraph: {
    title: "Yann Troadec - Systems, layer by layer",
    description:
      "IT Technician focused on networking. Building hands-on skills through Cisco labs and documentation.",
    type: "website",
    url: "https://yanntroadec.com",
    siteName: "Yann Troadec Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yann Troadec - Systems, layer by layer",
      },
    ],
  },

  // Twitter card metadata
  twitter: {
    card: "summary_large_image",
    title: "Yann Troadec - Systems, layer by layer",
    description:
      "IT Technician focused on networking. Building hands-on skills through Cisco labs and documentation.",
    creator: "@yanntroadec",
    images: ["/og-image.png"],
  },

  // Search engine directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },

  // Additional metadata
  metadataBase: new URL("https://yanntroadec.com"),
  alternates: {
    canonical: "/",
  },
};

/**
 * Viewport Configuration
 *
 * Defines viewport settings for responsive design.
 * Separated from metadata in Next.js 14+
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
};

/**
 * Root Layout Component
 *
 * The main layout wrapper for all pages in the application.
 * Includes global styles and HTML structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yann Troadec",
    url: "https://yanntroadec.com",
    jobTitle: "IT Technician",
    description:
      "IT Technician focused on networking. Building hands-on skills through Cisco labs and documentation.",
    knowsAbout: [
      "Cisco IOS",
      "TCP/IP",
      "VLANs",
      "Switching",
      "Routing",
      "Network Troubleshooting",
      "Packet Tracer",
    ],
    sameAs: [
      "https://github.com/yanntroadec",
      "https://linkedin.com/in/yann-troadec",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rennes",
      addressCountry: "France",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
