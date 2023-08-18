'use client';

import { Link } from '@chakra-ui/next-js';
import { Container, Divider, HStack } from '@chakra-ui/react';
import moment from 'moment';
import { Inter } from 'next/font/google';
import './globals.scss';
import { Providers } from './providers';

const locale = 'hu';
moment.locale(locale);

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<Container my="6" minW="1440px">
						<HStack spacing="6">
							<img src="/logo.png" alt="logo" style={{ height: 50 }} />

							<HStack spacing="24px">
								<Link href="/">Főoldal</Link>
								<Link href="/game-events">Események</Link>
								<Link href="/leaderboard">Ranglista</Link>
								<Link href="/players">Játékosok</Link>
							</HStack>
						</HStack>

						<Divider mt="6" />
					</Container>

					<Container mt="6" minW="1440px" py="6">
						{children}
					</Container>
				</Providers>
			</body>
		</html>
	);
}
