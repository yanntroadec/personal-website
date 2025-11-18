'use client'

/**
 * ProjectCard Component
 *
 * Displays a simplified project card with centered title, description,
 * and action buttons for project page and GitHub.
 */
export default function ProjectCard({
  title,
  description,
  githubUrl,
  projectUrl,
  isActive = false,
  onClick
}: {
  title: string
  description: string
  githubUrl?: string
  projectUrl?: string
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-slate-800/50 backdrop-blur-sm border-2 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 w-full h-[400px] flex items-center justify-center ${
        isActive
          ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 hover:border-cyan-300'
          : 'border-slate-700/50 hover:border-cyan-400/50'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center justify-center space-y-6 max-w-2xl mx-auto">
        {/* Project title */}
        <h3 className="text-3xl md:text-4xl font-bold font-mono text-white group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Project description */}
        <p className="text-slate-400 font-mono text-sm md:text-base leading-relaxed px-4">
          {description}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-4 pt-4">
          {/* View Project button */}
          {projectUrl && (
            <a
              href={projectUrl}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold font-mono rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50"
              aria-label="View project page"
            >
              View Project
            </a>
          )}

          {/* GitHub button */}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold font-mono rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slate-600/50 flex items-center gap-2"
              aria-label="View on GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.868 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.252-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.269.098-2.646 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.377.203 2.393.1 2.646.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.696-4.565 4.944.36.31.68.923.68 1.861 0 1.343-.012 2.427-.012 2.758 0 .267.18.579.688.481C19.135 20.202 22 16.447 22 12.02 22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}