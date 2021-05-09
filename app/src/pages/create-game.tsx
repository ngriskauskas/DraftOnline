import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React, { FC } from 'react';
import InputForm from '../components/InputForm';
import Layout from '../components/Layout';
import { useCreateGameMutation } from '../generated/graphql';
import { createUrqlClient } from '../graphql/client/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';

const CreateGame: FC<{}> = ({}) => {
	const [, createGame] = useCreateGameMutation();
	useIsAuth();
	return (
		<Layout>
			<InputForm
				inputFields={{ title: '' }}
				submitText='create game'
				onSubmit={async ({ title }, { setErrors }) => {
					const { error } = await createGame({ title });
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

export default withUrqlClient(createUrqlClient)(CreateGame);
