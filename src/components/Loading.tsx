import { Center, Spinner } from '@chakra-ui/react';

export default function Loading() {
	return (
		<Center p="12">
			<Spinner size="xl" />
		</Center>
	);
}
