import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
	const id = +context.params.id;
	const { data } = await supabase.from('participants').select('*, player(*)').eq('game_event', id);

	if (!data?.length) {
		return NextResponse.json(null, {
			status: 404
		});
	}

	return NextResponse.json(data, {
		status: 200
	});
}

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
