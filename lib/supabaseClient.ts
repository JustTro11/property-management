
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables')
}

// Fallback to valid-looking placeholders to prevent crash during build/test if env vars are missing
const url = supabaseUrl || 'http://127.0.0.1:9999'
const key = supabaseAnonKey || 'placeholder-key'

export const supabase = createBrowserClient(url, key)
