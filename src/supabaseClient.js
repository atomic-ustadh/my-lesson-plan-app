import { createClient } from '@supabase/supabase-js'
import { googleLogout } from '@react-oauth/google'

// Supabase configuration for database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Google OAuth configuration
export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Auth helper functions
export const auth = {
  // Sign out from both Google and Supabase
  signOut: async () => {
    googleLogout()
    await supabase.auth.signOut()
  },
  
  // Get current session
  getSession: () => supabase.auth.getSession(),
  
  // Listen to auth state changes
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback)
}