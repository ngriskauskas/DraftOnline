import { withUrqlClient } from 'next-urql';
import React, { FC, useState } from 'react';
import Conditional from '../components/Conditional';
import InputForm from '../components/InputForm';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: FC<{}> = ({}) => {
	const [, forgotPassword] = useForgotPasswordMutation();
	const [isSubmitted, setIsSubmitted] = useState(false);
	return (
		<>
			{isSubmitted ? (
				<Wrapper variant='small'>Email Sent</Wrapper>
			) : (
				<InputForm
					inputFields={{ email: '' }}
					submitText='Send Email'
					onSubmit={async ({ email }) => {
						await forgotPassword({ email });
						setIsSubmitted(true);
					}}
				/>
			)}
		</>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
