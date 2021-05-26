import { Heading } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import GameLayout from '../../../components/GameLayout';
import { useGameQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../graphql/client/createUrqlClient';

const Index: FC = ({}) => {
	const router = useRouter();
	const [{ data, fetching }] = useGameQuery({
		variables: { id: parseInt(router.query.id as string) },
	});

	return (
		<GameLayout>
			<Heading mb={4}>{data?.game?.title}</Heading>
		</GameLayout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
