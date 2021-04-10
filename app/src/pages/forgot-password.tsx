import { withUrqlClient } from 'next-urql';
import React, { FC } from 'react';
import InputForm from '../components/InputForm';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: FC<{}> = ({}) => {
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<InputForm
			inputFields={{ email: '' }}
			submitText='Send Email'
			onSubmit={(values, { setErrors }) => {}}
		/>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
