import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://celsdwfmogpejwzbkxad.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbHNkd2Ztb2dwZWp3emJreGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYxNDY4NiwiZXhwIjoyMDkzMTkwNjg2fQ.pyNKC2Sq5_6oy7I7aG0jfo4jzueND1UghG6Xiw0Fn4c';

export async function POST(req: Request) {
  try {
    const { id, email, name } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('[Sync User] Missing Supabase environment variables');
      return NextResponse.json({ error: 'Database credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Upsert into public.users to satisfy the foreign key constraint on orders
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id,
        email: email || null,
        name: name || null,
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('[Sync User] Error upserting into public.users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[Sync User] Successfully synced user:', id);
    return NextResponse.json({ success: true, user: data?.[0] });
  } catch (error: any) {
    console.error('[Sync User] Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
