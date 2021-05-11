import { Badge, Box, Flex, Heading, Link, Stack } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { GameStatus, useGamesQuery } from '../generated/graphql';
import { createUrqlClient } from '../graphql/client/createUrqlClient';
import { useScroll } from '../utils/useScroll';

const Index = () => {
	const [cursor, setCursor] = useState(null as null | string);
	const [{ data, fetching }] = useGamesQuery({
		variables: {
			limit: 25,
			cursor,
		},
	});

	useScroll(() => {
		if (data) setCursor(data.games[data.games.length - 1].createdAt);
	});

	const statusColor = (status: GameStatus) => {
		switch (status) {
			case GameStatus.Open:
				return 'green';
			case GameStatus.Active:
				return 'blue';
			default:
				return 'red';
		}
	};

	return (
		<Layout variant='regular'>
			<Flex align='center'>
				<Heading>Draft Online</Heading>
				<NextLink href='/create-game'>
					<Link ml='auto'>Create New Game</Link>
				</NextLink>
			</Flex>
			{fetching ? (
				<p>Loading...</p>
			) : (
				<Stack mt={2}>
					{data &&
						data.games.map((game) =>
							!game ? null : (
								<Box key={game.id} p={5} shadow='md' borderWidth='1px'>
									<Flex>
										<Box flex={1}>
											<NextLink href='/game/[id]' as={`/game/${game.id}`}>
												<Link>
													<Heading fontSize='xl'>{game.title}</Heading>
												</Link>
											</NextLink>
											{game.creator.username}
										</Box>
										<Box d='flex' flexDirection='column'>
											<Badge
												mb='1'
												colorScheme={
													game.meJoined ? 'purple' : statusColor(game.status)
												}>
												{game.meJoined ? 'Joined' : game.status}
											</Badge>
											{game.status === GameStatus.Open && !game.meJoined && (
												<NextLink
													href='/game/[id]/join'
													as={`/game/${game.id}/join`}>
													<Link>Join</Link>
												</NextLink>
											)}
										</Box>
									</Flex>
								</Box>
							)
						)}
				</Stack>
			)}
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient)(Index);
