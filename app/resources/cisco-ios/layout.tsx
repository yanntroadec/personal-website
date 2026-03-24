import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cisco IOS Reference",
  description:
    "Interactive Cisco IOS command reference for routers and switches. Browse all modes: User EXEC, Privileged EXEC, Global Config, Interface, OSPF, EIGRP, BGP, VLANs, ACLs and more.",
  alternates: { canonical: "/resources/cisco-ios" },
}

export default function CiscoIOSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
