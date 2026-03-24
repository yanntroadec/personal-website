import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cisco IOS Fundamentals and Advanced Techniques",
  description:
    "Master the essentials of Cisco IOS with comprehensive coverage of navigation, configuration modes, and advanced command-line techniques.",
  alternates: { canonical: "/blog/ios-fundamentals-advanced" },
}

export default function IOSFundamentalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Cisco IOS Fundamentals and Advanced Techniques",
    description:
      "Master the essentials of Cisco IOS with comprehensive coverage of navigation, configuration modes, and advanced command-line techniques.",
    datePublished: "2025-11-16",
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
      "@id": "https://yanntroadec.com/blog/ios-fundamentals-advanced",
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
