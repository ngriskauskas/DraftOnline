import { useMeQuery } from '../../src/generated/graphql';
import { mockQuery } from './mockQuery';

export const mockMeQuery = (isLoggedIn: boolean, fetching: boolean = false) =>
	mockQuery({
		query: useMeQuery,
		data: {
			me: isLoggedIn
				? {
						id: 1,
						username: 'test',
				  }
				: undefined,
		},
		fetching,
	});
