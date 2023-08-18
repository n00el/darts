import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function POST(request: NextRequest, context: { params: { id: string } }) {
	const id = +context.params.id;
	const { data } = await supabase.from('game_events').select('*, participants(player)').eq('id', id).limit(1);

	if (!data) {
		return NextResponse.json(null, {
			status: 404
		});
	}

	const participants = data[0].participants as { player: number }[];

	// if there are no participants, return an error or participants is even
	if (!participants || participants.length % 2 !== 0) {
		return NextResponse.json(
			{
				error: `There are no participants or the number of participants is not even.`
			},
			{
				status: 400
			}
		);
	}

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
			level: 1,
			player1: player1.player,
			player2: player2.player
		});

		games_created.push(game);
	});

	await supabase
		.from('game_events')
		.update({
			is_open: false
		})
		.eq('id', id);

	return NextResponse.json(games_created, {
		status: 200
	});
}
