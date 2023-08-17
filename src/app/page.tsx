'use client';

import { Alert, AlertIcon, Box, Divider, Heading, SimpleGrid } from '@chakra-ui/react';
import GameEventCard from 'components/GameEventCard';
import Loading from 'components/Loading';
import { IGameEvent } from 'models/game_event';
import useSWR from 'swr';

export default function Home() {
	const { data: activeEvents, isLoading: isLoadingActiveEvents } = useSWR<IGameEvent[]>('/api/game-events/active');
	const { data: comingEvents, isLoading: isLoadingComingEvents } = useSWR<IGameEvent[]>('/api/game-events/coming');

	if (isLoadingActiveEvents || isLoadingComingEvents) {
		return <Loading />;
	}

	return (
		<div>
			<Box>
				<Heading as="h4" size="lg" mb="3">
					Aktív események
				</Heading>

				{!activeEvents?.length && (
					<Alert mt="3" status="info">
						<AlertIcon />
						Nincs aktív esemény
					</Alert>
				)}

				<SimpleGrid columns={4} spacing={10}>
					{activeEvents?.map((event) => (
						<GameEventCard key={event.id} gameEvent={event} />
					))}
				</SimpleGrid>
			</Box>

			{/* -------------------------------------------------------------------- */}

			<Divider my="6" />

			<Box>
				<Heading as="h4" size="lg" mb="3">
					Közelgő események
				</Heading>

				{!comingEvents?.length && (
					<Alert status="info">
						<AlertIcon />
						Nincs közelgő esemény
					</Alert>
				)}

				<SimpleGrid columns={4} spacing={10}>
					{comingEvents?.map((event) => (
						<GameEventCard key={event.id} gameEvent={event} />
					))}
				</SimpleGrid>
			</Box>
		</div>
	);
}
