'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, ExternalLink, Star, GitFork } from 'lucide-react'

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

export default function GitHubProjectsList() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [newProject, setNewProject] = useState({
    repo_name: '',
    repo_url: '',
    description: '',
    language: '',
    featured: false,
  })
  const [showForm, setShowForm] = useState(false)

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/portfolio/github-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })

      if (res.ok) {
        const data = await res.json()
        setProjects([...projects, data])
        setNewProject({ repo_name: '', repo_url: '', description: '', language: '', featured: false })
        setShowForm(false)
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
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Repository Name *</label>
            <input
              type="text"
              value={newProject.repo_name}
              onChange={(e) => setNewProject({ ...newProject, repo_name: e.target.value })}
              placeholder="e.g., awesome-project"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Repository URL</label>
            <input
              type="url"
              value={newProject.repo_url}
              onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Language</label>
              <input
                type="text"
                value={newProject.language}
                onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                placeholder="e.g., TypeScript"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="rounded"
                />
                Featured
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief description of the project..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Project
            </Button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects added yet</p>
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
