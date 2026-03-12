'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getStoredGitHubCredentials, deleteGitHubCredentials } from '@/lib/github'
import { Button } from '@/components/ui/button'
import { LogOut, Github, Users, Share2, Copy, Check } from 'lucide-react'

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

export function AuthStatus() {
  const [user, setUser] = useState<any>(null)
  const [githubCreds, setGitHubCreds] = useState<GitHubCredentials | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          setLoading(false)
          return
        }

        setUser(data.user)

        // Fetch stored GitHub credentials
        const creds = await getStoredGitHubCredentials(data.user.id)
        setGitHubCreds(creds)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setGitHubCreds(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDisconnectGithub = async () => {
    if (!user) return

    try {
      const success = await deleteGitHubCredentials(user.id)
      if (success) {
        setGitHubCreds(null)
        alert('GitHub account disconnected successfully')
      }
    } catch (error) {
      console.error('Error disconnecting GitHub:', error)
      alert('Failed to disconnect GitHub account')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="text-slate-400">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {githubCreds ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={githubCreds.github_avatar_url}
                alt={githubCreds.github_username}
                className="w-16 h-16 rounded-full border-2 border-blue-400"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">{githubCreds.github_username}</h3>
                {githubCreds.github_bio && <p className="text-slate-300 text-sm">{githubCreds.github_bio}</p>}
                <div className="flex gap-2 mt-2">
                  <a
                    href={`https://github.com/${githubCreds.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    View Profile
                  </a>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{githubCreds.github_public_repos}</div>
              <div className="text-sm text-slate-400">Public Repos</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Users className="w-5 h-5 text-blue-400" />
                <div className="text-2xl font-bold text-white">{githubCreds.github_followers}</div>
              </div>
              <div className="text-sm text-slate-400">Followers</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Share2 className="w-5 h-5 text-purple-400" />
                <div className="text-2xl font-bold text-white">{githubCreds.github_following}</div>
              </div>
              <div className="text-sm text-slate-400">Following</div>
            </div>
          </div>

          {/* Credentials Info */}
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-white">Stored Credentials</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                <div>
                  <div className="text-sm text-slate-400">GitHub Username</div>
                  <div className="text-white font-mono">{githubCreds.github_username}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(githubCreds.github_username)}
                  className="text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded">
                <div>
                  <div className="text-sm text-slate-400">GitHub User ID</div>
                  <div className="text-white font-mono">{githubCreds.github_user_id}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(String(githubCreds.github_user_id))}
                  className="text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="text-xs text-slate-500">
                <div>Token stored securely in Supabase</div>
                <div>Last updated: {new Date(githubCreds.stored_at).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={handleDisconnectGithub}
              variant="destructive"
              className="flex-1 bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30"
            >
              Disconnect GitHub
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
          <div className="text-slate-400 mb-4">No GitHub credentials found</div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Github className="w-4 h-4 mr-2" />
            Connect GitHub Account
          </Button>
        </div>
      )}
    </div>
  )
}
