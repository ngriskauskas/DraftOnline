import {
	LogoutMutation,
	MeQuery,
	MeDocument,
} from '../../../generated/graphql';
import { betterUpdateQuery } from '../betterUpdateQuery';

export const logout = (_result: any, args: any, cache: any, info: any) => {
	betterUpdateQuery<LogoutMutation, MeQuery>(
		cache,
		{ query: MeDocument },
		_result,
		() => ({
			me: null,
		})
	);
};
