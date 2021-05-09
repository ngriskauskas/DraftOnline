import {
	RegisterMutation,
	MeQuery,
	MeDocument,
} from '../../../generated/graphql';
import { betterUpdateQuery } from '../betterUpdateQuery';

export const register = (_result: any, args: any, cache: any, info: any) => {
	betterUpdateQuery<RegisterMutation, MeQuery>(
		cache,
		{ query: MeDocument },
		_result,
		(result, query) => {
			return {
				me: result.register,
			};
		}
	);
};
