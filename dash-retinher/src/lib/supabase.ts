import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')

export const supabase = createClient(url, anonKey)

export function getUploadFunctionUrl(): string {
  return import.meta.env.VITE_UPLOAD_FUNCTION_URL || ''
}
