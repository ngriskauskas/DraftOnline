import React, { FC } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { Box } from '@chakra-ui/layout';
import router from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface loginProps {}

const Login: FC<loginProps> = ({}) => {
	const [, login] = useLoginMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.error) {
						setErrors(toErrorMap(response.error, 'email'));
					} else {
						router.push('/');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='email' label='Email' />
						<Box mt={4}>
							<InputField
								name='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Box mt={4}>
							<Button type='submit' isLoading={isSubmitting}>
								Login
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
