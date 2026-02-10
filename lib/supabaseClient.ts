
import { createClient } from '@supabase/supabase-js';

// Fallback hardcoded credentials (Provided for "Amar Thrift" task)
const FALLBACK_URL = 'https://cvwwdbybrxgqajwbyuvj.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3dkYnlicnhncWFqd2J5dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjY4MTYsImV4cCI6MjA4NjI0MjgxNn0.42siSGdTbk2TswX8jUdnXysB6g6Gczg196qBd0jQY_M';

// Robustly get environment variables
const getEnv = (key: string) => {
  try {
    // In Vite, import.meta.env is the standard.
    // We use 'any' cast to avoid TS strictness issues if types aren't perfectly aligned in dev environment.
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch (e) {
    console.warn('Error accessing environment variable:', key);
  }
  return '';
};

// Check for both Vercel/Next.js style (NEXT_PUBLIC_) and Vite style (VITE_)
// We ensure we always have a string to prevent build-time crashes of createClient
const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || FALLBACK_URL;
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || FALLBACK_KEY;

// Create client with fallbacks to avoid throwing if env vars are missing during build
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);
