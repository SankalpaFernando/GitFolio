import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Get authenticated user
export async function getAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
  return data.user
}

// Sign out user
export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    return false
  }
  return true
}

// Get user session
export async function getUserSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  return data.session
}
