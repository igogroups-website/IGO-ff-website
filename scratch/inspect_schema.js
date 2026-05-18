const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://celsdwfmogpejwzbkxad.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbHNkd2Ztb2dwZWp3emJreGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYxNDY4NiwiZXhwIjoyMDkzMTkwNjg2fQ.pyNKC2Sq5_6oy7I7aG0jfo4jzueND1UghG6Xiw0Fn4c';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSchema() {
  // Query information_schema.columns for order_items using RPC (if sql RPC is defined)
  // Since we might not have a generic RPC, we can query it directly if RLS is bypassed by service role key!
  // Wait, direct query on information_schema from Supabase JS client is not typically allowed unless we run a custom query.
  // But wait! Can we run an RPC?
  // Let's check if there's any active sql RPC. Usually not.
  // Instead, let's try to insert a test record or select from order_items with * to see if it lists keys. But since it's empty, * doesn't return keys unless there's at least one row.
  // Wait, does POSTGREST allow us to query the OpenAPI spec of the API?
  // Yes! Fetching the root of the PostgREST API returns the full OpenAPI schema with all tables and columns!
  // This is an incredible hidden trick! Let's write a script to fetch the OpenAPI spec of the supabase project!
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY
      }
    });
    const schema = await res.json();
    console.log('Order Items Schema Columns:');
    const orderItemsDef = schema.definitions?.order_items;
    if (orderItemsDef) {
      console.log('Properties:', Object.keys(orderItemsDef.properties));
      console.log('Required Columns:', orderItemsDef.required);
    } else {
      console.log('Definition for order_items not found in OpenAPI spec.');
    }

    console.log('\nOrders Schema Columns:');
    const ordersDef = schema.definitions?.orders;
    if (ordersDef) {
      console.log('Properties:', Object.keys(ordersDef.properties));
      console.log('Required Columns:', ordersDef.required);
    }
  } catch (err) {
    console.error('Failed to fetch OpenAPI spec:', err);
  }
}

inspectSchema();
