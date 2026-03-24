import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Networking Cables Reference",
  description:
    "Interactive networking cable reference covering copper (Cat5e-Cat8), multimode/singlemode fiber, serial, USB, and DAC/Twinax. Filter by type, speed, distance, protocol, and vendor.",
  alternates: { canonical: "/resources/networking-cables" },
}

export default function NetworkingCablesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
