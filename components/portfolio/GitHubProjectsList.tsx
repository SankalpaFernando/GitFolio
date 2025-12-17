'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, RefreshCw, ExternalLink, Star, GitFork, Github } from 'lucide-react'

interface GitHubProject {
  id: string
  repo_name: string
  repo_url?: string
  description?: string
  language?: string
  stars?: number
  forks?: number
  featured?: boolean
}

interface GitHubRepo {
  id: number
  name: string
  url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
}

export default function GitHubProjectsList() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchingRepos, setFetchingRepos] = useState(false)
  const [availableRepos, setAvailableRepos] = useState<GitHubRepo[]>([])
  const [showRepoSelection, setShowRepoSelection] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/portfolio/github-projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchFromGitHub = async () => {
    setFetchingRepos(true)
    try {
      const res = await fetch('/api/portfolio/github-repos')
      if (res.ok) {
        const repos = await res.json()
        console.log('Fetched repos:', repos)
        setAvailableRepos(repos)
        setShowRepoSelection(true)
      } else {
        console.error('Failed to fetch repositories')
        alert('Failed to fetch repositories from GitHub')
      }
    } catch (error) {
      console.error('Error fetching repos:', error)
      alert('Error fetching repositories: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setFetchingRepos(false)
    }
  }

  const handleAddRepoFromGitHub = async (repo: GitHubRepo) => {
    try {
      const res = await fetch('/api/portfolio/github-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_name: repo.name,
          repo_url: repo.url,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          featured: false,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setProjects([...projects, data])
        setAvailableRepos(availableRepos.filter((r) => r.id !== repo.id))
      }
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/github-projects?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProjects(projects.filter((proj) => proj.id !== id))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const res = await fetch('/api/portfolio/github-projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: !featured }),
      })

      if (res.ok) {
        setProjects(projects.map((p) => (p.id === id ? { ...p, featured: !featured } : p)))
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading projects...</div>
  }

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">GitHub Projects</h3>
        <Button
          onClick={handleFetchFromGitHub}
          disabled={fetchingRepos}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Github className="h-4 w-4" />
          {fetchingRepos ? 'Fetching...' : 'Fetch from GitHub'}
        </Button>
      </div>

      {/* Repository Selection Modal */}
      {showRepoSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Select Repositories to Showcase</h4>
              <button
                onClick={() => setShowRepoSelection(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {availableRepos.length === 0 ? (
              <p className="text-gray-400">All repositories are already added or no repositories found</p>
            ) : (
              <div className="space-y-2">
                {availableRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-3 bg-gray-700 rounded border border-gray-600 flex items-start justify-between hover:border-blue-500/50 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{repo.name}</p>
                      {repo.description && (
                        <p className="text-sm text-gray-300 line-clamp-2 mt-1">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                        {repo.language && <span className="bg-gray-600 px-2 py-1 rounded">{repo.language}</span>}
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" /> {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" /> {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddRepoFromGitHub(repo)}
                      className="ml-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm whitespace-nowrap transition"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowRepoSelection(false)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-3">No projects showcased yet</p>
          <p className="text-sm text-gray-500">Click &quot;Fetch from GitHub&quot; to add your repositories</p>
        </div>
      ) : (
        <div className="space-y-4">
          {featuredProjects.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">⭐ Featured Projects</h4>
              <div className="grid gap-2">
                {featuredProjects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-gradient-to-r from-yellow-900 to-gray-800 rounded border border-yellow-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">{proj.repo_name}</p>
                        {proj.description && <p className="text-sm text-gray-300 mt-1">{proj.description}</p>}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                          {proj.language && <span>{proj.language}</span>}
                          {proj.stars !== undefined && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" /> {proj.stars}
                            </span>
                          )}
                          {proj.forks !== undefined && (
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" /> {proj.forks}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {proj.repo_url && (
                          <a
                            href={proj.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-blue-900 rounded transition"
                            title="View on GitHub"
                          >
                            <ExternalLink className="h-4 w-4 text-blue-400" />
                          </a>
                        )}
                        <button
                          onClick={() => toggleFeatured(proj.id, proj.featured || false)}
                          className="p-2 hover:bg-yellow-900 rounded transition"
                          title="Unfeature"
                        >
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-2 hover:bg-red-900 rounded transition"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherProjects.length > 0 && (
            <div>
              {featuredProjects.length > 0 && <h4 className="text-sm font-semibold text-gray-300 mb-2">Other Projects</h4>}
              <div className="grid gap-2">
                {otherProjects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">{proj.repo_name}</p>
                        {proj.description && <p className="text-sm text-gray-400 mt-1">{proj.description}</p>}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                          {proj.language && <span>{proj.language}</span>}
                          {proj.stars !== undefined && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" /> {proj.stars}
                            </span>
                          )}
                          {proj.forks !== undefined && (
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" /> {proj.forks}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {proj.repo_url && (
                          <a
                            href={proj.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-blue-900 rounded transition"
                            title="View on GitHub"
                          >
                            <ExternalLink className="h-4 w-4 text-blue-400" />
                          </a>
                        )}
                        <button
                          onClick={() => toggleFeatured(proj.id, proj.featured || false)}
                          className="p-2 hover:bg-yellow-900 rounded transition"
                          title="Feature"
                        >
                          <Star className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-2 hover:bg-red-900 rounded transition"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
