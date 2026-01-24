
import { createBrowserClient } from '@supabase/ssr'

import { getSupabaseConfig } from '@/lib/env'

const { url, key } = getSupabaseConfig()

export const supabase = createBrowserClient(url, key)
