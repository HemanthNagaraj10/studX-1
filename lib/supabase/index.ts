import { createClient } from '@/lib/supabase/client'
type Database = any

let supabaseInstance: ReturnType<typeof createClient>

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

export type SupabaseClient = ReturnType<typeof getSupabaseClient>
export type { Database }