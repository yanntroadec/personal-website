import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VLAN Configuration Essentials: Segmenting Your Network",
  description:
    "Comprehensive guide on configuring VLANs on Cisco switches, covering VLAN basics, trunking, and best practices for network segmentation.",
  alternates: { canonical: "/blog/vlan-configuration" },
}

export default function VlanConfigurationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "VLAN Configuration Essentials: Segmenting Your Network",
    description:
      "Comprehensive guide on configuring VLANs on Cisco switches, covering VLAN basics, trunking, and best practices for network segmentation.",
    datePublished: "2025-11-17",
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
      "@id": "https://yanntroadec.com/blog/vlan-configuration",
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
