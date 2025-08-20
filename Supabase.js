import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://your-project.supabase.co', // ← replace with your Supabase URL
  'your-anon-key' // ← replace with your Supabase anon public key
);
