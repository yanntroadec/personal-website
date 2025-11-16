'use client'

import { useState, useEffect } from 'react'

/**
 * GitHubRepo Interface
 * 
 * Structure for GitHub repository data from the API
 */
interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  owner: {
    login: string
    avatar_url: string
  }
  default_branch: string
}

/**
 * TreeItem Interface
 * 
 * Structure for file tree items from GitHub API
 */
interface TreeItem {
  path: string
  mode: string
  type: 'blob' | 'tree'
  sha: string
  size?: number
  url: string
}

/**
 * FileNode Interface
 * 
 * Structured representation of files and folders
 */
interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  size?: number
}

/**
 * GitHubRepoPreview Component
 * 
 * Fetches and displays GitHub repository information with stats and topics.
 * Shows loading state and error handling.
 */
export default function GitHubRepoPreview({ repoUrl, isVisible = true }: { repoUrl: string; isVisible?: boolean }) {
  const [repo, setRepo] = useState<GitHubRepo | null>(null)
  const [fileTree, setFileTree] = useState<FileNode | null>(null)
  const [showTree, setShowTree] = useState(false)
  const [loading, setLoading] = useState(true)
  const [treeLoading, setTreeLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Only fetch when visible and not already loaded
    if (!isVisible || hasLoaded) return

    async function fetchRepo() {
      try {
        // Extract owner and repo name from GitHub URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
        if (!match) {
          throw new Error('Invalid GitHub URL')
        }

        const [, owner, repoName] = match
        const apiUrl = `https://api.github.com/repos/${owner}/${repoName}`

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch repository')
        }

        const data = await response.json()
        setRepo(data)
        setHasLoaded(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRepo()
  }, [repoUrl, isVisible, hasLoaded])

  // Fetch file tree when user toggles the tree view
  async function fetchFileTree() {
    if (fileTree || !repo) return // Already loaded or no repo data
    
    setTreeLoading(true)
    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) return

      const [, owner, repoName] = match
      const treeUrl = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${repo.default_branch}?recursive=1`

      const response = await fetch(treeUrl)
      if (!response.ok) throw new Error('Failed to fetch file tree')

      const data = await response.json()
      
      // Build tree structure from flat list
      const rootNode: FileNode = {
        name: repoName,
        path: '',
        type: 'folder',
        children: []
      }

      // Sort items: folders first, then files
      const sortedItems = (data.tree as TreeItem[]).sort((a, b) => {
        if (a.type === b.type) return a.path.localeCompare(b.path)
        return a.type === 'tree' ? -1 : 1
      })

      // Build tree structure (limited to first 100 items to avoid overwhelming UI)
      const limitedItems = sortedItems.slice(0, 100)
      
      limitedItems.forEach((item: TreeItem) => {
        const parts = item.path.split('/')
        let currentNode = rootNode

        parts.forEach((part, index) => {
          const isLast = index === parts.length - 1
          const existingChild = currentNode.children?.find(child => child.name === part)

          if (existingChild) {
            currentNode = existingChild
          } else {
            const newNode: FileNode = {
              name: part,
              path: item.path,
              type: isLast && item.type === 'blob' ? 'file' : 'folder',
              children: isLast && item.type === 'blob' ? undefined : [],
              size: item.size
            }
            currentNode.children?.push(newNode)
            currentNode = newNode
          }
        })
      })

      setFileTree(rootNode)
    } catch (err) {
      console.error('Failed to fetch file tree:', err)
    } finally {
      setTreeLoading(false)
    }
  }

  // Toggle tree visibility and fetch if needed
  function toggleTree() {
    if (!showTree && !fileTree) {
      fetchFileTree()
    }
    setShowTree(!showTree)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
          <span className="text-slate-400 font-mono text-sm">Loading repository...</span>
        </div>
      </div>
    )
  }

  if (error || !repo) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg">
        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-400 font-mono text-sm">{error || 'Failed to load repository'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Repository Description */}
      {repo.description && (
        <div className="text-slate-300 font-mono text-sm leading-relaxed">
          {repo.description}
        </div>
      )}

      {/* Repository Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* Stars */}
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="font-mono">{repo.stargazers_count} stars</span>
        </div>

        {/* Forks */}
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          <span className="font-mono">{repo.forks_count} forks</span>
        </div>

        {/* Language */}
        {repo.language && (
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="font-mono">{repo.language}</span>
          </div>
        )}
      </div>

      {/* Topics/Tags */}
      {repo.topics && repo.topics.length > 0 && (
        <div>
          <div className="text-slate-500 font-mono text-xs mb-2 uppercase tracking-wider">
            Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-400 font-mono text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View on GitHub Button */}
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-lg text-slate-300 hover:text-cyan-400 font-mono text-sm transition-all duration-300 group"
      >
        <span>View on GitHub</span>
        <svg 
          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>

      {/* File Tree Toggle Button */}
      <button
        onClick={toggleTree}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-lg text-slate-400 hover:text-cyan-400 font-mono text-sm transition-all duration-300 group"
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${showTree ? 'rotate-90' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>{showTree ? 'Hide' : 'Show'} File Structure</span>
      </button>

      {/* File Tree Display */}
      {showTree && (
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {treeLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="text-slate-400 font-mono text-xs">Loading file tree...</span>
              </div>
            </div>
          ) : fileTree ? (
            <FileTreeNode node={fileTree} level={0} />
          ) : (
            <div className="text-slate-500 font-mono text-sm text-center py-4">
              Failed to load file tree
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * FileTreeNode Component
 * 
 * Recursively renders file tree structure with collapsible folders
 */
function FileTreeNode({ node, level }: { node: FileNode; level: number }) {
  const [isOpen, setIsOpen] = useState(level < 2) // Auto-open first 2 levels
  const hasChildren = node.children && node.children.length > 0
  const isFolder = node.type === 'folder'

  // Get file extension for icon display
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    // Color mapping for common file types
    const iconMap: Record<string, { icon: string; color: string }> = {
      'ts': { icon: 'TS', color: 'text-blue-400' },
      'tsx': { icon: 'TSX', color: 'text-blue-400' },
      'js': { icon: 'JS', color: 'text-yellow-400' },
      'jsx': { icon: 'JSX', color: 'text-yellow-400' },
      'py': { icon: 'PY', color: 'text-green-400' },
      'json': { icon: 'JSON', color: 'text-yellow-300' },
      'md': { icon: 'MD', color: 'text-slate-400' },
      'css': { icon: 'CSS', color: 'text-pink-400' },
      'html': { icon: 'HTML', color: 'text-orange-400' },
      'svg': { icon: 'SVG', color: 'text-purple-400' },
      'png': { icon: 'IMG', color: 'text-green-300' },
      'jpg': { icon: 'IMG', color: 'text-green-300' },
      'gif': { icon: 'IMG', color: 'text-green-300' },
    }

    return iconMap[ext || ''] || { icon: '•', color: 'text-slate-500' }
  }

  const fileInfo = getFileIcon(node.name)

  return (
    <div>
      {/* Node item */}
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-800/50 transition-colors cursor-pointer group ${
          level === 0 ? 'font-bold' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {/* Folder toggle icon or file indicator */}
        {isFolder ? (
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <span className={`text-xs font-mono font-bold flex-shrink-0 ${fileInfo.color}`}>
            {fileInfo.icon}
          </span>
        )}

        {/* Folder/File icon */}
        {isFolder ? (
          <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}

        {/* Name */}
        <span className={`font-mono text-sm truncate ${isFolder ? 'text-slate-300 group-hover:text-cyan-400' : 'text-slate-400'} transition-colors`}>
          {node.name}
        </span>

        {/* File size (only for files) */}
        {!isFolder && node.size && (
          <span className="text-slate-600 font-mono text-xs ml-auto flex-shrink-0">
            {formatBytes(node.size)}
          </span>
        )}
      </div>

      {/* Children (recursive) */}
      {isFolder && isOpen && hasChildren && (
        <div>
          {node.children!.map((child, index) => (
            <FileTreeNode key={`${child.path}-${index}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}