'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getStoredGitHubCredentials, fetchGitHubRepositories } from '@/lib/github'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink, Star, Code2 } from 'lucide-react'

interface Repository {
  id: number
  name: string
  description: string
  url: string
  stars: number
  language: string
  topics: string[]
}

export function CredentialsDisplay() {
  const [user, setUser] = useState<any>(null)
  const [credentials, setCredentials] = useState<any>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          setLoading(false)
          return
        }

        setUser(data.user)

        // Fetch credentials
        const creds = await getStoredGitHubCredentials(data.user.id)
        setCredentials(creds)

        // Fetch repositories
        if (creds?.github_token) {
          const repos = await fetchGitHubRepositories(creds.github_token)
          if (repos) {
            setRepositories(
              repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10)
                .map((repo) => ({
                  id: repo.id,
                  name: repo.name,
                  description: repo.description,
                  url: repo.html_url,
                  stars: repo.stargazers_count,
                  language: repo.language,
                  topics: repo.topics || [],
                }))
            )
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  if (loading) {
    return <div className="text-slate-400">Loading credentials...</div>
  }

  if (!user || !credentials) {
    return <div className="text-slate-400">No credentials found</div>
  }

  return (
    <div className="space-y-8">
      {/* GitHub Profile Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={credentials.github_avatar_url}
              alt={credentials.github_username}
              className="w-20 h-20 rounded-full border-2 border-blue-400"
            />
            <div>
              <h2 className="text-3xl font-bold text-white">{credentials.github_username}</h2>
              {credentials.github_bio && <p className="text-slate-300 text-sm mt-1">{credentials.github_bio}</p>}
              <a
                href={`https://github.com/${credentials.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-2"
              >
                View Profile <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{credentials.github_public_repos}</div>
            <div className="text-xs text-slate-400 mt-1">Public Repos</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{credentials.github_followers}</div>
            <div className="text-xs text-slate-400 mt-1">Followers</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{credentials.github_following}</div>
            <div className="text-xs text-slate-400 mt-1">Following</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{new Date(credentials.stored_at).toLocaleDateString()}</div>
            <div className="text-xs text-slate-400 mt-1">Joined</div>
          </div>
        </div>
      </div>

      {/* Credentials Information */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Stored Credentials</h3>
        <div className="space-y-3 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded">
            <div>
              <div className="text-sm text-slate-400">GitHub Username</div>
              <div className="text-white font-mono text-lg">{credentials.github_username}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(credentials.github_username, 'username')}
              className="text-slate-400 hover:text-white"
            >
              {copied === 'username' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-4 rounded">
            <div>
              <div className="text-sm text-slate-400">GitHub User ID</div>
              <div className="text-white font-mono text-lg">{credentials.github_user_id}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(String(credentials.github_user_id), 'userid')}
              className="text-slate-400 hover:text-white"
            >
              {copied === 'userid' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-4 rounded">
            <div>
              <div className="text-sm text-slate-400">Access Token</div>
              <div className="text-white font-mono text-sm">
                {credentials.github_token.substring(0, 20)}...
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(credentials.github_token, 'token')}
              className="text-slate-400 hover:text-white"
              title="Copy access token"
            >
              {copied === 'token' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="text-xs text-slate-500 pt-4 border-t border-slate-700">
            <div>📧 Email: {user.email}</div>
            <div>⏰ Last updated: {new Date(credentials.stored_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Top Repositories */}
      {repositories.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Top Repositories</h3>
          <div className="space-y-3">
            {repositories.map((repo) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/30 rounded-lg p-4 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400 mt-1" />
                    <h4 className="font-bold text-white text-lg">{repo.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">{repo.stars}</span>
                  </div>
                </div>
                {repo.description && <p className="text-slate-300 text-sm mb-3">{repo.description}</p>}
                <div className="flex items-center gap-2">
                  {repo.language && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300">
                      {repo.language}
                    </span>
                  )}
                  {repo.topics.map((topic) => (
                    <span key={topic} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/20 text-xs text-blue-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
