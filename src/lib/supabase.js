import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brsvohizxhjahecgiulo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc3ZvaGl6eGhqYWhlY2dpdWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzI5MzEsImV4cCI6MjA2ODE0ODkzMX0.8hHc4SP8S72v8CLzHSbLJXXx_--_LOs1W1TS6dr_Feg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;