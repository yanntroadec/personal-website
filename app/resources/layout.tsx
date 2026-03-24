import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Resources",
    template: "%s | Yann Troadec",
  },
  description:
    "Interactive technical references covering networking. Browse Cisco IOS commands, networking cables reference, and more tools.",
  alternates: { canonical: "/resources" },
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
