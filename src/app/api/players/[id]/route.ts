import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
	const id = +context.params.id;
	const { data } = await supabase.from('players').select().eq('id', id).limit(1);

	if (!data) {
		return NextResponse.json(
			{
				error: 'Player not found'
			},
			{
				status: 404
			}
		);
	}

	return NextResponse.json(data[0], {
		status: 200
	});
}
