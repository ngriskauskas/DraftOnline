import { LoginMutation, MeQuery, MeDocument } from '../../../generated/graphql';
import { betterUpdateQuery } from '../betterUpdateQuery';
import { invalidateAll } from './invalidateAll';

export const login = (_result: any, args: any, cache: any, info: any) => {
	betterUpdateQuery<LoginMutation, MeQuery>(
		cache,
		{ query: MeDocument },
		_result,
		(result, query) => {
			return {
				me: result.login,
			};
		}
	);
	invalidateAll(cache, 'posts');
};
