// src/config/supabase.config.ts
import { createClient } from '@supabase/supabase-js';
import { Logger } from '@nestjs/common';

const logger = new Logger('SupabaseConfig');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log para diagnóstico (sin mostrar la key completa)
logger.log(`Supabase URL: ${supabaseUrl ? 'Set' : 'Not set'}`);
logger.log(`Service Key: ${supabaseServiceKey ? 'Set (length: ' + supabaseServiceKey.length + ')' : 'Not set'}`);

if (!supabaseUrl) {
  const error = 'SUPABASE_URL environment variable is required';
  logger.error(error);
  throw new Error(error);
}

if (!supabaseServiceKey) {
  const error = 'SUPABASE_SERVICE_ROLE_KEY environment variable is required';
  logger.error(error);
  throw new Error(error);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

logger.log('Supabase client initialized successfully');
