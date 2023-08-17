'use client';

import { Card, CardBody, Link, Tbody, Td } from '@chakra-ui/react';
import Loading from 'components/Loading';
import useSWR from 'swr';

import { Table, TableContainer, Th, Thead, Tr } from '@chakra-ui/react';
import { IPlayer } from 'models/player';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Játékosok'
};

export default function Players() {
	const { data: players, error, isLoading } = useSWR<IPlayer[]>('/api/players');

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div>
			<Card>
				<CardBody>
					<TableContainer>
						<Table>
							<Thead>
								<Tr>
									<Th>Név</Th>
									<Th>Bevonuló</Th>

									<Th w="20" isNumeric>
										Játszott
									</Th>
									<Th w="20" isNumeric>
										Nyert
									</Th>
									<Th w="20" isNumeric>
										Vesztett
									</Th>
								</Tr>
							</Thead>

							<Tbody>
								{players?.map((player) => (
									<Tr key={player.id}>
										<Td>{player.name}</Td>
										<Td>
											{player.song_url && (
												<Link target="_blank" href={player.song_url} color="blue.500">
													Megnyitás
												</Link>
											)}
										</Td>

										<Td isNumeric>0</Td>
										<Td isNumeric>0 (0%)</Td>
										<Td isNumeric>0</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				</CardBody>
			</Card>
		</div>
	);
}
