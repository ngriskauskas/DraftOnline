export const mockMutation = (useMutation: any) => {
	const mutation = jest.fn();
	(useMutation as jest.Mock).mockReturnValue([null, mutation]);
	return mutation;
};

export interface MockInterfaceResponseOptions {
	message: String;
	validationErrors?: {
		property: String;
		message: String;
	}[];
}
export const mockErrorResponse = (options: MockInterfaceResponseOptions) => {
	const validationErrors = options.validationErrors?.map(
		({ property, message }) => ({
			property,
			constraints: {
				message,
			},
		})
	);
	return {
		graphQLErrors: [
			{
				message: options.message,
				extensions: {
					exception: {
						validationErrors,
					},
				},
			},
		],
	};
};
