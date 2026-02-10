
import { createClient } from '@supabase/supabase-js';

// Credentials provided for the task
const SUPABASE_URL = 'https://cvwwdbybrxgqajwbyuvj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3dkYnlicnhncWFqd2J5dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjY4MTYsImV4cCI6MjA4NjI0MjgxNn0.42siSGdTbk2TswX8jUdnXysB6g6Gczg196qBd0jQY_M';

// Try to read from environment variables first (Next.js/Vite compatible), fallback to hardcoded
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process?.env?.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
