import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Personal Website",
  description:
    "Source code for this portfolio website built with Next.js, TypeScript, and Tailwind CSS. View the repository structure and technologies used.",
  alternates: { canonical: "/projects/personal-website" },
}

export default function PersonalWebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
