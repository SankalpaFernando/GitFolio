'use client'

import { useEffect, useState } from 'react'
import { getStoredGitHubCredentials } from '@/lib/github'
import { GitHubLoginButton } from '@/components/auth/GitHubLoginButton'
import { Github, LogOut, Settings, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

interface GitHubCredentials {
  user_id?: string
  github_username: string
  github_avatar_url: string
  github_bio?: string
  github_public_repos: number
  github_followers: number
  github_following: number
}

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<GitHubCredentials | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user ID from cookies
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=')
          acc[name] = decodeURIComponent(value)
          return acc
        }, {} as Record<string, string>)

        const userId = cookies['github_user_id']
        console.log('[Dashboard] Checking authentication, user ID from cookie:', userId ? 'found' : 'not found')

        if (!userId) {
          console.log('[Dashboard] No user ID in cookie, showing login')
          setError('Not authenticated')
          setLoading(false)
          return
        }

        // Fetch credentials from database
        console.log('[Dashboard] Fetching credentials for user:', userId)
        const creds = await getStoredGitHubCredentials(userId)
        
        if (creds) {
          console.log('[Dashboard] Successfully loaded credentials for:', creds.github_username)
          setCredentials(creds)
          setError(null)
        } else {
          console.warn('[Dashboard] No credentials found in database for user:', userId)
          setError('Failed to load credentials. Please try signing in again.')
        }
      } catch (err) {
        console.error('[Dashboard] Error checking auth:', err)
        setError('Error loading credentials: ' + (err instanceof Error ? err.message : String(err)))
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'github_user_id=; max-age=0; path=/'
    document.cookie = 'github_username=; max-age=0; path=/'
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Github className="w-6 h-6 text-blue-400" />
            GitFolio Dashboard
          </div>
          <div className="flex items-center gap-4">
            {credentials && (
              <>
                <div className="text-sm text-slate-400">@{credentials.github_username}</div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {credentials ? (
          <div className="space-y-8">
            {/* Success Message */}
            {searchParams.get('auth') === 'success' && (
              <div className="bg-green-900/30 border border-green-700 text-green-300 px-6 py-3 rounded-lg flex items-center gap-2">
                <span className="text-lg">✓</span>
                Successfully authenticated with GitHub!
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Your Dashboard</h1>
              <p className="text-slate-300 text-lg">Manage your GitHub credentials and portfolio settings</p>
            </div>

            {/* GitHub Profile Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">GitHub Account</h2>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
                <div className="flex items-start gap-6 mb-6">
                  {credentials.github_avatar_url && (
                    <img
                      src={credentials.github_avatar_url}
                      alt={credentials.github_username}
                      className="w-24 h-24 rounded-lg border border-slate-600"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">@{credentials.github_username}</h3>
                    {credentials.github_bio && (
                      <p className="text-slate-300 mb-4">{credentials.github_bio}</p>
                    )}
                    <div className="flex gap-6 text-sm">
                      <div>
                        <div className="text-slate-400">Public Repos</div>
                        <div className="text-xl font-bold text-blue-400">{credentials.github_public_repos}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Followers</div>
                        <div className="text-xl font-bold text-purple-400">{credentials.github_followers}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Following</div>
                        <div className="text-xl font-bold text-pink-400">{credentials.github_following}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stored Credentials */}
                <div className="pt-6 border-t border-slate-600">
                  <h4 className="text-sm font-semibold text-slate-400 mb-3">STORED CREDENTIALS</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-500">GitHub Username</label>
                      <div className="text-slate-300 font-mono text-sm">{credentials.github_username}</div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">User ID</label>
                      <div className="text-slate-300 font-mono text-sm break-all">{credentials.user_id}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-blue-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <Code className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Repositories</h3>
                    <p className="text-slate-400 text-sm mb-4">View and manage your GitHub repositories</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">Browse Repos</Button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <Settings className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Portfolio Settings</h3>
                    <p className="text-slate-400 text-sm mb-4">Customize your portfolio appearance</p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto">
            <div className="text-center space-y-8">
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-8">
                <h1 className="text-2xl font-bold text-red-300 mb-4">Authentication Error</h1>
                <p className="text-red-300 mb-6">{error}</p>
                <GitHubLoginButton text="Sign In with GitHub" className="bg-gradient-to-r from-blue-600 to-blue-700" />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-center space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">Sign In to GitFolio</h1>
                <p className="text-slate-300 text-lg">Begin by connecting your GitHub account to get started with your portfolio</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">
                      1
                    </div>
                    <span>Connect your GitHub account</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold">
                      2
                    </div>
                    <span>We'll fetch your profile data</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 text-sm font-bold">
                      3
                    </div>
                    <span>Build your portfolio</span>
                  </div>
                </div>

                <GitHubLoginButton text="Sign In with GitHub" className="bg-gradient-to-r from-gray-800 to-black" />

                <p className="text-xs text-slate-500 text-center">
                  We only request access to your public profile and repositories. Your data is stored securely in Supabase.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

