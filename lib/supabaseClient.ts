import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvwwdbybrxgqajwbyuvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3dkYnlicnhncWFqd2J5dXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjY4MTYsImV4cCI6MjA4NjI0MjgxNn0.42siSGdTbk2TswX8jUdnXysB6g6Gczg196qBd0jQY_M';

export const supabase = createClient(supabaseUrl, supabaseKey);
