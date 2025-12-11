'use client'

import { useEffect, useState } from 'react'
import { Loader, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const [elapsed, setElapsed] = useState(0)
  const [hasError, setHasError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Track elapsed time
    const interval = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + 1
        // If it takes more than 15 seconds, something is wrong
        if (newElapsed > 15) {
          setHasError(true)
          clearInterval(interval)
          // Redirect to error page after showing message for 2 seconds
          setTimeout(() => {
            router.push('/auth/error?message=Authentication%20took%20too%20long.%20Please%20try%20again.')
          }, 2000)
        }
        return newElapsed
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-500/20 rounded-full p-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Authentication Timeout</h1>
            <p className="text-slate-300">Taking too long. Redirecting to error page...</p>
          </div>
        </div>
      </div>
    )
  }

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
          <p className="text-slate-400 text-sm mt-4">{elapsed}s</p>
        </div>
      </div>
    </div>
  )
}
