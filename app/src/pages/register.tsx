import React, { FC } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
	const [, register] = useRegisterMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values) => {
					const response = await register(values);
					if (response.error) {
						console.error(response.error.graphQLErrors);
					} else {
						console.error(response.data);
					}
				}}>
				{({ values, handleChange }) => (
					<Form>
						<InputField name='username' label='Username' />
						<InputField
							name='password'
							label='Password'
							type='password'
						/>
						<Button type='submit'>Register</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;
