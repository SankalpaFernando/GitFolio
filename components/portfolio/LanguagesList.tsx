'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { PROGRAMMING_LANGUAGES, getLanguageByName } from '@/lib/languages'

interface Language {
  id: string
  language_name: string
  proficiency_level?: string
  years_of_experience?: number
  order_index?: number
}

export default function LanguagesList() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [newLanguage, setNewLanguage] = useState({
    language_name: '',
    proficiency_level: 'intermediate',
    years_of_experience: 0,
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      const res = await fetch('/api/portfolio/languages')
      if (res.ok) {
        const data = await res.json()
        setLanguages(data)
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/portfolio/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLanguage),
      })

      if (res.ok) {
        const data = await res.json()
        setLanguages([...languages, data])
        setNewLanguage({ language_name: '', proficiency_level: 'intermediate', years_of_experience: 0 })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding language:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/languages?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setLanguages(languages.filter((lang) => lang.id !== id))
      }
    } catch (error) {
      console.error('Error deleting language:', error)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading languages...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Programming Languages</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Select Language</label>
            <select
              value={newLanguage.language_name}
              onChange={(e) => setNewLanguage({ ...newLanguage, language_name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            >
              <option value="">-- Select a Language --</option>
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Proficiency Level</label>
              <select
                value={newLanguage.proficiency_level}
                onChange={(e) => setNewLanguage({ ...newLanguage, proficiency_level: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                value={newLanguage.years_of_experience}
                onChange={(e) => setNewLanguage({ ...newLanguage, years_of_experience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Language
            </Button>
          </div>
        </form>
      )}

      {languages.length === 0 ? (
        <p className="text-gray-400">No languages added yet</p>
      ) : (
        <div className="grid gap-2">
          {languages.map((lang) => {
            const langData = getLanguageByName(lang.language_name)
            return (
              <div
                key={lang.id}
                className="p-3 bg-gray-800 rounded border border-gray-700 flex items-center justify-between hover:border-gray-600 transition"
              >
                <div className="flex-1 flex items-center gap-3">
                  {langData && (
                    <div
                      className="px-3 py-1 rounded font-bold text-white text-sm flex-shrink-0"
                      style={{ }}
                    >
                        {/* <i className={`${langData.icon} colored text-2xl`}></i> */}
                        <img src={langData.icon} alt={langData.name} className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{lang.language_name}</p>
                    <p className="text-sm text-gray-400">
                      {lang.proficiency_level}
                      {lang.years_of_experience ? ` • ${lang.years_of_experience} year${lang.years_of_experience !== 1 ? 's' : ''}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(lang.id)}
                  className="p-2 hover:bg-red-900 rounded transition"
                  title="Delete language"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
