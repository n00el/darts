import { IPlayer } from './player';
import { ISet } from './set';

export interface IGame {
	id: number;
	created_at: string;
	game_event: number;
	level: number;

	player1: IPlayer;
	player2: IPlayer;

	winner: IPlayer;

	sets: ISet[];
}
