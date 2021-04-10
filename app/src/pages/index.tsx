import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';

const Index = () => {
	return (
		<Layout variant='regular'>
			<NextLink href='/create-post'>
				<Link> create post</Link>
			</NextLink>
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient)(Index);
