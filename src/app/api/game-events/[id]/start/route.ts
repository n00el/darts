import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function POST(request: NextRequest, context: { params: { id: string } }) {
	const id = +context.params.id;
	const { data } = await supabase.from('game_events').select('*, participants(id)').eq('id', id).limit(1);

	if (!data) {
		return NextResponse.json(null, {
			status: 404
		});
	}

	const participants = data[0].participants as { id: number }[];

	// create a random order of participants
	const shuffledParticipants = participants.sort(() => Math.random() - 0.5);

	// create pairs of participants
	const pairs = [];
	for (let i = 0; i < shuffledParticipants.length; i += 2) {
		pairs.push([shuffledParticipants[i], shuffledParticipants[i + 1]]);
	}

	let games_created: any[] = [];

	pairs.forEach(async (pair, index) => {
		const player1 = pair[0];
		const player2 = pair[1];

		const game = await supabase.from('games').insert({
			game_event: id,
			player1: player1.id,
			player2: player2?.id
		});

		games_created.push(game);
	});

	return NextResponse.json(games_created, {
		status: 200
	});
}
