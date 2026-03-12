'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An authentication error occurred'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-lg p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-500/20 rounded-full p-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-slate-300">{message}</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
