import { supabase } from '../src/lib/supabase';

async function checkTable() {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1);
  if (error) {
    console.log('Table site_settings does not exist or error:', error.message);
  } else {
    console.log('Table site_settings exists. Data:', data);
  }
}

checkTable();
