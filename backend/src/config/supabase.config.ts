// src/config/supabase.config.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  const error = 'SUPABASE_URL environment variable is required';
  throw new Error(error);
}

if (!supabaseServiceKey) {
  const error = 'SUPABASE_SERVICE_ROLE_KEY environment variable is required';
  throw new Error(error);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
