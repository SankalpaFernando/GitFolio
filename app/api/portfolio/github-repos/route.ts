import { cookies } from 'next/headers'
import { getStoredGitHubCredentials, fetchGitHubRepositories } from '@/lib/github'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('github_user_id')?.value

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get stored credentials which contains the GitHub token
    const credentials = await getStoredGitHubCredentials(userId)

    if (!credentials || !credentials.github_token) {
      return Response.json({ error: 'No GitHub token found' }, { status: 400 })
    }

    // Fetch repositories from GitHub
    const repos = await fetchGitHubRepositories(credentials.github_token)

    if (!repos) {
      return Response.json({ error: 'Failed to fetch repositories from GitHub' }, { status: 500 })
    }

    return Response.json(repos, { status: 200 })
  } catch (error) {
    console.error('[API] Error fetching GitHub repos:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
