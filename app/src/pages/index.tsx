import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Link, Stack, Text, Heading, Box, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql';
import { usePagination } from '../utils/usePagination';
import { useState } from 'react';
import UpvoteSection from '../components/UpvoteSection';
import { IconButton } from '@chakra-ui/button';
import { DeleteIcon } from '@chakra-ui/icons';

const Index = () => {
	const [cursor, setCursor] = useState(null as null | string);
	const [{ data }] = usePostsQuery({
		variables: {
			limit: 25,
			cursor,
		},
	});
	const [, deletePost] = useDeletePostMutation();

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
					data.posts.map((post) =>
						!post ? null : (
							<Box key={post.id} p={5} shadow='md' borderWidth='1px'>
								<Flex>
									<UpvoteSection post={post} />
									<Box flex={1}>
										<NextLink href='/post/[id]' as={`/post/${post.id}`}>
											<Link>
												<Heading fontSize='xl'>{post.title}</Heading>
											</Link>
										</NextLink>
										{post.author.username}
										<Flex>
											<Text mt={4}>{post.textSnippet}</Text>
											<IconButton
												ml='auto'
												colorScheme='red'
												aria-label='Delete Post'
												onClick={() => deletePost({ id: post.id })}
												icon={<DeleteIcon />}></IconButton>
										</Flex>
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
