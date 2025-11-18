import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generator
 *
 * Generates an XML sitemap for search engines to crawl.
 * Includes all static pages and dynamic routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yanntroadec.com'
  const currentDate = new Date()

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Project pages
  const projects = [
    {
      url: `${baseUrl}/projects/personal-website`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects/packet-tracer-labs`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects/caesar-cipher`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects/clockwise`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Blog articles
  const blogArticles = [
    {
      url: `${baseUrl}/blog/vlan-configuration`,
      lastModified: new Date('2025-11-17'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ios-fundamentals-advanced`,
      lastModified: new Date('2025-11-16'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ssh-configuration`,
      lastModified: new Date('2025-11-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  return [...routes, ...projects, ...blogArticles]
}
