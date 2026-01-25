import { createClient } from '@supabase/supabase-js'

// You'll find these in your Supabase Project Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Keep the session alive in local storage
    autoRefreshToken: true, // Automatically refresh the session token
    detectSessionInUrl: true, // Crucial for parsing sessions from URL hash fragments
  },
})