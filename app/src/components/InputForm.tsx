import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Formik, FormikHelpers, FormikValues, Form } from 'formik';
import React, { FC, ReactNode } from 'react';
import InputField from './InputField';
import Wrapper from './Wrapper';

interface FormProps {
	inputFields: FormikValues;
	submitText: string;
	submissionComponent?: ReactNode;
	onSubmit: (
		values: FormikValues,
		formikHelpers: FormikHelpers<FormikValues>
	) => void | Promise<any>;
}

const InputForm: FC<FormProps> = ({
	inputFields,
	submitText,
	submissionComponent,
	onSubmit,
}: FormProps) => {
	return (
		<Wrapper variant='small'>
			<Formik initialValues={inputFields} onSubmit={onSubmit}>
				{({ isSubmitting }) => (
					<Form>
						{Object.keys(inputFields).map((field) => (
							<Box mt={4} key={field}>
								<InputField name={field} />
							</Box>
						))}
						<Flex mt={4}>
							<Box>
								<Button type='submit' isLoading={isSubmitting}>
									{submitText}
								</Button>
							</Box>
							<Box ml='auto'>{submissionComponent}</Box>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default InputForm;
