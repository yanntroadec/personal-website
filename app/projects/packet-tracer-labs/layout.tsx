import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cisco Packet Tracer Network Labs",
  description:
    "Enterprise network lab series featuring comprehensive Packet Tracer configurations for learning and practicing networking concepts.",
  alternates: { canonical: "/projects/packet-tracer-labs" },
}

export default function PacketTracerLabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
