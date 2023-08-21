import { Button, ButtonGroup, Card, CardBody, CardFooter, Heading, Stack, Text } from '@chakra-ui/react';
import { IGameEvent } from 'models/game_event';
import moment from 'moment';
import Link from 'next/link';
import { getDayDiff, getDayDiffText } from 'utils/dayDiff';
import { JoinEventModal } from './JoinEventModal';

interface IProps {
	gameEvent: IGameEvent;
}

export default function GameEventCard(props: IProps) {
	const currentDate = moment();
	const eventDate = moment(props.gameEvent.date);

	const dayDiff = getDayDiff(eventDate, currentDate);
	const dayDiffText = getDayDiffText(eventDate, currentDate);

	return (
		<Card maxW="sm">
			<CardBody>
				<Stack mt="6" spacing="3">
					<Heading size="md">
						{eventDate.format('L')} - {dayDiffText}
					</Heading>
					<Text color="blue.600" fontSize="2xl">
						{props.gameEvent.players?.length || 0} résztvevő
					</Text>
				</Stack>
			</CardBody>
			<CardFooter>
				<ButtonGroup spacing="2">
					<Link href={`game-events/${props.gameEvent.id}`}>
						<Button>Megnyitás</Button>
					</Link>

					{props.gameEvent.is_open && (
						<JoinEventModal gameEvent={props.gameEvent}>
							<Button variant="solid" colorScheme="blue">
								Nevezés
							</Button>
						</JoinEventModal>
					)}
				</ButtonGroup>
			</CardFooter>
		</Card>
	);
}
