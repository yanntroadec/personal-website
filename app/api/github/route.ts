import { NextRequest, NextResponse } from 'next/server'

// Server-side GitHub API proxy — keeps GITHUB_TOKEN out of the browser bundle.
// Supports two query params:
//   repoUrl  = full GitHub repo URL (required)
//   tree     = "1" to fetch the recursive file tree instead of repo metadata

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const repoUrl = searchParams.get('repoUrl')
  const fetchTree = searchParams.get('tree') === '1'

  if (!repoUrl) {
    return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 })
  }

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 })
  }

  const [, owner, repoName] = match

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    let apiUrl: string
    if (fetchTree) {
      // Fetch default branch first, then tree
      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}`,
        { headers, next: { revalidate: 3600 } }
      )
      if (!repoRes.ok) throw new Error('Failed to fetch repository')
      const repoData = await repoRes.json()
      apiUrl = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${repoData.default_branch}?recursive=1`
    } else {
      apiUrl = `https://api.github.com/repos/${owner}/${repoName}`
    }

    const response = await fetch(apiUrl, {
      headers,
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from GitHub' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
