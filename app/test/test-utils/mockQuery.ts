import { CombinedError } from '@urql/core';

export interface MockQueryParams {
	query: any;
	data?: {} | undefined;
	fetching?: boolean;
}

export const mockQuery = ({
	query,
	data = undefined,
	fetching = false,
}: MockQueryParams) => {
	const mockQuery = jest.fn();
	(query as jest.Mock).mockReturnValue([{ data, fetching }, mockQuery]);
	return mockQuery;
};

export interface MockInterfaceResponseOptions {
	message: string;
	validationErrors?: {
		property: string;
		message: string;
	}[];
}
export const mockErrorResponse = (
	options: MockInterfaceResponseOptions
): CombinedError => {
	const validationErrors = options.validationErrors?.map(
		({ property, message }) => ({
			property,
			constraints: {
				message,
			},
		})
	);
	return {
		name: '',
		message: '',
		graphQLErrors: [
			{
				message: options.message,
				extensions: {
					exception: {
						validationErrors,
					},
				},
				locations: [],
				name: '',
				nodes: [],
				path: [],
				source: undefined,
				positions: [],
				originalError: null,
			},
		],
	};
};
