import { withUrqlClient } from 'next-urql';
import React, { FC } from 'react';
import InputForm from '../components/InputForm';
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost: FC<{}> = ({}) => {
	return (
		<InputForm
			inputFields={{ title: '', text: '' }}
			submitText='create post'
			onSubmit={async (values, { setErrors }) => {
				console.log(values);
			}}
		/>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
