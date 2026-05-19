const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://celsdwfmogpejwzbkxad.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbHNkd2Ztb2dwZWp3emJreGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYxNDY4NiwiZXhwIjoyMDkzMTkwNjg2fQ.pyNKC2Sq5_6oy7I7aG0jfo4jzueND1UghG6Xiw0Fn4c';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data: streams } = await supabase.from('farm_streams').select('*');
  console.log('--- FARM STREAMS ---');
  streams.forEach(s => {
    console.log(`- ID: ${s.id}, Name: "${s.name}", Location: "${s.location}", Active: ${s.is_active}`);
  });

  const { data: banners } = await supabase.from('banners').select('*');
  console.log('--- BANNERS ---');
  banners.forEach(b => {
    console.log(`- ID: ${b.id}, Title: "${b.title}", Active: ${b.is_active}`);
  });

  const { data: stories } = await supabase.from('farm_stories').select('*');
  console.log('--- FARM STORIES ---');
  stories.forEach(s => {
    console.log(`- ID: ${s.id}, Title: "${s.title}", Farmer: "${s.farmer}"`);
  });
}

check();
