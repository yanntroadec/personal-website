'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <div className="w-full flex justify-center pt-8 z-20 relative">
      <Link
        href="/"
        className="group relative"
        style={{ width: 56, height: 56, display: 'block' }}
      >
        <div
          className="absolute inset-0 bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl group-hover:bg-cyan-400 group-hover:border-cyan-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/50"
          style={{
            transform: 'rotate(45deg)',
            width: 56,
            height: 56,
          }}
        ></div>
        
        <span className="absolute inset-0 flex items-center justify-center text-white group-hover:text-slate-900 transition-colors duration-300">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 9l3 3-3 3M12 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </Link>
    </div>
  )
}
