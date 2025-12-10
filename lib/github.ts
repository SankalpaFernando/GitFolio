import { supabase } from './supabase'

interface GitHubCredentials {
  user_id?: string
  github_username: string
  github_token: string
  github_user_id: number
  github_avatar_url: string
  github_bio?: string
  github_public_repos: number
  github_followers: number
  github_following: number
  github_created_at: string
  stored_at: string
}

// Generate GitHub OAuth URL
export function generateGitHubAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI
  const scope = 'user:email,read:user,public_repo'
  
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
}

// Exchange GitHub code for access token
export async function exchangeGitHubCode(code: string): Promise<{ access_token: string; token_type: string } | null> {
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    if (!response.ok) {
      console.error('Failed to exchange code for token:', response.statusText)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error exchanging GitHub code:', error)
    return null
  }
}

// Fetch GitHub user data using access token
export async function fetchGitHubUserData(accessToken: string): Promise<any | null> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch GitHub user data:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching GitHub user data:', error)
    return null
  }
}

// Store GitHub credentials in Supabase
export async function storeGitHubCredentials(
  userId: string,
  githubData: any,
  accessToken: string
): Promise<GitHubCredentials | null> {
  try {
    const credentials: GitHubCredentials = {
      user_id: userId,
      github_username: githubData.login,
      github_token: accessToken,
      github_user_id: githubData.id,
      github_avatar_url: githubData.avatar_url,
      github_bio: githubData.bio,
      github_public_repos: githubData.public_repos,
      github_followers: githubData.followers,
      github_following: githubData.following,
      github_created_at: githubData.created_at,
      stored_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('github_credentials')
      .insert([credentials])
      .select()
      .single()

    if (error) {
      console.error('Error storing GitHub credentials:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error storing GitHub credentials:', error)
    return null
  }
}

// Get stored GitHub credentials from Supabase
export async function getStoredGitHubCredentials(userId: string): Promise<GitHubCredentials | null> {
  try {
    const { data, error } = await supabase
      .from('github_credentials')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error retrieving GitHub credentials:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error retrieving GitHub credentials:', error)
    return null
  }
}

// Update GitHub credentials in Supabase
export async function updateGitHubCredentials(
  userId: string,
  credentials: Partial<GitHubCredentials>
): Promise<GitHubCredentials | null> {
  try {
    const { data, error } = await supabase
      .from('github_credentials')
      .update(credentials)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating GitHub credentials:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating GitHub credentials:', error)
    return null
  }
}

// Delete GitHub credentials from Supabase
export async function deleteGitHubCredentials(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('github_credentials').delete().eq('user_id', userId)

    if (error) {
      console.error('Error deleting GitHub credentials:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting GitHub credentials:', error)
    return false
  }
}

// Fetch user's GitHub repositories
export async function fetchGitHubRepositories(accessToken: string): Promise<any[] | null> {
  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=100', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch GitHub repositories:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return null
  }
}
