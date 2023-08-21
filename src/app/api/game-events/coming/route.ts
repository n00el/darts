import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function GET(request: NextRequest) {
	const current_date = new Date().toDateString();
	const { data } = await supabase.from('game_events').select('*, players(*)').eq('is_open', true).gt('date', current_date);

	return NextResponse.json(data, {
		status: 200
	});
}
