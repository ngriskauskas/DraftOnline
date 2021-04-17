import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import router from 'next/router';
import { dedupExchange, fetchExchange, stringifyVariables, errorExchange, gql } from 'urql';
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
	Upvote,
	VoteMutationVariables,
	VotePostFragment,
	VotePostFragmentDoc,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { devtoolsExchange } from '@urql/devtools';
import { isServer } from './isServer';

const cursorPagination = (): Resolver => {
	return (parent, fieldArgs, cache, info) => {
		const { parentKey, fieldName } = info;
		const fieldInfos = cache.inspectFields(parentKey).filter((info) => info.fieldName === fieldName);

		if (fieldInfos.length === 0) {
			return undefined;
		}
		info.partial = !cache.resolve(parentKey, `${fieldName}(${stringifyVariables(fieldArgs)})`);

		return fieldInfos.flatMap((info) => cache.resolve(parentKey, info.fieldKey));
	};
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include' as const,
			headers: isServer() ? { cookie: ctx?.req?.headers?.cookie } ?? undefined : undefined,
		},
		exchanges: [
			devtoolsExchange,
			dedupExchange,
			cacheExchange({
				keys: {
					Upvote: () => null,
				},
				resolvers: {
					Query: {
						posts: cursorPagination(),
					},
				},
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
							betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, () => ({
								me: null,
							}));
						},
						createPost: (_result, args, cache, info) => {
							cache
								.inspectFields('Query')
								.filter((info) => info.fieldName === 'posts')
								.forEach((info) => {
									cache.invalidate('Query', 'posts', info.arguments ?? {});
								});
						},
						vote: (_result, args, cache, info) => {
							const { postId, value } = args.input as VoteMutationVariables;
							const post = cache.readFragment(VotePostFragmentDoc, { id: postId } as VotePostFragment);
							if (post) {
								let newPoints;
								let newValue;
								if (!post.upvote) {
									newPoints = post.points + value;
									newValue = value;
								} else {
									if (post.upvote.value === value) {
										newPoints = post.points - value;
										newValue = 0;
									} else {
										newPoints = post.points + value - post.upvote.value;
										newValue = value;
									}
								}
								cache.writeFragment(VotePostFragmentDoc, {
									id: postId,
									points: newPoints,
									upvote: { __typename: 'Upvote', value: newValue },
								});
							}
						},
					},
				},
			}),
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
