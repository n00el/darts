import { StarIcon } from '@chakra-ui/icons';
import { IGame } from 'models/game';
import { IGameEvent } from 'models/game_event';
import { IParticipant } from 'models/participant';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Bracket, IRenderSeedProps, IRoundProps, Seed, SeedItem, SeedTeam } from 'react-brackets';

interface IProps {
	gameEvent: IGameEvent;
	participants: IParticipant[];
	games: IGame[];
}

export default function GameTree({ gameEvent, participants, games }: IProps) {
	const router = useRouter();

	if (!gameEvent || !participants || !games) {
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
				const participant1: IParticipant = participants.find((participant) => participant.player.id === game.player1);
				const participant2: IParticipant = participants.find((participant) => participant.player.id === game.player2);

				return {
					id: game.id,
					teams: [
						{ name: participant1.player.name, id: participant1.player.id },
						{ name: participant2.player.name, id: participant2.player.id }
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
		const winner = seed.winner;
		const isPlayer1Winner = winner === seed.teams[0].id;
		const isPlayer2Winner = winner === seed.teams[1].id;

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
