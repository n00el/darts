'use client';

import { ChevronRightIcon } from '@chakra-ui/icons';
import { Alert, AlertIcon, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Card, CardBody, CardHeader, Center, Grid, GridItem, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Tr, VStack } from '@chakra-ui/react';
import GameTree from 'components/GameTree';
import { JoinEventModal } from 'components/JoinEventModal';
import Loading from 'components/Loading';
import { IGame } from 'models/game';
import { IGameEvent } from 'models/game_event';
import moment from 'moment';
import useSWR from 'swr';
import { getDayDiff, getDayDiffText } from 'utils/dayDiff';

export default function Page({ params }: { params: { id: string } }) {
	const id = params.id;
	const { data: gameEvent, isLoading: isLoading } = useSWR<IGameEvent>(`/api/game-events/${id}`);
	const { data: games, isLoading: isLoadingGames } = useSWR<IGame[]>(`/api/games?game_event=${id}`);

	if (isLoading) {
		return <Loading />;
	}

	if (!gameEvent) {
		return (
			<Alert status="error">
				<AlertIcon />
				Ismeretlen esemény
			</Alert>
		);
	}

	const currentDate = moment();
	const eventDate = moment(gameEvent.date);

	const dayDiff = getDayDiff(eventDate, currentDate);
	const dayDiffText = getDayDiffText(eventDate, currentDate);

	const startEvent = async () => {
		await fetch(`/api/game-events/${id}/start`, {
			method: 'POST'
		});

		window.location.reload();
	};

	return (
		<>
			<Box mb="6">
				<Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Főoldal</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbItem isCurrentPage>
						<BreadcrumbLink href={`/game-events/${id}`}>{gameEvent.date}</BreadcrumbLink>
					</BreadcrumbItem>
				</Breadcrumb>
			</Box>

			<Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
				<GridItem rowSpan={2} colSpan={1}>
					<Card>
						<CardHeader>
							<Center>
								<VStack>
									<Heading size="md">{eventDate.format('L')}</Heading>
									<Heading size="sm">{dayDiffText}</Heading>
								</VStack>
							</Center>
						</CardHeader>

						<CardBody>
							<TableContainer>
								<Table size="sm">
									<Tbody>
										<Tr>
											<Td>Sets:</Td>
											<Td>{gameEvent.sets}</Td>
										</Tr>
										<Tr>
											<Td>Legs:</Td>
											<Td>{gameEvent.legs}</Td>
										</Tr>
										<Tr>
											<Td>Scores:</Td>
											<Td>{gameEvent.score_to_win}</Td>
										</Tr>
									</Tbody>
								</Table>
							</TableContainer>
						</CardBody>
					</Card>

					<Card mt="6">
						<CardBody>
							<>
								<Text color="blue.600" fontSize="xl">
									{gameEvent.players?.length || 0} résztvevő:
								</Text>

								<TableContainer>
									<Table size="sm">
										<Tbody>
											<>
												{gameEvent.players?.map((player) => (
													<Tr key={player.id}>
														<Td>{player.name}</Td>
													</Tr>
												))}
											</>
										</Tbody>
									</Table>
								</TableContainer>
							</>
						</CardBody>
					</Card>

					<Card mt="6">
						<CardBody>
							<Stack spacing="3">
								{gameEvent.is_open && (
									<JoinEventModal gameEvent={gameEvent}>
										<Button variant="solid" colorScheme="blue" w="100%">
											Nevezés
										</Button>
									</JoinEventModal>
								)}

								{!isLoadingGames && games?.length === 0 && dayDiff === 0 && (
									<Button variant="solid" colorScheme="purple" w="100%" onClick={startEvent}>
										Esemény indítása
									</Button>
								)}

								<Button variant="solid" colorScheme="green" w="100%">
									Esemény másolása
								</Button>
							</Stack>
						</CardBody>
					</Card>
				</GridItem>

				<GridItem colSpan={4}>
					{isLoadingGames ? (
						<>
							<Loading />
						</>
					) : (
						<>
							<GameTree gameEvent={gameEvent} games={games} />
						</>
					)}
				</GridItem>
			</Grid>
		</>
	);
}
