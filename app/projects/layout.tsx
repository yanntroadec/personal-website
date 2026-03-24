import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Projects",
    template: "%s | Yann Troadec",
  },
  description:
    "Portfolio of networking and development projects including Cisco Packet Tracer labs, a Caesar cipher toolkit, and a personal website built with Next.js.",
  alternates: { canonical: "/projects" },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
