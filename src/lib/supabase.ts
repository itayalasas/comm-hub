
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAnonKey, requireSupabaseUrl } from './supabaseRuntime';

export const supabase = createClient(requireSupabaseUrl(), requireSupabaseAnonKey());
