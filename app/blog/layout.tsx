import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Blog",
    template: "%s | Yann Troadec",
  },
  description:
    "Technical articles about networking, Cisco IOS, VLAN configuration, SSH security, and TCP/IP protocols by Yann Troadec.",
  alternates: { canonical: "/blog" },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
