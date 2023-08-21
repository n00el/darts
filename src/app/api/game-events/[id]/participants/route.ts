import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function POST(request: NextRequest, context: { params: { id: string } }) {
	const id = +context.params.id;
	const body = await request.json();
	const playerId = body.playerId;

	const { data, error } = await supabase.from('participants').insert({
		game_event: id,
		player: playerId
	});

	return NextResponse.json(data, {
		status: 200
	});
}
