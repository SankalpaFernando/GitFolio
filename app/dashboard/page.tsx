'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { GitHubLoginButton } from '@/components/auth/GitHubLoginButton'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { Github, LogOut, Settings, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

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
            {user && (
              <>
                <div className="text-sm text-slate-400">{user.email}</div>
                <Button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
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
        {user ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Your Dashboard</h1>
              <p className="text-slate-300 text-lg">Manage your GitHub credentials and portfolio settings</p>
            </div>

            {/* Auth Status Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">GitHub Account</h2>
              <AuthStatus />
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
