import { NextRequest, NextResponse } from 'next/server'
import { exchangeGitHubCode, fetchGitHubUserData, storeGitHubCredentials } from '@/lib/github'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Handle GitHub OAuth errors
  if (error) {
    console.error('GitHub OAuth error:', error)
    return NextResponse.redirect(new URL('/auth/error?message=GitHub authorization failed', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error?message=No authorization code received', request.url))
  }

  try {
    // Exchange code for access token
    const tokenData = await exchangeGitHubCode(code)
    if (!tokenData || !tokenData.access_token) {
      return NextResponse.redirect(new URL('/auth/error?message=Failed to get access token', request.url))
    }

    // Fetch GitHub user data
    const githubUser = await fetchGitHubUserData(tokenData.access_token)
    if (!githubUser) {
      return NextResponse.redirect(new URL('/auth/error?message=Failed to fetch user data', request.url))
    }

    // Create or sign in user in Supabase Auth
    const email = githubUser.email || `${githubUser.login}@github.local`
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: `github_${githubUser.id}`, // Simple password hash based on GitHub ID
    })

    // If user doesn't exist, create them
    if (authError && authError.message.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: `github_${githubUser.id}`,
        options: {
          data: {
            github_username: githubUser.login,
            avatar_url: githubUser.avatar_url,
          },
        },
      })

      if (signUpError) {
        console.error('Error signing up user:', signUpError)
        return NextResponse.redirect(new URL('/auth/error?message=Failed to create user account', request.url))
      }

      // Store GitHub credentials
      if (signUpData.user) {
        await storeGitHubCredentials(signUpData.user.id, githubUser, tokenData.access_token)
      }
    } else if (!authError && authData.user) {
      // Update existing user's GitHub credentials
      await storeGitHubCredentials(authData.user.id, githubUser, tokenData.access_token)
    }

    // Redirect to dashboard with success
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    return NextResponse.redirect(new URL('/auth/error?message=An unexpected error occurred', request.url))
  }
}
