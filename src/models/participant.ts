import { IPlayer } from './player';

export interface IParticipant {
	id: number;
	created_at: string;
	player: IPlayer;
	game_event: number;
}
