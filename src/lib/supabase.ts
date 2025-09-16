import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
// Prefer Publishable key, fallback to legacy anon var
const anon = (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, anon as string)
