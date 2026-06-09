import { NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'

// Simple in-memory cache
type GitHubContributor = {
  id: number
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

type FormattedContributor = {
  id: string
  name: string
  username: string
  avatar: string
  contributions: number
  role: string
  githubUrl: string
}

let contributorsCache: FormattedContributor[] | null = null
let lastFetched = 0
const CACHE_TTL = 3600 * 1000 // 1 hour

export async function GET() {
  try {
    const now = Date.now()
    if (contributorsCache && (now - lastFetched < CACHE_TTL)) {
      return NextResponse.json(contributorsCache)
    }

    const response = await fetch('https://api.github.com/repos/aryansondharva/TechAssassin/contributors', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TechAssassin-Community-Hub'
      },
      next: { revalidate: 3600 } // Next.js built-in revalidation
    })

    if (!response.ok) {
      // If GitHub API fails (rate limit), return fallback or empty array
      if (contributorsCache) return NextResponse.json(contributorsCache)
      return NextResponse.json([])
    }

    const githubContributors = await response.json() as GitHubContributor[]
    
    // Map GitHub data to our frontend format
    const formattedContributors = githubContributors.map((c) => ({
      id: String(c.id),
      name: c.login, // GitHub doesn't return full name in contributor list
      username: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
      role: c.login === 'aryansondharva' ? 'Lead Architect' : 'Contributor',
      githubUrl: c.html_url
    }))

    contributorsCache = formattedContributors
    lastFetched = now

    return NextResponse.json(formattedContributors)
  } catch (error) {
    return handleApiError(error)
  }
}
