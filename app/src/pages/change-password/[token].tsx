import { NextPage } from 'next';
import NextLink from 'next/link';
import { withUrqlClient, NextComponentType } from 'next-urql';
import React, { useState } from 'react';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import InputForm from '../../components/InputForm';
import { Link } from '@chakra-ui/react';
import Conditional from '../../components/Conditional';
import { toErrorMap } from '../../utils/toErrorMap';
import router from 'next/router';

const ChangePassword: NextPage = () => {
	const [, changePassword] = useChangePasswordMutation();
	const [isTokenExpired, setTokenExpired] = useState(false);
	return (
		<InputForm
			inputFields={{ password: '' }}
			submitText='Change Password'
			onSubmit={async ({ password }, { setErrors }) => {
				const response = await changePassword({
					token: router.query.token as string,
					password,
				});
				if (response.error) {
					const errors = toErrorMap(response.error, 'password');
					setErrors(errors);
					if (errors['password'] === 'Change Password Token Expired')
						setTokenExpired(true);
				} else {
					router.push('/');
				}
			}}
			submissionComponent={
				<Conditional showing={isTokenExpired}>
					<NextLink href='/forgot-password'>
						<Link>Back to Forgot Password</Link>
					</NextLink>
				</Conditional>
			}
		/>
	);
};

export default withUrqlClient(createUrqlClient)(
	(ChangePassword as unknown) as NextComponentType
);
