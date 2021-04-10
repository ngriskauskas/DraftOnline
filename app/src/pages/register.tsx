import React, { FC } from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import InputForm from '../components/InputForm';
import { toErrorMap } from '../utils/toErrorMap';
import router from 'next/router';

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
	const [, register] = useRegisterMutation();
	return (
		<InputForm
			inputFields={{ email: '', username: '', password: '' }}
			submitText='Register'
			onSubmit={async ({ email, username, password }, { setErrors }) => {
				const response = await register({ email, username, password });
				if (response.error) {
					setErrors(toErrorMap(response.error, 'email'));
				} else {
					router.push('/');
				}
			}}
		/>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
