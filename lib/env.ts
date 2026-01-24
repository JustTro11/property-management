const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

const optionalEnvVars = [
    'NEXT_PUBLIC_FORCE_MOCK_DATA',
] as const

export const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FORCE_MOCK_DATA: process.env.NEXT_PUBLIC_FORCE_MOCK_DATA,
}

// Validate environment variables
// Note: We don't throw in client-side code to avoid crashing the whole app during build/render if vars are optional or missing in dev.
// But we log warnings.

export const isSupabaseConfigured = () => {
    return !!env.NEXT_PUBLIC_SUPABASE_URL &&
        !env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        env.NEXT_PUBLIC_FORCE_MOCK_DATA !== 'true';
}

export const getSupabaseConfig = () => {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables are missing. Using placeholders or falling back to mock.')
        return {
            url: env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:9999',
            key: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
        }
    }
    return {
        url: env.NEXT_PUBLIC_SUPABASE_URL,
        key: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
}
