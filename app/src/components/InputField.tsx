import {
	FormControl,
	FormErrorMessage,
	FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { FC, InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label?: string;
	placehoder?: string;
};

const inputTypeMap = (name: string): string => {
	if (name.includes('password')) return 'password';
	else if (name.includes('email')) return 'email';
	else return 'text';
};

const InputField: FC<InputFieldProps> = ({ label, size, ...props }) => {
	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label ?? props.name}</FormLabel>
			<Input
				{...field}
				{...props}
				type={inputTypeMap(props.name)}
				id={field.name}
				placeholder={props.placeholder ?? props.name}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};

export default InputField;
