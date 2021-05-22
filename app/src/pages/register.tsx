import React, { FC } from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import InputForm from '../components/InputForm';
import { toErrorMap } from '../utils/toErrorMap';
import router from 'next/router';
import { createUrqlClient } from '../graphql/client/createUrqlClient';
import Wrapper from '../components/Wrapper';

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
	const [, register] = useRegisterMutation();
	return (
		<Wrapper>
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
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
