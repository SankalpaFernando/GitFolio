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

// ============ LANGUAGES / PROGRAMMING LANGUAGES ============

export async function addLanguage(userId: string, language: {
  language_name: string
  proficiency_level?: string
  years_of_experience?: number
  order_index?: number
}): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('languages')
      .insert([{ user_id: userId, ...language }])
      .select()
      .single()

    if (error) {
      console.error('[DB] Error adding language:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error adding language:', error)
    return null
  }
}

export async function getLanguages(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('[DB] Error fetching languages:', error)
      return null
    }

    return data || []
  } catch (error) {
    console.error('[DB] Unexpected error fetching languages:', error)
    return null
  }
}

export async function updateLanguage(languageId: string, updates: Partial<any>): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('languages')
      .update(updates)
      .eq('id', languageId)
      .select()
      .single()

    if (error) {
      console.error('[DB] Error updating language:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error updating language:', error)
    return null
  }
}

export async function deleteLanguage(languageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('languages')
      .delete()
      .eq('id', languageId)

    if (error) {
      console.error('[DB] Error deleting language:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[DB] Unexpected error deleting language:', error)
    return false
  }
}

// ============ CERTIFICATES ============

export async function addCertificate(userId: string, certificate: {
  certificate_name: string
  issuer?: string
  issue_date?: string
  expiry_date?: string
  certificate_url?: string
  credential_id?: string
  description?: string
  order_index?: number
}): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert([{ user_id: userId, ...certificate }])
      .select()
      .single()

    if (error) {
      console.error('[DB] Error adding certificate:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error adding certificate:', error)
    return null
  }
}

export async function getCertificates(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('[DB] Error fetching certificates:', error)
      return null
    }

    return data || []
  } catch (error) {
    console.error('[DB] Unexpected error fetching certificates:', error)
    return null
  }
}

export async function updateCertificate(certificateId: string, updates: Partial<any>): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('id', certificateId)
      .select()
      .single()

    if (error) {
      console.error('[DB] Error updating certificate:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error updating certificate:', error)
    return null
  }
}

export async function deleteCertificate(certificateId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', certificateId)

    if (error) {
      console.error('[DB] Error deleting certificate:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[DB] Unexpected error deleting certificate:', error)
    return false
  }
}

// ============ EDUCATION ============

export async function addEducation(userId: string, education: {
  school_name: string
  degree?: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  grade?: string
  description?: string
  order_index?: number
}): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('education')
      .insert([{ user_id: userId, ...education }])
      .select()
      .single()

    if (error) {
      console.error('[DB] Error adding education:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error adding education:', error)
    return null
  }
}

export async function getEducation(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('[DB] Error fetching education:', error)
      return null
    }

    return data || []
  } catch (error) {
    console.error('[DB] Unexpected error fetching education:', error)
    return null
  }
}

export async function updateEducation(educationId: string, updates: Partial<any>): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('education')
      .update(updates)
      .eq('id', educationId)
      .select()
      .single()

    if (error) {
      console.error('[DB] Error updating education:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error updating education:', error)
    return null
  }
}

export async function deleteEducation(educationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', educationId)

    if (error) {
      console.error('[DB] Error deleting education:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[DB] Unexpected error deleting education:', error)
    return false
  }
}

// ============ EXPERIENCE ============

export async function addExperience(userId: string, experience: {
  company_name: string
  job_title: string
  employment_type?: string
  location?: string
  start_date: string
  end_date?: string
  is_current?: boolean
  description?: string
  skills_used?: string[]
  order_index?: number
}): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .insert([{ user_id: userId, ...experience }])
      .select()
      .single()

    if (error) {
      console.error('[DB] Error adding experience:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error adding experience:', error)
    return null
  }
}

export async function getExperience(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('[DB] Error fetching experience:', error)
      return null
    }

    return data || []
  } catch (error) {
    console.error('[DB] Unexpected error fetching experience:', error)
    return null
  }
}

export async function updateExperience(experienceId: string, updates: Partial<any>): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .update(updates)
      .eq('id', experienceId)
      .select()
      .single()

    if (error) {
      console.error('[DB] Error updating experience:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error updating experience:', error)
    return null
  }
}

export async function deleteExperience(experienceId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', experienceId)

    if (error) {
      console.error('[DB] Error deleting experience:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[DB] Unexpected error deleting experience:', error)
    return false
  }
}

// ============ GITHUB PROJECTS ============

export async function addGitHubProject(userId: string, project: {
  repo_name: string
  repo_url?: string
  description?: string
  language?: string
  stars?: number
  forks?: number
  featured?: boolean
  order_index?: number
}): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('github_projects')
      .insert([{ user_id: userId, ...project }])
      .select()
      .single()

    if (error) {
      console.error('[DB] Error adding GitHub project:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error adding GitHub project:', error)
    return null
  }
}

export async function getGitHubProjects(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('github_projects')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('[DB] Error fetching GitHub projects:', error)
      return null
    }

    return data || []
  } catch (error) {
    console.error('[DB] Unexpected error fetching GitHub projects:', error)
    return null
  }
}

export async function updateGitHubProject(projectId: string, updates: Partial<any>): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('github_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('[DB] Error updating GitHub project:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[DB] Unexpected error updating GitHub project:', error)
    return null
  }
}

export async function deleteGitHubProject(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('github_projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      console.error('[DB] Error deleting GitHub project:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[DB] Unexpected error deleting GitHub project:', error)
    return false
  }
}
