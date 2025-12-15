'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface Education {
  id: string
  school_name: string
  degree?: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  grade?: string
  description?: string
}

export default function EducationList() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [newEdu, setNewEdu] = useState({
    school_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    grade: '',
    description: '',
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/portfolio/education')
      if (res.ok) {
        const data = await res.json()
        setEducation(data)
      }
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/portfolio/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEdu),
      })

      if (res.ok) {
        const data = await res.json()
        setEducation([...education, data])
        setNewEdu({ school_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', grade: '', description: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding education:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/education?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setEducation(education.filter((edu) => edu.id !== id))
      }
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading education...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Education</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">School Name *</label>
            <input
              type="text"
              value={newEdu.school_name}
              onChange={(e) => setNewEdu({ ...newEdu, school_name: e.target.value })}
              placeholder="e.g., University of California"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Degree</label>
              <input
                type="text"
                value={newEdu.degree}
                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                placeholder="e.g., Bachelor of Science"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Field of Study</label>
              <input
                type="text"
                value={newEdu.field_of_study}
                onChange={(e) => setNewEdu({ ...newEdu, field_of_study: e.target.value })}
                placeholder="e.g., Computer Science"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={newEdu.start_date}
                onChange={(e) => setNewEdu({ ...newEdu, start_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={newEdu.end_date}
                onChange={(e) => setNewEdu({ ...newEdu, end_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Grade/GPA</label>
            <input
              type="text"
              value={newEdu.grade}
              onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
              placeholder="e.g., 3.8/4.0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={newEdu.description}
              onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
              placeholder="Additional details..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Education
            </Button>
          </div>
        </form>
      )}

      {education.length === 0 ? (
        <p className="text-gray-400">No education added yet</p>
      ) : (
        <div className="grid gap-2">
          {education.map((edu) => (
            <div key={edu.id} className="p-3 bg-gray-800 rounded border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-white">{edu.school_name}</p>
                  {edu.degree && (
                    <p className="text-sm text-gray-400">
                      {edu.degree}
                      {edu.field_of_study && ` in ${edu.field_of_study}`}
                    </p>
                  )}
                  {edu.start_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(edu.start_date).toLocaleDateString()} -{' '}
                      {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'}
                      {edu.grade && ` • GPA: ${edu.grade}`}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-2 hover:bg-red-900 rounded transition"
                  title="Delete education"
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
