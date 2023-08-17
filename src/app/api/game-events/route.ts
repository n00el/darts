import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function GET(request: NextRequest) {
	const { data } = await supabase.from('game_events').select('*, participants(*)');

	return NextResponse.json(data, {
		status: 200
	});
}
