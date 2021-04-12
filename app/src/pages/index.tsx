import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Link, Stack, Text, Heading, Box, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { usePostsQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { usePagination } from '../utils/usePagination';
import { useState } from 'react';

const Index = () => {
	const [cursor, setCursor] = useState(null as null | string);
	const [{ data, fetching }] = usePostsQuery({
		variables: {
			limit: 50,
			cursor,
		},
	});
	const hasMore = usePagination({ data, fetching });
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
					data.posts.map((post: any) => (
						<Box key={post.id} p={5} shadow='md' borderWidth='1px'>
							<Heading fontSize='xl'>{post.title}</Heading>
							<Text mt={4}>{post.textSnippet}</Text>
						</Box>
					))}
			</Stack>
			{data && hasMore && (
				<Flex>
					<Button
						onClick={async () => {
							setCursor(
								data.posts[data.posts.length - 1].createdAt
							);
						}}
						isLoading={fetching}
						m='auto'
						my={8}>
						load more
					</Button>
				</Flex>
			)}
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient)(Index);
