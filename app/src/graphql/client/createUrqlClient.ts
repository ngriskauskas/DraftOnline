import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from '@urql/exchange-graphcache';
import router from 'next/router';
import { dedupExchange, errorExchange, fetchExchange } from 'urql';
import { isServer } from '../../utils/isServer';
import cacheConfig from './cacheConfig';

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include' as const,
			headers: isServer()
				? { cookie: ctx?.req?.headers?.cookie } ?? undefined
				: undefined,
		},
		exchanges: [
			devtoolsExchange,
			dedupExchange,
			cacheExchange(cacheConfig),
			errorExchange({
				onError(error) {
					if (error?.message.includes('Not Logged In')) {
						router.replace('/login');
					}
				},
			}),
			ssrExchange,
			fetchExchange,
		],
	};
};
