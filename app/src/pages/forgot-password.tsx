import { withUrqlClient } from 'next-urql';
import React, { FC, useState } from 'react';
import InputForm from '../components/InputForm';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../graphql/client/createUrqlClient';

const ForgotPassword: FC<{}> = ({}) => {
	const [, forgotPassword] = useForgotPasswordMutation();
	const [isSubmitted, setIsSubmitted] = useState(false);
	return (
		<Wrapper>
			{isSubmitted ? (
				<p>Email Sent</p>
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
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
