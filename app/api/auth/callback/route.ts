import { NextRequest, NextResponse } from 'next/server'
import { exchangeGitHubCode, fetchGitHubUserData, storeOrUpdateGitHubCredentials, getStoredGitHubCredentials } from '@/lib/github'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

function generateUUID(): string {
  return crypto.randomUUID()
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle GitHub OAuth errors
  if (error) {
    console.error('GitHub OAuth error:', error, errorDescription)
    const message = encodeURIComponent(errorDescription || 'GitHub authorization failed')
    return NextResponse.redirect(new URL(`/auth/error?message=${message}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error?message=No%20authorization%20code%20received', request.url))
  }

  try {
    console.log('[OAuth] Step 1: Exchanging code for token...')
    // 1. Exchange code for access token
    const tokenData = await exchangeGitHubCode(code)
    if (!tokenData || !tokenData.access_token) {
      console.error('[OAuth] Step 1 failed: No access token received')
      return NextResponse.redirect(new URL('/auth/error?message=Failed%20to%20get%20access%20token', request.url))
    }
    console.log('[OAuth] Step 1 success: Got access token')

    console.log('[OAuth] Step 2: Fetching GitHub user data...')
    // 2. Fetch GitHub user data
    const githubUser = await fetchGitHubUserData(tokenData.access_token)
    if (!githubUser) {
      console.error('[OAuth] Step 2 failed: Could not fetch GitHub user data')
      return NextResponse.redirect(new URL('/auth/error?message=Failed%20to%20fetch%20user%20data', request.url))
    }
    console.log('[OAuth] Step 2 success: Got user data for', githubUser.login)

    // 3. Create or get user in Supabase
    // Use GitHub username as unique identifier
    console.log('[OAuth] Step 3: Checking for existing credentials...')
    const email = githubUser.email || `${githubUser.login}@github.local`
    const userId = generateUUID()

    // Check if credentials already exist for this GitHub user
    // Use maybeSingle() instead of single() to avoid errors when no row found
    const { data: existingCreds, error: queryError } = await supabase
      .from('github_credentials')
      .select('user_id')
      .eq('github_username', githubUser.login)
      .maybeSingle() // Returns null instead of error when no rows found

    if (queryError) {
      console.error('[OAuth] Step 3 query error:', queryError)
      // Ignore query errors and treat as new user
    }

    let finalUserId = existingCreds?.user_id || userId
    console.log('[OAuth] Step 3 success: Using user ID:', finalUserId, existingCreds ? '(existing)' : '(new)')

    // 4. Store or update GitHub credentials
    console.log('[OAuth] Step 4: Storing/updating GitHub credentials...')
    const credentialsStored = await storeOrUpdateGitHubCredentials(
      finalUserId,
      githubUser,
      tokenData.access_token
    )

    if (!credentialsStored) {
      console.error('[OAuth] Step 4 failed: Could not store credentials')
      return NextResponse.redirect(new URL('/auth/error?message=Failed%20to%20store%20credentials', request.url))
    }
    console.log('[OAuth] Step 4 success: Credentials stored')

    // 5. Log the auth event (fire and forget)
    console.log('[OAuth] Step 5: Logging auth event...')
    Promise.resolve(
      supabase
        .from('auth_logs')
        .insert({
          user_id: finalUserId,
          github_username: githubUser.login,
          action: 'github_login',
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        })
    )
      .then(() => console.log('[OAuth] Step 5 success: Auth event logged'))
      .catch((err: unknown) => console.error('[OAuth] Step 5 warning (non-critical):', err))

    console.log('[OAuth] All steps completed successfully, redirecting to dashboard...')
    // 6. Create response with redirect
    const response = NextResponse.redirect(new URL('/dashboard?auth=success', request.url))

    // 7. Set authentication cookie with userId
    response.cookies.set('github_user_id', finalUserId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    // Also set GitHub username for quick access
    response.cookies.set('github_username', githubUser.login, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    console.log('[OAuth] Cookies set, returning redirect response')
    return response
  } catch (error) {
    console.error('[OAuth] Unexpected error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    const message = encodeURIComponent(errorMsg.substring(0, 100))
    return NextResponse.redirect(new URL(`/auth/error?message=Authentication%20failed:%20${message}`, request.url))
  }
}
