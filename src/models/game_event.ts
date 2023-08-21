import { IPlayer } from './player';

export interface IGameEvent {
	id: number;
	created_at: string;
	date: string;
	is_open: boolean;
	score_to_win: number;
	sets: number;
	legs: number;

	players?: IPlayer[];
}
