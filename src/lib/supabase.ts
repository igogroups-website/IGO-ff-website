import { createClient } from '@supabase/supabase-js';
import { VERIFIED_INVENTORY } from './constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If credentials are missing, we use a placeholder so createClient doesn't throw immediately,
// but we'll probably have issues later. However, the user's .env.local has real ones.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
