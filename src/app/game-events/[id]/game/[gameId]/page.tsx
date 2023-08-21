'use client';

import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Card, CardBody, CardHeader, Center, Grid, GridItem, HStack, Heading } from '@chakra-ui/react';
import Loading from 'components/Loading';
import { IGame } from 'models/game';
import { IGameEvent } from 'models/game_event';
import useSWR from 'swr';

export default function Page({ params }: { params: { id: string; gameId: string } }) {
	const id = params.id;
	const gameId = params.gameId;

	const { data: gameEvent, isLoading: isLoadingGameEvent } = useSWR<IGameEvent>(`/api/game-events/${id}`);
	const { data: game, isLoading: isLoadingGame } = useSWR<IGame>(`/api/games/${gameId}`);

	if (isLoadingGame || isLoadingGameEvent) {
		return <Loading />;
	}

	return (
		<>
			<Box mb="6">
				<Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Főoldal</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbItem>
						<BreadcrumbLink href={`/game-events/${id}`}>{gameEvent.date}</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbItem isCurrentPage>
						<BreadcrumbLink href="#">
							{game.player1.name} vs {game.player2.name} - {game.level}. kör
						</BreadcrumbLink>
					</BreadcrumbItem>
				</Breadcrumb>
			</Box>

			<Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
				<GridItem rowSpan={2} colSpan={1}>
					<Card>
						<CardHeader>
							<Center>
								<HStack>
									<Heading size="md">{game.player1.name}</Heading>
									<div>vs</div>
									<Heading size="md">{game.player2.name}</Heading>
								</HStack>
							</Center>
						</CardHeader>
						<CardBody></CardBody>
					</Card>
				</GridItem>

				<GridItem colSpan={4}></GridItem>
			</Grid>
		</>
	);
}
