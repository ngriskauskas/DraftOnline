import React, { FC } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { Box } from '@chakra-ui/layout';
import router from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
	const [, register] = useRegisterMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '', username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register(values);
					if (response.error) {
						setErrors(toErrorMap(response.error, 'username'));
					} else {
						router.push('/');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='username' label='Username' />
						<Box mt={4}>
							<InputField name='email' label='Email' />
						</Box>
						<Box mt={4}>
							<InputField
								name='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Box mt={4}>
							<Button type='submit' isLoading={isSubmitting}>
								Register
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
