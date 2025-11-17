'use client'

/**
 * ProjectCard Component
 *
 * Displays a project card with title, description, optional GitHub link,
 * and custom content. Features hover effects and responsive design.
 */
export default function ProjectCard({
  title,
  description,
  children,
  githubUrl,
  projectUrl,
  isActive = false,
  onClick
}: {
  title: string
  description: string
  children: React.ReactNode
  githubUrl?: string
  projectUrl?: string
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-slate-800/50 backdrop-blur-sm border-2 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 w-full md:max-w-2xl lg:max-w-3xl ${
        isActive
          ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 hover:border-cyan-300'
          : 'border-slate-700/50 hover:border-cyan-400/50'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header with title and optional links */}
        <div className="flex items-start justify-between mb-3">
          {/* Project title */}
          <h3 className="text-2xl md:text-3xl font-bold font-mono text-white group-hover:text-cyan-400 transition-colors duration-300 flex-1">
            {title}
          </h3>

          <div className="flex items-center gap-2">
            {/* Project page link button (if URL provided) */}
            {projectUrl && (
              <a
                href={projectUrl}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-300 group/project"
                aria-label="View project page"
              >
                {/* External link icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-400 group-hover/project:text-cyan-400 transition-colors duration-300"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}

            {/* GitHub link button (if URL provided) */}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors duration-300 group/github"
                aria-label="View on GitHub"
              >
                {/* GitHub icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="fill-slate-400 group-hover/github:fill-cyan-400 transition-colors duration-300"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.868 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.252-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.269.098-2.646 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.377.203 2.393.1 2.646.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.696-4.565 4.944.36.31.68.923.68 1.861 0 1.343-.012 2.427-.012 2.758 0 .267.18.579.688.481C19.135 20.202 22 16.447 22 12.02 22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Project description */}
        <p className="text-slate-400 mb-6 font-mono text-sm md:text-base leading-relaxed">
          {description}
        </p>
        
        {/* Decorative separator line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6"></div>
        
        {/* Custom content area with minimum height */}
        <div className="text-slate-300 min-h-[450px]">
          {children}
        </div>
      </div>
    </div>
  )
}