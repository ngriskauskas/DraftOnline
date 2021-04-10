import {
	FormControl,
	FormErrorMessage,
	FormLabel,
} from '@chakra-ui/form-control';
import { Input, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { FC, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &
	TextareaHTMLAttributes<HTMLTextAreaElement> & {
		name: string;
		label?: string;
		placehoder?: string;
		textarea?: boolean;
	};

const inputTypeMap = (name: string): string => {
	if (name.includes('password')) return 'password';
	else if (name.includes('email')) return 'email';
	else return 'text';
};

const InputField: FC<InputFieldProps> = ({
	label,
	size,
	textarea,
	...props
}) => {
	const [field, { error }] = useField(props);
	const InputComponent = textarea ? Textarea : Input;
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label ?? props.name}</FormLabel>
			<InputComponent
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
