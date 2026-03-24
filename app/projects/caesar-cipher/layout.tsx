import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Caesar Cipher Decryptor",
  description:
    "An automatic Caesar cipher decoder supporting four languages with frequency analysis. Try the interactive tool.",
  alternates: { canonical: "/projects/caesar-cipher" },
}

export default function CaesarCipherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
