'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Header Component
 * 
 * Site header with expandable navigation menu that reveals on hover/click.
 * Shows only relevant pages based on current location:
 * - Home page: Shows Projects, Blog, About
 * - Other pages: Home icon (clickable) + other two pages
 */
export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  // Determine which pages to show based on current path
  const getNavigationLinks = () => {
    if (pathname === '/') {
      // From home: show Projects, Blog, About
      return [
        { href: '/projects', label: 'Projects' },
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About' }
      ]
    } else if (pathname.startsWith('/projects')) {
      // From projects: show Blog, About (Home is the icon)
      return [
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About' }
      ]
    } else if (pathname.startsWith('/blog')) {
      // From blog: show Projects, About (Home is the icon)
      return [
        { href: '/projects', label: 'Projects' },
        { href: '/about', label: 'About' }
      ]
    } else if (pathname.startsWith('/about')) {
      // From about: show Projects, Blog (Home is the icon)
      return [
        { href: '/projects', label: 'Projects' },
        { href: '/blog', label: 'Blog' }
      ]
    }
    
    // Default: show all
    return [
      { href: '/projects', label: 'Projects' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' }
    ]
  }

  const navigationLinks = getNavigationLinks()
  const isHomePage = pathname === '/'

  return (
    <div className="w-full flex justify-center pt-8 z-50 relative">
      <div className="relative flex items-center">
        {/* Left navigation link (mobile only, hidden on home page) */}
        {!isHomePage && navigationLinks.length >= 1 && (
          <div className="md:hidden absolute right-20 flex items-center">
            <Link
              href={navigationLinks[0].href}
              className="group/nav relative block bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl px-3 py-2 hover:bg-cyan-400 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 w-20"
            >
              <span className="text-white group-hover/nav:text-slate-900 font-mono text-xs font-semibold transition-colors duration-300 whitespace-nowrap block text-center">
                {navigationLinks[0].label}
              </span>
            </Link>
          </div>
        )}

        {/* Main home button (always visible and clickable to return home) */}
        <Link
          href="/"
          className="group relative block z-20"
          style={{ width: 56, height: 56 }}
          aria-label="Home"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Diamond-shaped background with rotation and hover effects */}
          <div
            className="absolute inset-0 bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl group-hover:bg-cyan-400 group-hover:border-cyan-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/50"
            style={{
              transform: 'rotate(45deg)',
              width: 56,
              height: 56,
            }}
          ></div>
          
          {/* Terminal icon (counter-rotated to stay upright) */}
          <span className="absolute inset-0 flex items-center justify-center text-white group-hover:text-slate-900 transition-colors duration-300">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              {/* Terminal window outline */}
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              {/* Command prompt icon */}
              <path d="M7 9l3 3-3 3M12 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>

        {/* Right navigation link (mobile only, hidden on home page) */}
        {!isHomePage && navigationLinks.length >= 2 && (
          <div className="md:hidden absolute left-20 flex items-center">
            <Link
              href={navigationLinks[1].href}
              className="group/nav relative block bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl px-3 py-2 hover:bg-cyan-400 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 w-20"
            >
              <span className="text-white group-hover/nav:text-slate-900 font-mono text-xs font-semibold transition-colors duration-300 whitespace-nowrap block text-center">
                {navigationLinks[1].label}
              </span>
            </Link>
          </div>
        )}

        {/* Hover trigger area for menu (invisible, positioned to the right of home button) - Desktop only */}
        <div
          className="hidden md:block absolute left-14 w-16 h-14 z-10"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        />

        {/* Expandable navigation menu - Desktop only, shows on hover */}
        <div
          className={`hidden md:flex absolute top-0 left-14 items-center gap-3 transition-all duration-500 z-10 ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          style={{ paddingLeft: 56 }}
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group/nav relative block bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl px-5 py-3 hover:bg-cyan-400 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50"
            >
              <span className="text-white group-hover/nav:text-slate-900 font-mono text-sm font-semibold transition-colors duration-300 whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}