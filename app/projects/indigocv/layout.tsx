import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IndigoCV",
  description:
    "A free, trilingual CV builder supporting English, French, and Spanish with real-time PDF preview and instant download.",
  alternates: { canonical: "/projects/indigocv" },
}

export default function IndigoCVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
