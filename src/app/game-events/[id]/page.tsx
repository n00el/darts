'use client';

import { Alert, AlertIcon, Button, Card, CardBody, Grid, GridItem, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import { JoinEventModal } from 'components/JoinEventModal';
import Loading from 'components/Loading';
import { IGameEvent } from 'models/game_event';
import { IParticipant } from 'models/participant';
import moment from 'moment';
import useSWR from 'swr';
import { getDayDiff, getDayDiffText } from 'utils/dayDiff';

export default function Page({ params }: { params: { id: string } }) {
	const id = params.id;
	const { data: gameEvent, isLoading: isLoading } = useSWR<IGameEvent>(`/api/game-events/${id}`);
	const { data: participants, isLoading: isLoadingParticipants } = useSWR<IParticipant[]>(`/api/game-events/${id}/participants`);

	if (isLoading || isLoadingParticipants) {
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

	return (
		<>
			<Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
				<GridItem rowSpan={2} colSpan={1}>
					<Card>
						<CardBody>
							<Stack spacing="3">
								<Heading size="md">{eventDate.format('L')}</Heading>
								<Heading size="sm">{dayDiffText}</Heading>
							</Stack>
						</CardBody>
					</Card>

					<Card mt="6">
						<CardBody>
							<Text color="blue.600" fontSize="xl">
								{participants?.length || 0} résztvevő:
							</Text>

							<TableContainer>
								<Table size="sm">
									<Tbody>
										<>
											{participants?.map((participant) => (
												<Tr key={participant.id}>
													<Td>{participant.player.name}</Td>
												</Tr>
											))}
										</>
									</Tbody>
								</Table>
							</TableContainer>
						</CardBody>
					</Card>

					<Card mt="6">
						<CardBody>
							<Stack spacing="3">
								{dayDiff > 0 && (
									<JoinEventModal gameEvent={gameEvent}>
										<Button variant="solid" colorScheme="blue" w="100%">
											Nevezés
										</Button>
									</JoinEventModal>
								)}

								<Button variant="solid" colorScheme="purple" w="100%">
									Sorsolás
								</Button>

								<Button variant="solid" colorScheme="purple" w="100%">
									Esemény indítása
								</Button>

								<Button variant="solid" colorScheme="green" w="100%">
									Esemény másolása
								</Button>
							</Stack>
						</CardBody>
					</Card>
				</GridItem>

				<GridItem colSpan={4}>{/*  */}</GridItem>
			</Grid>
		</>
	);
}
