import { createClient } from '@supabase/supabase-js'

// Project details from Supabase
const SUPABASE_URL = 'https://brsvohizxhjahecgiulo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc3ZvaGl6eGhqYWhlY2dpdWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzI5MzEsImV4cCI6MjA2ODE0ODkzMX0.8hHc4SP8S72v8CLzHSbLJXXx_--_LOs1W1TS6dr_Feg'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase