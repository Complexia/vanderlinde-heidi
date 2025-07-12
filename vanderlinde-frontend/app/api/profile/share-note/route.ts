import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
      const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const { note_id } = await request.json();

  if (!note_id) {
    return NextResponse.json({ error: 'note_id is required' }, { status: 400 });
  }

  const sharing_code = generateSixDigitCode();
  const fifteenMinutesFromNow = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  try {
    const { data, error } = await supabase
      .from('shared_doctor_notes')
      .insert({
        note_id,
        sharing_code,
        expires_at: fifteenMinutesFromNow,
      })
      .select('sharing_code')
      .single();

    if (error) {
      console.error('Error creating sharing code:', error);
      // Could be a collision on the random code, though unlikely.
      // A more robust implementation might retry a few times.
      return NextResponse.json({ error: 'Failed to create sharing link. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ code: data.sharing_code });
  } catch (e) {
    console.error('Unexpected error in share-note endpoint:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
