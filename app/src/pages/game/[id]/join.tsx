import {
	Box,
	Button,
	Flex,
	Heading,
	Radio,
	RadioGroup,
	Stack,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import InputForm from '../../../components/InputForm';
import Layout from '../../../components/Layout';
import {
	useGameQuery,
	useJoinGameMutation,
	useTeamsQuery,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../graphql/client/createUrqlClient';
import { toErrorMap } from '../../../utils/toErrorMap';
import { useIsAuth } from '../../../utils/useIsAuth';

const Join: FC = ({}) => {
	useIsAuth();
	const router = useRouter();
	const gameId = parseInt(router.query.id as string);

	const [{ data: gameData }] = useGameQuery({
		pause: !gameId,
		variables: { id: gameId },
	});

	const [{ data: teamsData }] = useTeamsQuery({
		pause: !gameId,
		variables: { gameId },
	});

	const [teamId, setTeamId] = useState('');
	const [error, setError] = useState('');

	const [, joinGame] = useJoinGameMutation();

	return (
		<Layout variant='small'>
			<Heading mb={4}>{gameData?.game?.title}</Heading>
			<RadioGroup onChange={setTeamId} value={teamId}>
				<Stack>
					{teamsData &&
						teamsData.teams.map((team) => (
							<Radio
								key={team.id}
								value={String(team.id)}
								disabled={!!team.manager}>
								{team.name}
							</Radio>
						))}
				</Stack>
			</RadioGroup>
			<Flex align='center'>
				<InputForm
					submitText='join'
					onSubmit={async () => {
						const { error } = await joinGame({
							id: gameId,
							teamId: parseInt(teamId),
						});
						if (error) {
							setError(error.graphQLErrors[0].message);
						} else {
							router.push(`/game/${gameId}`);
						}
					}}
				/>
				{error && (
					<Box color='red' ml={3}>
						{error}
					</Box>
				)}
			</Flex>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Join);
