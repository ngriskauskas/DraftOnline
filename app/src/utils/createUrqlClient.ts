import { cacheExchange } from '@urql/exchange-graphcache';
import router from 'next/router';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
	return pipe(
		forward(ops$),
		tap(({ error }) => {
			if (error?.message.includes('Not Logged In')) {
				router.replace('/login');
			}
		})
	);
};

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
			errorExchange,
			ssrExchange,
			fetchExchange,
		],
	};
};
