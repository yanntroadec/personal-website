import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Yann Troadec, IT Technician from Rennes, France. Focused on networking with expertise in Cisco IOS, VLANs, TCP/IP, and CompTIA A+ certified.",
  alternates: { canonical: "/about" },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
