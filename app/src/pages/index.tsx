import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Link, Stack, Text, Heading, Box, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';
import {
	useDeletePostMutation,
	useGamesQuery,
	usePostsQuery,
} from '../generated/graphql';
import { usePagination } from '../utils/usePagination';
import { useState } from 'react';
import UpvoteSection from '../components/UpvoteSection';
import { IconButton } from '@chakra-ui/button';
import { DeleteIcon } from '@chakra-ui/icons';

const Index = () => {
	const [cursor, setCursor] = useState(null as null | string);
	const [{ data }] = useGamesQuery({
		variables: {
			limit: 25,
			cursor,
		},
	});

	usePagination(() => {
		if (data) setCursor(data.games[data.games.length - 1].createdAt);
	});

	return (
		<Layout variant='regular'>
			<Flex align='center'>
				<Heading>Draft Online</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'> Create New Game</Link>
				</NextLink>
			</Flex>
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
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient)(Index);
