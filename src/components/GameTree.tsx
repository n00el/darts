import { StarIcon } from '@chakra-ui/icons';
import { IGame } from 'models/game';
import { IGameEvent } from 'models/game_event';
import { IPlayer } from 'models/player';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Bracket, IRenderSeedProps, IRoundProps, Seed, SeedItem, SeedTeam } from 'react-brackets';

interface IProps {
	gameEvent: IGameEvent;
	games: IGame[];
}

export default function GameTree({ gameEvent, games }: IProps) {
	const router = useRouter();

	if (!gameEvent || !games) {
		return <></>;
	}

	const levels = useMemo(() => {
		const result = {} as Record<number, IGame[]>;

		games.forEach((game) => {
			if (!result[game.level]) {
				result[game.level] = [];
			}

			result[game.level].push(game);
		});

		return result;
	}, [games]);

	const rounds = useMemo(() => {
		const result = [] as IRoundProps[];

		Object.keys(levels).forEach((level) => {
			const games = levels[parseInt(level)];

			const seeds = games.map((game) => {
				const player1: IPlayer = gameEvent.players.find((gamePlayer) => gamePlayer.id === game.player1.id);
				const player2: IPlayer = gameEvent.players.find((gamePlayer) => gamePlayer.id === game.player2.id);

				return {
					id: game.id,
					teams: [
						{ id: player1.id, name: player1.name },
						{ id: player2.id, name: player2.name }
					],
					winner: game.winner
				};
			});

			result.push({
				title: `${level}. kör`,
				seeds: seeds
			});
		});

		return result;
	}, [levels]);

	const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex }: IRenderSeedProps) => {
		const winner = seed.winner as IPlayer;
		const isPlayer1Winner = winner?.id === seed.teams[0].id;
		const isPlayer2Winner = winner?.id === seed.teams[1].id;

		return (
			<Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
				<SeedItem
					className="custom-seed"
					onClick={() => {
						router.push(`/game-events/${gameEvent.id}/game/${seed.id}`);
					}}
				>
					<div>
						<SeedTeam className={`custom-seed-team ${isPlayer1Winner ? 'custom-seed-team-winner' : ''}`}>
							{seed.teams[0]?.name}
							{isPlayer1Winner && <StarIcon color="green.700" />}
						</SeedTeam>
						<SeedTeam className={`custom-seed-team ${isPlayer2Winner ? 'custom-seed-team-winner' : ''}`}>
							{seed.teams[1]?.name}
							{isPlayer2Winner && <StarIcon color="green.700" />}
						</SeedTeam>
					</div>
				</SeedItem>
			</Seed>
		);
	};

	return (
		<>
			<Bracket rounds={rounds} renderSeedComponent={CustomSeed} />
		</>
	);
}
