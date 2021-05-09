import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { Link, Stack, Text, Heading, Box, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useGamesQuery } from '../generated/graphql';
import { useScroll } from '../utils/useScroll';
import { useState } from 'react';
import React from 'react';
import { createUrqlClient } from '../graphql/client/createUrqlClient';

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
