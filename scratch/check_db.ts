
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, is_active, is_seasonal');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  console.log('Total products:', data.length);
  if (data.length > 0) {
    console.log('Sample categories:', [...new Set(data.map(p => p.category))]);
    console.log('First 5 products:', data.slice(0, 5));
  }
}

checkProducts();
