import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function GET(request: NextRequest) {
	const game_event = request.nextUrl.searchParams.get('game_event');

	if (!game_event) {
		return NextResponse.json(
			{
				error: 'game_event is required'
			},
			{
				status: 404
			}
		);
	}

	const { data } = await supabase.from('games').select('*, player1(*), player2(*), winner(*)').eq('game_event', +game_event);

	return NextResponse.json(data, {
		status: 200
	});
}
