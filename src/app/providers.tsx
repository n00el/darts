'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import fetcher from 'utils/fetcher';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SWRConfig
			value={{
				/* refreshInterval: 3000, */
				fetcher: fetcher
			}}
		>
			<CacheProvider>
				<ChakraProvider>{children}</ChakraProvider>
			</CacheProvider>
		</SWRConfig>
	);
}
