'use client'

import { useState } from 'react'

/**
 * AboutCard Component
 * 
 * Professional profile card displaying personal information,
 * contact details, and certifications with interactive elements.
 */
export default function AboutCard() {
  const [emailCopied, setEmailCopied] = useState(false)
  const [emailRevealed, setEmailRevealed] = useState(false)

  // Obfuscated email
  const obfuscatedEmail = '|dqq1wurdghf18Cjpdlo1frp'
  
  // Decode email
  const decodeEmail = () => {
    return obfuscatedEmail.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('')
  }

  // Reveal email
  const revealEmail = () => {
    setEmailRevealed(true)
  }

  // Copy email to clipboard
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(decodeEmail())
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border-2 border-cyan-400 shadow-lg shadow-cyan-400/20 rounded-xl p-8 md:p-12 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 w-full max-w-3xl">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
            Yann Troadec
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Age */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 font-mono text-xs uppercase tracking-wider">Age</div>
              <div className="text-slate-300 font-mono text-sm">35</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 font-mono text-xs uppercase tracking-wider">Location</div>
              <div className="text-slate-300 font-mono text-sm">Rennes, France</div>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-3 md:col-span-2">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <div className="text-slate-500 font-mono text-xs uppercase tracking-wider">Languages</div>
              <div className="text-slate-300 font-mono text-sm">French, English</div>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mb-8">
          <div className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-3">Certifications</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-400 font-mono text-sm">
              CompTIA A+
            </span>
            <span className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-400 font-mono text-sm">
              TOEIC (980/990)
            </span>
          </div>
        </div>

        {/* Decorative separator */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>

        {/* Contact Section */}
        <div className="text-center mb-6">
          <p className="text-slate-400 font-mono text-sm mb-4">
            For any work proposition, feel free to reach out via email or connect on social platforms.
          </p>

          {/* Email with copy button */}
          <div className="flex items-center justify-center gap-2 mb-6 px-2">
            {!emailRevealed ? (
              <button
                onClick={revealEmail}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-lg text-slate-300 hover:text-cyan-400 font-mono text-xs md:text-sm transition-all duration-300 group/reveal"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Click to reveal email</span>
              </button>
            ) : (
              <>
                <a
                  href={`mailto:${decodeEmail()}`}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-lg text-slate-300 hover:text-cyan-400 font-mono text-xs md:text-sm transition-all duration-300 flex-1 min-w-0"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{decodeEmail()}</span>
                </a>
                
                <button
                  onClick={copyEmail}
                  className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-lg text-slate-300 hover:text-cyan-400 transition-all duration-300 relative flex-shrink-0"
                  aria-label="Copy email to clipboard"
                >
                  {emailCopied ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/yanntroadec"
              target="_blank"
              rel="noopener noreferrer"
              className="group/social flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-lg transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="fill-slate-400 group-hover/social:fill-cyan-400 transition-colors duration-300"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.868 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.252-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.269.098-2.646 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.377.203 2.393.1 2.646.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.696-4.565 4.944.36.31.68.923.68 1.861 0 1.343-.012 2.427-.012 2.758 0 .267.18.579.688.481C19.135 20.202 22 16.447 22 12.02 22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="font-mono text-sm text-slate-400 group-hover/social:text-cyan-400 transition-colors duration-300">
                GitHub
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/yann-troadec/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/social flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-lg transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="fill-slate-400 group-hover/social:fill-cyan-400 transition-colors duration-300"
              >
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.65 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.75 1.75-1.75.97 0 1.76.78 1.76 1.75 0 .97-.79 1.76-1.76 1.76zm13.15 11.28h-3v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97v5.69h-3v-10h2.89v1.37h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.58z" />
              </svg>
              <span className="font-mono text-sm text-slate-400 group-hover/social:text-cyan-400 transition-colors duration-300">
                LinkedIn
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}