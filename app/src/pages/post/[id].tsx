import { Heading } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { FC } from 'react';
import Layout from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface PostProps {}

const Post: FC<PostProps> = ({}) => {
	const router = useRouter();
	const [{ data, fetching }] = usePostQuery({ variables: { id: parseInt(router.query.id as string) } });

	return (
		<Layout variant='regular'>
			<Heading mb={4}>{data?.post?.title}</Heading>
			{data?.post?.text}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
