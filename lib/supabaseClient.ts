import { createClient } from '@supabase/supabase-js';

// Credentials provided for the task
const SUPABASE_URL = 'https://cvwwdbybrxgqajwbyuvj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3dkYnlicnhncWFqd2J5dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjY4MTYsImV4cCI6MjA4NjI0MjgxNn0.42siSGdTbk2TswX8jUdnXysB6g6Gczg196qBd0jQY_M';

// Safely retrieve env vars without crashing in environments where 'process' is undefined
const getEnvVar = (viteKey: string, nextKey: string, fallback: string) => {
  // Use type assertion for import.meta to avoid TS errors when types are missing
  const meta = import.meta as unknown as { env: Record<string, string> };
  if (typeof meta !== 'undefined' && meta.env && meta.env[viteKey]) {
    return meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
    return process.env[nextKey];
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL);
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);