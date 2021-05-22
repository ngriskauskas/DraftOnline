import React, { FC } from 'react';
import { useLoginMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import InputForm from '../components/InputForm';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import { toErrorMap } from '../utils/toErrorMap';
import router from 'next/router';
import { createUrqlClient } from '../graphql/client/createUrqlClient';
import Wrapper from '../components/Wrapper';

const Login: FC = ({}) => {
	const [, login] = useLoginMutation();
	return (
		<Wrapper>
			<InputForm
				inputFields={{ email: '', password: '' }}
				submitText='login'
				onSubmit={async ({ email, password }, { setErrors }) => {
					const response = await login({ email, password });
					if (response.error) {
						setErrors(toErrorMap(response.error, 'email'));
					} else {
						router.push((router.query.next as string) ?? '/');
					}
				}}
				submissionComponent={
					<NextLink href='/forgot-password'>
						<Link>Forgot Password</Link>
					</NextLink>
				}
			/>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
