'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, ExternalLink } from 'lucide-react'

interface Certificate {
  id: string
  certificate_name: string
  issuer?: string
  issue_date?: string
  expiry_date?: string
  certificate_url?: string
  credential_id?: string
  description?: string
}

export default function CertificatesList() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [newCert, setNewCert] = useState({
    certificate_name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    certificate_url: '',
    credential_id: '',
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/portfolio/certificates')
      if (res.ok) {
        const data = await res.json()
        setCertificates(data)
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/portfolio/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert),
      })

      if (res.ok) {
        const data = await res.json()
        setCertificates([...certificates, data])
        setNewCert({ certificate_name: '', issuer: '', issue_date: '', expiry_date: '', certificate_url: '', credential_id: '' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding certificate:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/certificates?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setCertificates(certificates.filter((cert) => cert.id !== id))
      }
    } catch (error) {
      console.error('Error deleting certificate:', error)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading certificates...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Certifications</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Certificate Name *</label>
            <input
              type="text"
              value={newCert.certificate_name}
              onChange={(e) => setNewCert({ ...newCert, certificate_name: e.target.value })}
              placeholder="e.g., AWS Solutions Architect"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Issuer</label>
              <input
                type="text"
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                placeholder="e.g., Amazon Web Services"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Credential ID</label>
              <input
                type="text"
                value={newCert.credential_id}
                onChange={(e) => setNewCert({ ...newCert, credential_id: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={newCert.issue_date}
                onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Expiry Date</label>
              <input
                type="date"
                value={newCert.expiry_date}
                onChange={(e) => setNewCert({ ...newCert, expiry_date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Certificate URL</label>
            <input
              type="url"
              value={newCert.certificate_url}
              onChange={(e) => setNewCert({ ...newCert, certificate_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Certificate
            </Button>
          </div>
        </form>
      )}

      {certificates.length === 0 ? (
        <p className="text-gray-400">No certificates added yet</p>
      ) : (
        <div className="grid gap-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-3 bg-gray-800 rounded border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-white">{cert.certificate_name}</p>
                  {cert.issuer && <p className="text-sm text-gray-400">{cert.issuer}</p>}
                  {cert.issue_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Issued: {new Date(cert.issue_date).toLocaleDateString()}
                      {cert.expiry_date && ` • Expires: ${new Date(cert.expiry_date).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {cert.certificate_url && (
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-blue-900 rounded transition"
                      title="View certificate"
                    >
                      <ExternalLink className="h-4 w-4 text-blue-400" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 hover:bg-red-900 rounded transition"
                    title="Delete certificate"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
