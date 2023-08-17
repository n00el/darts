'use client';

import { Alert, AlertIcon, SimpleGrid } from '@chakra-ui/react';
import GameEventCard from 'components/GameEventCard';
import Loading from 'components/Loading';
import { IGameEvent } from 'models/game_event';
import useSWR from 'swr';

export default function Page() {
	const { data: events, isLoading: isLoading } = useSWR<IGameEvent[]>('/api/game-events');

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			{!events?.length && (
				<Alert mt="3" status="info">
					<AlertIcon />
					Nincs esemény
				</Alert>
			)}

			<SimpleGrid columns={4} spacing={10}>
				{events?.map((event) => (
					<GameEventCard key={event.id} gameEvent={event} />
				))}
			</SimpleGrid>
		</>
	);
}
