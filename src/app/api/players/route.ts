import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import supabase from 'utils/supabase';

export async function GET(request: NextRequest) {
	const { data } = await supabase.from('players').select('*');

	return NextResponse.json(data, {
		status: 200
	});
}

export async function POST(request: NextRequest) {
	const data: any = null;

	return NextResponse.json(data, {
		status: 200
	});
}
