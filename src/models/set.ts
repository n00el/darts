import { ILeg } from './leg';

export interface ISet {
	id: number;
	created_at: string;
	number: number;

	legs: ILeg[];
}
