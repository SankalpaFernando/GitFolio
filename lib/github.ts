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

// Store or update GitHub credentials (handles both insert and update)
export async function storeOrUpdateGitHubCredentials(
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

    console.log('[DB] Attempting to update credentials for user:', userId)
    // Try to update first
    const { data: updateData, error: updateError } = await supabase
      .from('github_credentials')
      .update(credentials)
      .eq('user_id', userId)
      .select()
      .single()

    // If update succeeded, return the updated data
    if (!updateError && updateData) {
      console.log('[DB] Successfully updated credentials for user:', userId)
      return updateData
    }

    // If update failed, log why and try to insert
    if (updateError) {
      console.log('[DB] Update failed or returned 0 rows, attempting insert. Error:', updateError.message)
    }

    // If update failed due to no rows, try to insert
    console.log('[DB] Inserting new credentials for user:', userId)
    const { data: insertData, error: insertError } = await supabase
      .from('github_credentials')
      .insert([credentials])
      .select()
      .single()

    if (insertError) {
      console.error('[DB] Error inserting GitHub credentials:', insertError)
      // Log the exact error for debugging
      console.error('[DB] Insert error details:', JSON.stringify(insertError, null, 2))
      console.error('[DB] Attempted to insert:', JSON.stringify(credentials, null, 2))
      return null
    }

    console.log('[DB] Successfully inserted new credentials for user:', userId)
    return insertData
  } catch (error) {
    console.error('[DB] Unexpected error in storeOrUpdateGitHubCredentials:', error)
    return null
  }
}

// Get stored GitHub credentials from Supabase
export async function getStoredGitHubCredentials(userId: string): Promise<GitHubCredentials | null> {
  try {
    console.log('[DB] Fetching credentials for user:', userId)
    const { data, error } = await supabase
      .from('github_credentials')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle() // Use maybeSingle instead of single to avoid errors

    if (error) {
      console.error('[DB] Error retrieving GitHub credentials:', error)
      return null
    }

    if (!data) {
      console.log('[DB] No credentials found for user:', userId)
      return null
    }

    console.log('[DB] Successfully retrieved credentials for user:', userId)
    return data
  } catch (error) {
    console.error('[DB] Unexpected error retrieving credentials:', error)
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
