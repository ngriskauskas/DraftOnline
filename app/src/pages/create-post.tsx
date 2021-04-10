import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React, { FC, useEffect } from 'react';
import InputForm from '../components/InputForm';
import Layout from '../components/Layout';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: FC<{}> = ({}) => {
	const [, createPost] = useCreatePostMutation();
	useIsAuth();
	return (
		<Layout>
			<InputForm
				inputFields={{ title: '' }}
				textFields={{ text: '' }}
				submitText='create post'
				onSubmit={async ({ title, text }, { setErrors }) => {
					const { error } = await createPost({ title, text });
					if (error) {
						setErrors(toErrorMap(error, 'title'));
					} else {
						router.push('/');
					}
				}}
			/>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
