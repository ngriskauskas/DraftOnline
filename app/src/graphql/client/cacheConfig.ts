import { cursorPagination } from './cursorPagination';
import { login } from './mutations/login';
import { logout } from './mutations/logout';
import { register } from './mutations/register';
import { createGame } from './mutations/createGame';

const cacheConfig = {
	keys: {
		Upvote: () => null,
	},
	resolvers: {
		Query: {
			games: cursorPagination(),
		},
	},
	updates: {
		Mutation: {
			login,
			register,
			logout,
			createGame,
		},
	},
};

export default cacheConfig;
