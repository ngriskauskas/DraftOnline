import { Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import InputForm from '../../../components/InputForm';
import Layout from '../../../components/Layout';
import { useGameQuery, useJoinGameMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../graphql/client/createUrqlClient';
import { toErrorMap } from '../../../utils/toErrorMap';
import { useIsAuth } from '../../../utils/useIsAuth';

const Join: FC = ({}) => {
	useIsAuth();
	const router = useRouter();
	const gameId = parseInt(router.query.id as string);

	const [{ data }] = useGameQuery({
		pause: !gameId,
		variables: { id: gameId },
	});

	const [, joinGame] = useJoinGameMutation();

	return (
		<Layout variant='small'>
			<Heading mb={4}>{data?.game?.title}</Heading>
			<InputForm
				submitText='join'
				onSubmit={async ({}, { setErrors }) => {
					const { error } = await joinGame({ id: gameId });
					if (error) {
						setErrors(toErrorMap(error, ''));
					} else {
						router.push(`/game/${gameId}`);
					}
				}}
			/>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Join);
