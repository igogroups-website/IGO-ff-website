const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://celsdwfmogpejwzbkxad.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbHNkd2Ztb2dwZWp3emJreGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYxNDY4NiwiZXhwIjoyMDkzMTkwNjg2fQ.pyNKC2Sq5_6oy7I7aG0jfo4jzueND1UghG6Xiw0Fn4c';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkCart() {
  const { data: cartItems, error } = await supabase.from('cart').select('*');
  console.log('All Cart Items (Service Role):', cartItems);
  if (error) console.error('Error:', error);
}

checkCart();
