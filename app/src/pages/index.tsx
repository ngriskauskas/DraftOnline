import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Link, Stack, Text, Heading, Box, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { usePostsQuery } from '../generated/graphql';
import { usePagination } from '../utils/usePagination';
import { useState } from 'react';
import UpvoteSection from '../components/UpvoteSection';

const Index = () => {
	const [cursor, setCursor] = useState(null as null | string);
	const [{ data }] = usePostsQuery({
		variables: {
			limit: 25,
			cursor,
		},
	});

	usePagination(() => {
		if (data) setCursor(data.posts[data.posts.length - 1].createdAt);
	});

	return (
		<Layout variant='regular'>
			<Flex align='center'>
				<Heading>Gardentopia</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'> create post</Link>
				</NextLink>
			</Flex>
			<Stack mt={2}>
				{data &&
					data.posts.map((post) => (
						<Box key={post.id} p={5} shadow='md' borderWidth='1px'>
							<Flex>
								<UpvoteSection post={post} />
								<Box>
									<NextLink href='/post/[id]' as={`/post/${post.id}`}>
										<Link>
											<Heading fontSize='xl'>{post.title}</Heading>
										</Link>
									</NextLink>
									{post.author.username}
									<Text mt={4}>{post.textSnippet}</Text>
								</Box>
							</Flex>
						</Box>
					))}
			</Stack>
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient)(Index);
