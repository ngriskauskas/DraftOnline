import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import GameLayout from '../../../components/GameLayout';
import PlayerTable from '../../../components/PlayerTable';
import { usePlayersQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../graphql/client/createUrqlClient';

interface playersProps {}

const Players: FC<playersProps> = ({}) => {
	const router = useRouter();

	const [{ data }] = usePlayersQuery({
		variables: {
			gameId: parseInt(router.query.id as string),
		},
		pause: !router.query.id,
	});
	return (
		<GameLayout>
			<PlayerTable players={data?.players}></PlayerTable>
		</GameLayout>
	);
};

export default withUrqlClient(createUrqlClient)(Players);
