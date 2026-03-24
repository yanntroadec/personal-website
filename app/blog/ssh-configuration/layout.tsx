import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cisco SSH Deep Dive: Secure, Configure, and Harden Remote Access",
  description:
    "Deep dive into SSH configuration and security best practices on Cisco routers and switches.",
  alternates: { canonical: "/blog/ssh-configuration" },
}

export default function SSHConfigurationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "Cisco SSH Deep Dive: Secure, Configure, and Harden Remote Access",
    description:
      "Deep dive into SSH configuration and security best practices on Cisco routers and switches.",
    datePublished: "2025-11-01",
    author: {
      "@type": "Person",
      name: "Yann Troadec",
      url: "https://yanntroadec.com",
    },
    publisher: {
      "@type": "Person",
      name: "Yann Troadec",
      url: "https://yanntroadec.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://yanntroadec.com/blog/ssh-configuration",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
