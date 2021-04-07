import { CombinedError } from '@urql/core';

type ValidationError = {
	constraints: { [Key: string]: string };
	property: string;
};

export const toErrorMap = (error: CombinedError, defaultKey: string) => {
	const errorMap: Record<string, string> = {};
	error.graphQLErrors.forEach((error) => {
		switch (error.message) {
			case 'Argument Validation Error':
				error.extensions?.exception.validationErrors.forEach(
					(validationError: ValidationError) => {
						errorMap[validationError.property] = Object.values(
							validationError.constraints
						)[0];
					}
				);
				break;
			default:
				errorMap[defaultKey] = error.message;
		}
	});
	return errorMap;
};
