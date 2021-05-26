import { Tr } from '@chakra-ui/react';
import { Table, Tbody, Td, Th, Thead } from '@chakra-ui/table';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import GameLayout from '../../../components/GameLayout';
import PlayerTable from '../../../components/PlayerTable';
import { useMePlayersQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../graphql/client/createUrqlClient';

interface rosterProps {}

const Roster: FC<rosterProps> = ({}) => {
	const router = useRouter();

	const [{ data }] = useMePlayersQuery({
		variables: {
			gameId: parseInt(router.query.id as string),
		},
		pause: !router.query.id,
	});
	return (
		<GameLayout>
			<PlayerTable players={data?.mePlayers}></PlayerTable>
		</GameLayout>
	);
};

export default withUrqlClient(createUrqlClient)(Roster);
