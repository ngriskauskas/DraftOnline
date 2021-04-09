import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient, NextComponentType } from 'next-urql';
import router from 'next/router';
import React, { FC } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	const [, changePassword] = useChangePasswordMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({ token, ...values });
					if (response.error) {
						setErrors(toErrorMap(response.error, 'password'));
					} else {
						router.push('/');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='password'
							label='New Password'
							type='password'
						/>

						<Box mt={4}>
							<Button type='submit' isLoading={isSubmitting}>
								Change Password
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

ChangePassword.getInitialProps = ({ query }) => ({
	token: query.token as string,
});

export default withUrqlClient(createUrqlClient)(
	(ChangePassword as unknown) as NextComponentType
);
