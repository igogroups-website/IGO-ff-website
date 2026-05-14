import { createClient } from '@supabase/supabase-js';
import { VERIFIED_INVENTORY } from './constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://celsdwfmogpejwzbkxad.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbHNkd2Ztb2dwZWp3emJreGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTQ2ODYsImV4cCI6MjA5MzE5MDY4Nn0.wxFKTG3MwtfICKcs_cK5w9qrAYKMqbKweFBEXv5aVwM';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      if (!isSupabaseConfigured) {
        console.error('Supabase is not configured. Request blocked.');
        return Promise.reject(new Error('Supabase not configured'));
      }
      return fetch(...args);
    }
  }
});
