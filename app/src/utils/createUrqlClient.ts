import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import {
	LoginMutation,
	MeQuery,
	MeDocument,
	RegisterMutation,
	LogoutMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => {
	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include' as const,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				updates: {
					Mutation: {
						login: (_result, args, cache, info) => {
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
						},
						register: (_result, args, cache, info) => {
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
						},
						logout: (_result, args, cache, info) => {
							betterUpdateQuery<LogoutMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								() => ({ me: null })
							);
						},
					},
				},
			}),
			ssrExchange,
			fetchExchange,
		],
	};
};
