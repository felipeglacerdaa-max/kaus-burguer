import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aidyjrcigfglkzolhuda.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZHlqcmNpZ2ZnbGt6b2xodWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzI5ODgsImV4cCI6MjA4NzgwODk4OH0.4rXPocDi1I9wLJFCfwwJZmMPRScjZSFxxmbJdS0VB2A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
