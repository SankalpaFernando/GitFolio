import { Button } from '@/components/ui/button'
import { Github, Loader } from 'lucide-react'
import { generateGitHubAuthUrl } from '@/lib/github'

interface GitHubLoginButtonProps {
  isLoading?: boolean
  className?: string
  text?: string
}

export function GitHubLoginButton({ isLoading = false, className = '', text = 'Sign in with GitHub' }: GitHubLoginButtonProps) {
  const handleLogin = () => {
    const authUrl = generateGitHubAuthUrl()
    window.location.href = authUrl
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className={`w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-black text-white gap-2 transition-all hover:scale-105 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <Github className="w-5 h-5" />
          {text}
        </>
      )}
    </Button>
  )
}
