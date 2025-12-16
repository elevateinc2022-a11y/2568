import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
// We provide fallback placeholder values so the app does not crash on startup if keys are missing.
// Requests will simply fail with 401/404 if these are invalid.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);