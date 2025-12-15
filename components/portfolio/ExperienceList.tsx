'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface Experience {
  id: string
  company_name: string
  job_title: string
  employment_type?: string
  location?: string
  start_date: string
  end_date?: string
  is_current?: boolean
  description?: string
  skills_used?: string[]
}

export default function ExperienceList() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [newExp, setNewExp] = useState({
    company_name: '',
    job_title: '',
    employment_type: 'Full-time',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    skills_used: [] as string[],
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchExperience()
  }, [])

  const fetchExperience = async () => {
    try {
      const res = await fetch('/api/portfolio/experience')
      if (res.ok) {
        const data = await res.json()
        setExperience(data)
      }
    } catch (error) {
      console.error('Error fetching experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/portfolio/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      })

      if (res.ok) {
        const data = await res.json()
        setExperience([...experience, data])
        setNewExp({
          company_name: '',
          job_title: '',
          employment_type: 'Full-time',
          location: '',
          start_date: '',
          end_date: '',
          is_current: false,
          description: '',
          skills_used: [],
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding experience:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/experience?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setExperience(experience.filter((exp) => exp.id !== id))
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading experience...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Experience</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Company Name *</label>
              <input
                type="text"
                value={newExp.company_name}
                onChange={(e) => setNewExp({ ...newExp, company_name: e.target.value })}
                placeholder="e.g., Google"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Job Title *</label>
              <input
                type="text"
                value={newExp.job_title}
                onChange={(e) => setNewExp({ ...newExp, job_title: e.target.value })}
                placeholder="e.g., Senior Engineer"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Employment Type</label>
              <select
                value={newExp.employment_type}
                onChange={(e) => setNewExp({ ...newExp, employment_type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={newExp.location}
                onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Date *</label>
              <input
                type="date"
                value={newExp.start_date}
                onChange={(e) => setNewExp({ ...newExp, start_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={newExp.end_date}
                onChange={(e) => setNewExp({ ...newExp, end_date: e.target.value })}
                disabled={newExp.is_current}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_current"
              checked={newExp.is_current}
              onChange={(e) => setNewExp({ ...newExp, is_current: e.target.checked, end_date: '' })}
              className="rounded"
            />
            <label htmlFor="is_current" className="text-sm text-gray-300">
              I currently work here
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              placeholder="Job responsibilities and achievements..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Experience
            </Button>
          </div>
        </form>
      )}

      {experience.length === 0 ? (
        <p className="text-gray-400">No experience added yet</p>
      ) : (
        <div className="grid gap-2">
          {experience.map((exp) => (
            <div key={exp.id} className="p-3 bg-gray-800 rounded border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-white">{exp.job_title}</p>
                  <p className="text-sm text-gray-400">{exp.company_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(exp.start_date).toLocaleDateString()} -{' '}
                    {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'N/A'}
                    {exp.location && ` • ${exp.location}`}
                    {exp.employment_type && ` • ${exp.employment_type}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 hover:bg-red-900 rounded transition"
                  title="Delete experience"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
