import { Heading } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React, { FC } from 'react';
import Layout from '../../components/Layout';
import { useGameQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../graphql/client/createUrqlClient';

const Game: FC = ({}) => {
	const [{ data, fetching }] = useGameQuery({
		variables: { id: parseInt(router.query.id as string) },
	});

	return (
		<Layout variant='regular'>
			<Heading mb={4}>{data?.game?.title}</Heading>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Game);
