'use client'

import { useEffect } from 'react'
import { Loader } from 'lucide-react'

export default function AuthCallbackPage() {
  useEffect(() => {
    // This page is just a loading state during the OAuth callback
    // The actual processing happens in the API route
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-4">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Completing Sign In</h1>
          <p className="text-slate-300">Please wait while we authenticate your GitHub account...</p>
        </div>
      </div>
    </div>
  )
}
