import { Alert, AlertIcon, Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { IGameEvent } from 'models/game_event';
import { IParticipant } from 'models/participant';
import { IPlayer } from 'models/player';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { getDayDiff, getDayDiffText } from 'utils/dayDiff';
import Loading from './Loading';

interface IProps {
	gameEvent: IGameEvent;
	children: React.ReactNode;
	onSucces?: () => void;
}

export function JoinEventModal({ gameEvent, onSucces, children }: IProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [participants, setParticipants] = useState<IParticipant[]>([]);
	const [players, setPlayers] = useState<IPlayer[]>([]);

	const [selectedPlayerId, setSelectedPlayerId] = useState<number>();
	const [showSuccess, setShowSuccess] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const currentDate = moment();
	const eventDate = moment(gameEvent.date);

	const dayDiff = getDayDiff(eventDate, currentDate);
	const dayDiffText = getDayDiffText(eventDate, currentDate);

	useEffect(() => {
		const runFetch = async () => {
			setIsLoading(true);

			const participantsResponse = await fetch(`/api/game-events/${gameEvent.id}/participants`);
			const participantsData = await participantsResponse.json();

			const playersResponse = await fetch('/api/players');
			const playersData = await playersResponse.json();

			setParticipants(participantsData);
			setPlayers(playersData);

			setIsLoading(false);
		};

		if (isOpen) {
			runFetch();
		} else {
			if (showSuccess) {
				window.location.reload();
			}
		}
	}, [isOpen]);

	const freePlayers = useMemo(() => {
		return players.filter((player) => !participants.find((participant) => participant.player.id === player.id));
	}, [players, participants]);

	const handleJoin = async () => {
		if (!selectedPlayerId) return;

		const resp = await fetch(`/api/game-events/${gameEvent.id}/participants`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				playerId: selectedPlayerId
			})
		}).then((r) => r.json());

		setShowSuccess(true);

		if (onSucces) {
			onSucces();
		}
	};

	const renderModal = () => {
		return (
			<>
				<VStack spacing={4} align="stretch">
					<div>
						<Text>Esemény időpontja:</Text>
						<Input value={`${eventDate.format('L')} - ${dayDiffText}`} disabled />
					</div>

					<div>
						<Text>Nevező játékos:</Text>
						<Select placeholder="Játékos" value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(parseInt(e.target.value))}>
							{freePlayers.map((player) => (
								<option key={player.id} value={player.id}>
									{player.name}
								</option>
							))}
						</Select>
					</div>
				</VStack>
			</>
		);
	};

	return (
		<>
			<div onClick={onOpen}>
				{children}

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Nevezés eseményre</ModalHeader>
						<ModalCloseButton />

						<ModalBody>
							{isLoading && <Loading />}
							{dayDiff <= 0 && !isLoading && <Text color="red.500">A nevezési határidő lejárt!</Text>}
							{showSuccess && (
								<Alert status="success">
									<AlertIcon />
									Sikeres nevezés!
								</Alert>
							)}
							{!isLoading && dayDiff > 0 && !showSuccess && renderModal()}
						</ModalBody>

						<ModalFooter>
							<HStack spacing={4}>
								<Button variant="ghost" onClick={onClose}>
									Bezárom
								</Button>

								{!isLoading && dayDiff > 0 && !showSuccess && (
									<>
										<Button colorScheme="blue" onClick={handleJoin}>
											Nevezek
										</Button>
									</>
								)}
							</HStack>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</div>
		</>
	);
}
