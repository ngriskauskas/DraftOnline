import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { useToggle } from '../utils/useToggle';

interface UpvoteSectionProps {
	post: PostSnippetFragment;
}

const UpvoteSection: FC<UpvoteSectionProps> = ({ post }) => {
	const [, vote] = useVoteMutation();

	return (
		<Flex direction='column' alignItems='center' mr={4}>
			<IconButton
				onClick={() => {
					vote({ value: 1, postId: post.id });
				}}
				size='sm'
				aria-label='Upvote'
				colorScheme={post.upvote?.value === 1 ? 'green' : undefined}
				icon={<ChevronUpIcon boxSize={5} />}
			/>
			{post.points}
			<IconButton
				onClick={() => {
					vote({ value: -1, postId: post.id });
				}}
				size='sm'
				aria-label='Downvote'
				colorScheme={post.upvote?.value === -1 ? 'red' : undefined}
				icon={<ChevronDownIcon boxSize={5} />}
			/>
		</Flex>
	);
};

export default UpvoteSection;
