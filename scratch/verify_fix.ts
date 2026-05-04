
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

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const normalizeProduct = (p: any) => {
  return {
    ...p,
    category: p.category || (p.category_id === 'cat-veg' ? 'Vegetables' : p.category_id === 'cat-fruit' ? 'Fruits' : p.category_id) || '',
    image_url: p.image_url || (Array.isArray(p.image_urls) ? p.image_urls[0] : null) || ''
  };
};

async function verify() {
  const { data, error } = await supabase.from('products').select('*').limit(5);
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Original data:', JSON.stringify(data[0], null, 2));
  console.log('Normalized data:', JSON.stringify(normalizeProduct(data[0]), null, 2));
}

verify();
